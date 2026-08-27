import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function checkSite(id) {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    let site;
    if (id) {
      site = await Website.findById(id);
    }
    if (!site) {
      site = await Website.findOne().sort({ createdAt: -1 });
    }
    if (!site) {
      console.log("No site found");
      return;
    }
    console.log("SITE ID:", site._id.toString());
    console.log("TITLE:", site.title);
    console.log("CODE LENGTH:", site.latestCode?.length);
    console.log("--- FIRST 40 LINES ---");
    const lines = site.latestCode.split("\n");
    console.log(lines.slice(0, 40).join("\n"));
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

const targetId = process.argv[2] || "6a8dc17561ad71c6cc36429e";
checkSite(targetId);
