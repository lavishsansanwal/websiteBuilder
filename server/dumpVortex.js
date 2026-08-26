import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";
import fs from "fs";

async function dumpVortexSite() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e80142b49f9f21a67d8c7");
    if (!site) {
      console.log("Site 6a8e80142b49f9f21a67d8c7 not found!");
      return;
    }
    const rawCode = site.latestCode;
    fs.writeFileSync("./vortex_site.html", rawCode, "utf8");
    console.log("vortex_site.html written! Length:", rawCode.length);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

dumpVortexSite();
