import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function checkModals() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e80142b49f9f21a67d8c7");
    const code = site.latestCode;
    const modalMatches = code.match(/id="[^"]*modal[^"]*"/gi) || [];
    console.log("Found modal IDs:", modalMatches);

    const dialogMatches = code.match(/id="[^"]*dialog[^"]*"/gi) || [];
    console.log("Found dialog IDs:", dialogMatches);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkModals();
