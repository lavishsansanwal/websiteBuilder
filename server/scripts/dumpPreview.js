import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";
import fs from "fs";

async function dumpPreviewHtml() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    const rawCode = site.latestCode;
    
    // Let's write rawCode to a file so we can inspect the exact HTML
    fs.writeFileSync("./preview_debug.html", rawCode, "utf8");
    console.log("preview_debug.html written! Length:", rawCode.length);

    // Check for any duplicate submitLeadForm definitions
    const matches = rawCode.match(/submitLeadForm/g);
    console.log("Total occurrences of 'submitLeadForm':", matches ? matches.length : 0);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

dumpPreviewHtml();
