import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function findScripts() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    const code = site.latestCode;
    const regex = /<script[\s\S]*?<\/script>/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(code)) !== null) {
      count++;
      console.log(`--- SCRIPT ${count} (length ${match[0].length}) ---`);
      console.log(match[0].slice(0, 400));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

findScripts();
