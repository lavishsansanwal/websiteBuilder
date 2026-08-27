import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function inspectScript() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    const code = site.latestCode;
    const scriptIdx = code.indexOf("<script", code.indexOf("<body"));
    console.log("Body script index:", scriptIdx);
    if (scriptIdx !== -1) {
      console.log("--- SCRIPT CODE ---\n", code.slice(scriptIdx));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectScript();
