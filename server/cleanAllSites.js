import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";
import { stripJsonArtifacts } from "./utils/normalizeHtml.js";

async function cleanAllWebsites() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const sites = await Website.find({});
    let cleanedCount = 0;
    for (const site of sites) {
      if (site.latestCode && (site.latestCode.startsWith('{ "code":') || site.latestCode.startsWith('{"code":') || site.latestCode.includes('```'))) {
        site.latestCode = stripJsonArtifacts(site.latestCode);
        await site.save();
        cleanedCount++;
      }
    }
    console.log(`Successfully checked ${sites.length} sites. Cleaned ${cleanedCount} sites with JSON wrapper artifacts.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

cleanAllWebsites();
