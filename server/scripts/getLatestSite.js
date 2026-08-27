import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function getLatestWebsite() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findOne().sort({ createdAt: -1 });
    if (!site) {
      console.log("No site found");
      return;
    }
    console.log("LATEST SITE ID:", site._id.toString());
    console.log("TITLE:", site.title);
    console.log("CODE LENGTH:", site.latestCode?.length);
    console.log("IS HTML:", site.latestCode?.includes("<!DOCTYPE html>"));
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

getLatestWebsite();
