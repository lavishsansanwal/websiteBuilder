import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function testCleanPipeline() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e5c864bde7c0dcc431895");
    const rawCode = site.latestCode;
    console.log("Original rawCode length:", rawCode.length);

    // Let's print the first 50 lines of rawCode
    const rawLines = rawCode.split("\n");
    console.log("Total raw lines:", rawLines.length);
    console.log("--- FIRST 30 LINES OF RAW CODE ---");
    console.log(rawLines.slice(0, 30).join("\n"));

    // Let's find where "Glow background elements" is in rawLines
    const glowLineIdx = rawLines.findIndex(l => l.includes("Glow background elements"));
    console.log("Line number of 'Glow background elements' in rawLines:", glowLineIdx + 1);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

testCleanPipeline();
