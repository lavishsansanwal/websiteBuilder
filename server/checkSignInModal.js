import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function checkSiteCode() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e80142b49f9f21a67d8c7");
    if (!site) {
      console.log("Site not found");
      return;
    }
    const code = site.latestCode;
    console.log("Searching latestCode for openSignInModal...");
    const lines = code.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("openSignInModal") || line.includes("Sign In with") || line.includes("Sign In")) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkSiteCode();
