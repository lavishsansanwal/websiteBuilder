import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

function unescapeCode(str) {
  if (!str || typeof str !== "string") return "";
  let clean = str;
  if (clean.includes("\\n")) {
    clean = clean.replace(/\\n/g, "\n");
  }
  if (clean.includes("\\r")) {
    clean = clean.replace(/\\r/g, "\r");
  }
  if (clean.includes("\\t")) {
    clean = clean.replace(/\\t/g, "\t");
  }
  if (clean.includes('\\"')) {
    clean = clean.replace(/\\"/g, '"');
  }
  return clean;
}

async function testFix() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const sites = await Website.find();
    console.log(`Found ${sites.length} websites in DB.`);
    for (const site of sites) {
      if (site.latestCode && site.latestCode.includes("\\n")) {
        console.log(`Unescaping website ${site._id}...`);
        site.latestCode = unescapeCode(site.latestCode);
        await site.save();
      }
    }
    console.log("All websites unescaped successfully!");
  } catch (err) {
    console.error("Test fix error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

testFix();
