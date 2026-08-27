import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function makeModal100PercentWorking() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    if (!site) {
      console.log("Site not found");
      return;
    }

    let code = site.latestCode;

    // Add direct onclick handler to the pre-order submit button
    code = code.replace(
      '<button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] active:scale-[0.99]">',
      '<button type="button" onclick="submitLeadForm(event)" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer">'
    );

    // Also update any other submit buttons in modals
    code = code.replace(
      '<button type="submit"',
      '<button type="button" onclick="submitLeadForm(event)"'
    );

    site.latestCode = code;
    await site.save();
    console.log("Site updated with direct button click handler!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

makeModal100PercentWorking();
