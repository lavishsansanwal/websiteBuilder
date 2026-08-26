import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function testBabelCompile() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8dc17561ad71c6cc36429e") || await Website.findOne().sort({ createdAt: -1 });
    const code = site.latestCode;
    console.log("Testing site ID:", site._id.toString());
    console.log("Total length:", code.length);

    // Let's search for "Glow background elements" in this code!
    const glowIndex = code.indexOf("Glow background elements");
    console.log("Index of 'Glow background elements':", glowIndex);
    if (glowIndex !== -1) {
      console.log("Surrounding code around 'Glow background elements':\n", code.slice(glowIndex - 200, glowIndex + 400));
    }
  } catch (err) {
    console.error("Test error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

testBabelCompile();
