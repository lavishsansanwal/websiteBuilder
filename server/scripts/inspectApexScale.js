import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";
import fs from "fs";

async function inspectApexScale() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e9f1952004025128566b6");
    if (!site) {
      console.log("Site not found!");
      return;
    }
    console.log("Site found. Title:", site.title);
    fs.writeFileSync("./apexscale_site.html", site.latestCode, "utf8");
    console.log("Written to apexscale_site.html. Total length:", site.latestCode.length);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

inspectApexScale();
