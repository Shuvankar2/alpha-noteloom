import dotenv from "dotenv";
dotenv.config(); // must be before using process.env

import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

// 🔎 Debug: check if env variables are loaded
console.log("Loaded ENV:", {
  CLIENT_ID: process.env.CLIENT_ID,
  TENANT_ID: process.env.TENANT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET ? "***HIDDEN***" : "MISSING",
  USER_EMAIL: process.env.USER_EMAIL
});

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ✅ Configure multer (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// === Microsoft Graph API credentials from .env ===
const CLIENT_ID = process.env.CLIENT_ID;
const TENANT_ID = process.env.TENANT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USER_EMAIL = process.env.USER_EMAIL;

// === Get Access Token (Client Credentials Flow) ===
async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("scope", "https://graph.microsoft.com/.default");
  params.append("grant_type", "client_credentials");

  const res = await fetch(url, { method: "POST", body: params });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const data = await res.json();
  return data.access_token;
}

// === Upload File Endpoint ===
app.post("/upload", upload.any(), async (req, res) => {
  try {
    console.log("📥 Incoming upload request...");
    console.log("📂 Received files:", req.files);
    console.log("📝 Received body fields:", req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files[0]; // take first file

    const accessToken = await getAccessToken();

    // ✅ Upload file to OneDrive (root folder)
    const uploadUrl = `https://graph.microsoft.com/v1.0/users/${USER_EMAIL}/drive/root:/${file.originalname}:/content`;

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": file.mimetype,
      },
      body: file.buffer,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const uploadedFile = await uploadRes.json();

    // === Create Shareable Link ===
    const shareRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${USER_EMAIL}/drive/items/${uploadedFile.id}/createLink`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "view", scope: "anonymous" }),
      }
    );

    if (!shareRes.ok) {
      const errorText = await shareRes.text();
      throw new Error(`Share link failed: ${errorText}`);
    }

    const shareData = await shareRes.json();

    res.json({ url: shareData.link.webUrl });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: err.message });
  }
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Backend running at http://localhost:${port}`);
  });
}

export default app;
