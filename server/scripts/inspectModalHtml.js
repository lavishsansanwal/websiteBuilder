import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function inspectModalHtml() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847") || await Website.findOne().sort({ createdAt: -1 });
    const code = site.latestCode;
    const modalTagIdx = code.indexOf('<div id="leadModal"');
    console.log("modalTagIdx:", modalTagIdx);
    if (modalTagIdx !== -1) {
      console.log("--- MODAL HTML ---");
      console.log(code.slice(modalTagIdx, modalTagIdx + 3000));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectModalHtml();
