import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function inspectForm() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    const code = site.latestCode;
    console.log("Searching for form elements in website...");
    const formIdx = code.indexOf("<form");
    console.log("First <form index:", formIdx);
    if (formIdx !== -1) {
      console.log("--- FORM 1 SNIPPET ---\n", code.slice(formIdx - 100, formIdx + 1200));
    }
    const scriptIdx = code.lastIndexOf("<script>");
    if (scriptIdx !== -1) {
      console.log("--- LAST SCRIPT TAG ---\n", code.slice(scriptIdx, scriptIdx + 1500));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectForm();
