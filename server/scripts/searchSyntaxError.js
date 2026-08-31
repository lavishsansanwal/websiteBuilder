import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Website from "../models/website.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

async function searchIssue() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const site = await Website.findById("6a9507b07a2cc90d9e0af757");
  
  // Search for 'filterCategory'
  const lines = site.latestCode.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("filterCategory") || line.includes("VM146") || (line.includes("<script") && line.includes("all"))) {
      console.log(`Line ${idx+1}: ${line.substring(0, 150)}`);
    }
  });

  // Let's check all <script> blocks
  const scriptMatches = site.latestCode.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
  console.log("Total <script> blocks found:", scriptMatches ? scriptMatches.length : 0);
  if (scriptMatches) {
    scriptMatches.forEach((sm, i) => {
      const code = sm.replace(/<\/?script[\s\S]*?>/gi, "");
      try {
        new Function(code);
        console.log(`Script block #${i}: OK ✅`);
      } catch (err) {
        console.log(`Script block #${i}: ERROR ❌ ${err.message}`);
        // print snippet of failure
        const sLines = code.split("\n");
        sLines.forEach((sl, sIdx) => {
          if (sIdx >= 145 && sIdx <= 165) {
            console.log(`  sLine ${sIdx+1}: ${sl}`);
          }
        });
      }
    });
  }

  // Also let's check all onclick attributes in the HTML
  const onclickMatches = site.latestCode.match(/onclick="([^"]*)"/gi);
  console.log("Total onclicks found:", onclickMatches ? onclickMatches.length : 0);
  if (onclickMatches) {
    onclickMatches.forEach((oc, i) => {
      const expr = oc.replace(/onclick="/i, "").replace(/"$/, "");
      try {
        new Function(expr);
      } catch (err) {
        console.log(`onclick #${i} ERROR: [${expr}] -> ${err.message}`);
      }
    });
  }

  await mongoose.disconnect();
}

searchIssue();
