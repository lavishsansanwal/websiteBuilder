import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function inspectLatestWebsite() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findOne().sort({ createdAt: -1 });
    if (!site) {
      console.log("No websites found");
      return;
    }
    console.log("LATEST WEBSITE ID:", site._id);
    console.log("TITLE:", site.title);
    console.log("CODE LENGTH:", site.latestCode?.length);
    console.log("FIRST 500 CHARS:\n", site.latestCode?.slice(0, 500));
    console.log("LAST 500 CHARS:\n", site.latestCode?.slice(-500));
  } catch (err) {
    console.error("Inspect error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectLatestWebsite();
