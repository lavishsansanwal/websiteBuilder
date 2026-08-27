import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function checkImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8eb7ef5747e01908c9814b");
    if (!site) return;

    const regex = /https:\/\/images\.unsplash\.com\/[^\s"'>)]+/g;
    const matches = [...new Set(site.latestCode.match(regex) || [])];

    console.log(`Found ${matches.length} unique Unsplash images. Testing HTTP status...`);

    const results = [];
    for (const url of matches) {
      try {
        const res = await fetch(url, { method: "HEAD" });
        console.log(`[${res.status}] ${url.slice(0, 70)}...`);
        results.push({ url, status: res.status });
      } catch (err) {
        console.log(`[ERR: ${err.message}] ${url.slice(0, 70)}...`);
        results.push({ url, status: 0, error: err.message });
      }
    }

    const broken = results.filter(r => r.status !== 200);
    console.log(`Total broken images: ${broken.length}`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkImages();
