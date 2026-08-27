import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function testWebsiteModel() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8eb7ef5747e01908c9814b");
    console.log("Site found:", site?.title);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

testWebsiteModel();
