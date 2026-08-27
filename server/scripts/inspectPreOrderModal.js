import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function inspectPreOrderModal() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    const code = site.latestCode;
    const modalIdx = code.indexOf("Join the AetherGrid Network");
    console.log("Modal text index:", modalIdx);
    if (modalIdx !== -1) {
      console.log("--- MODAL CODE ---\n", code.slice(modalIdx - 300, modalIdx + 1500));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectPreOrderModal();
