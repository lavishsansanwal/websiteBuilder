import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function findSiteWithGlow() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const sites = await Website.find();
    console.log(`Checking ${sites.length} websites...`);
    for (const site of sites) {
      if (site.latestCode && site.latestCode.includes("Glow background elements")) {
        console.log("MATCH FOUND! Site ID:", site._id.toString());
        console.log("Title:", site.title);
        const idx = site.latestCode.indexOf("Glow background elements");
        console.log("SURROUNDING 500 CHARS:\n", site.latestCode.slice(Math.max(0, idx - 200), idx + 500));
      }
    }
  } catch (err) {
    console.error("Find error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

findSiteWithGlow();
