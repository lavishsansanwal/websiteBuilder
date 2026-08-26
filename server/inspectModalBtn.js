import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function inspectModalBtn() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847") || await Website.findOne().sort({ createdAt: -1 });
    const code = site.latestCode;
    console.log("Site ID:", site._id.toString());
    const modalIdx = code.indexOf("leadModal");
    console.log("leadModal index:", modalIdx);
    if (modalIdx !== -1) {
      console.log("--- EXACT MODAL HTML ---\n", code.slice(modalIdx - 50, modalIdx + 2000));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectModalBtn();
