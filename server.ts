/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User";

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OTP Memory
const otpStorage = new Map<
  string,
  {
    otp: string;
    expiresAt: number;
  }
>();

// Updated for Real Fast2SMS Delivery via v3 route
async function sendRealSMS(
  phone: string,
  otp: string
): Promise<{
  success: boolean;
  provider: string;
  error?: string;
}> {
  const fast2smsKey = process.env.FAST2SMS_API_KEY;

  if (!fast2smsKey) {
    return {
      success: false,
      provider: "none",
      error: "No SMS Gateway Configured",
    };
  }

  try {
    // Testing aur fast delivery ke liye 'route=v3' aur parameter 'variables' set kar diya hai
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(
      fast2smsKey
    )}&route=v3&variables=${otp}&numbers=${phone}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.return === true) {
      return {
        success: true,
        provider: "Fast2SMS",
      };
    }

    return {
      success: false,
      provider: "Fast2SMS",
      error: data.message || "SMS Delivery Failed",
    };
  } catch (err: any) {
    return {
      success: false,
      provider: "Fast2SMS",
      error: err.message,
    };
  }
}

// Send OTP Route (Fixed debugOtp exposure)
app.post("/api/otp/send", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "मोबाइल नंबर आवश्यक है",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    otpStorage.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Local Testing backend logs ke liye rahega, frontend screen par nahi jayega
    console.log(`[DEV ONLY] OTP for ${phone} is: ${otp}`);

    const sms = await sendRealSMS(phone, otp);

    if (!sms.success) {
      console.error("SMS Gateway Error:", sms.error);
    }

    return res.json({
      success: true,
      message: "ओटीपी सफलतापूर्वक भेज दिया गया है।",
      sentViaSMS: sms.success,
      // debugOtp ko yahan se block kar diya hai taaki screen par leakage na ho
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Verify OTP
app.post("/api/otp/verify", async (req, res) => {
  try {
    const {
      phone,
      otpCode,
      isLoginMode,
      name,
      aadhaar,
      village,
      district,
    } = req.body;

    if (!phone || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "मोबाइल नंबर और OTP आवश्यक हैं।",
      });
    }

    // OTP Check
    const cached = otpStorage.get(phone);

    if (!cached) {
      return res.status(400).json({
        success: false,
        message: "OTP नहीं मिला।",
      });
    }

    if (Date.now() > cached.expiresAt) {
      otpStorage.delete(phone);

      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    if (cached.otp !== otpCode) {
      return res.status(400).json({
        success: false,
        message: "गलत OTP",
      });
    }

    otpStorage.delete(phone);

    let citizenData;

    // ==========================
    // LOGIN
    // ==========================
    if (isLoginMode) {

      const existing = await User.findOne({ phone });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "यह mobile number register नहीं है।",
        });
      }

      citizenData = {
        phone: existing.phone,
        name: existing.name,
        aadhaar: existing.aadhaar,
        village: existing.village,
        district: existing.district,
        isLoggedIn: true,
      };

    }

    // ==========================
    // REGISTER
    // ==========================
    else {

      const alreadyExists = await User.findOne({ phone });

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "यह मोबाइल नंबर पहले से रजिस्टर है।",
        });
      }

      const formattedAadhaar = aadhaar
        ? `${aadhaar.substring(0,4)}-XXXX-XXXX`
        : "XXXX-XXXX-1234";

      const newUser = await User.create({
        phone,
        name: name || "अपरिचित नागरिक",
        aadhaar: formattedAadhaar,
        village: village || "",
        district: district || "",
      });

      citizenData = {
        phone: newUser.phone,
        name: newUser.name,
        aadhaar: newUser.aadhaar,
        village: newUser.village,
        district: newUser.district,
        isLoggedIn: true,
      };

    }

    return res.json({
      success: true,
      message: "OTP Verify Successful",
      citizen: citizenData,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});

// ======================================
// Setup Vite Development Middleware
// ======================================

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[SERVER] Starting Vite in development mode...");

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);

  } else {

    console.log("[SERVER] Serving production build...");

    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

  }
}

// ======================================
// Start Server
// ======================================

connectDB()
  .then(async () => {

    await setupVite();

    app.listen(PORT, "0.0.0.0", () => {

      console.log("======================================");
      console.log(`🚀 Server Running`);
      console.log(`🌐 http://localhost:${PORT}`);
      console.log("======================================");

    });

  })
  .catch((err) => {

    console.error("❌ Server Failed:", err);

  });