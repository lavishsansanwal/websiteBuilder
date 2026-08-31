import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Website from "../models/website.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

async function inspectSite() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const site = await Website.findById("6a9507b07a2cc90d9e0af757");
  if (!site) {
    console.log("Site not found!");
    return;
  }
  const lines = site.latestCode.split("\n");
  console.log("Total lines:", lines.length);
  for (let i = Math.max(0, 140); i < Math.min(lines.length, 170); i++) {
    console.log(`L${i+1}: ${lines[i]}`);
  }
  await mongoose.disconnect();
}

inspectSite();
