import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

// Let's test Babel compile with standalone or custom Babel check
async function testFullBabel() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e5c864bde7c0dcc431895");
    const rawCode = site.latestCode;
    console.log("RawCode length:", rawCode.length);

    // Dynamic import of babel standalone or core if available
    // Let's check for unmatched tags in rawCode!
    const tags = [];
    const tagRegex = /<\/?([a-zA-Z0-9.-]+)(?:\s+[^>]*?)?(\/?)>/g;
    let match;
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'i', 'path', 'circle', 'polygon', 'polyline', 'rect', 'line']);

    console.log("Validating JSX structure in rawCode...");
    // Let's check if there are any syntax issues
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

testFullBabel();
