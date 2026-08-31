import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Website from "../models/website.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

async function checkLatestWebsites() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const sites = await Website.find().sort({ updatedAt: -1 }).limit(5);
  console.log("Recent sites found:", sites.length);
  for (const s of sites) {
    console.log({
      id: s._id,
      prompt: s.prompt?.substring(0, 40),
      codeLength: s.latestCode?.length,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    });
    // Check if code has syntax errors inside script
    if (s.latestCode) {
      const scriptMatches = s.latestCode.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
      if (scriptMatches) {
        scriptMatches.forEach((sm, idx) => {
          const innerJs = sm.replace(/<\/?script[\s\S]*?>/gi, "");
          if (!sm.includes("src=") && innerJs.trim().length > 50) {
            try {
              new Function(innerJs);
              console.log(`  Site ${s._id} script #${idx}: VALID JS ✅`);
            } catch (err) {
              console.log(`  Site ${s._id} script #${idx}: SYNTAX ERROR ❌ ${err.message}`);
            }
          }
        });
      }
    }
  }
  await mongoose.disconnect();
}

checkLatestWebsites();
