import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function inspectHeroForm() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    const code = site.latestCode;
    const heroFormIdx = code.indexOf("Ready to Power");
    console.log("Hero form text index:", heroFormIdx);
    if (heroFormIdx !== -1) {
      console.log("--- HERO FORM CONTAINER ---\n", code.slice(heroFormIdx - 200, heroFormIdx + 2000));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectHeroForm();
