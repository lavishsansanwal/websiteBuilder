import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function inspectKronos() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8eb7ef5747e01908c9814b");
    if (!site) {
      console.log("Site 6a8eb7ef5747e01908c9814b not found");
      return;
    }
    console.log("Found site:", site.title, "Length:", site.latestCode.length);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

inspectKronos();
