import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Website from "../models/website.model.js";
import { normalizeHtml } from "../utils/normalizeHtml.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

function repairScriptBody(body) {
  try {
    new Function(body);
    return body;
  } catch (e) {
    console.log("Script block had error:", e.message);
  }

  const lines = body.split("\n");
  const repairedLines = lines.map(line => {
    // If line assigns HTML string with single quotes e.g. .innerHTML = '<div ...';
    if (/\.(?:innerHTML|outerHTML)\s*=\s*'[\s\S]*<\w+[\s\S]*'[\s;]*$/.test(line)) {
      const match = line.match(/^(\s*[\w$.]+\.(?:innerHTML|outerHTML)\s*=\s*)'([\s\S]*)'([;\s]*)$/);
      if (match) {
        return `${match[1]}\`${match[2]}\`${match[3]}`;
      }
    }
    if (/innerHTML\s*=/.test(line) && line.includes("onclick=") && line.includes("'")) {
      const firstQuoteIdx = line.indexOf("= '");
      const lastQuoteIdx = line.lastIndexOf("';");
      if (firstQuoteIdx !== -1 && lastQuoteIdx !== -1 && lastQuoteIdx > firstQuoteIdx) {
        const prefix = line.slice(0, firstQuoteIdx + 2);
        const inner = line.slice(firstQuoteIdx + 3, lastQuoteIdx);
        const suffix = line.slice(lastQuoteIdx + 1);
        return `${prefix}\`${inner}\`${suffix}`;
      }
    }
    return line;
  });

  const fixed = repairedLines.join("\n");
  try {
    new Function(fixed);
    console.log("Script block successfully repaired! ✅");
    return fixed;
  } catch (e2) {
    console.log("Still has error after repair:", e2.message);
    return fixed;
  }
}

async function repairSite() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const site = await Website.findById("6a9507b07a2cc90d9e0af757");
  if (!site) return;

  let fixedCode = site.latestCode.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, body) => {
    if (!attrs.includes("src=") && body.trim().length > 20) {
      const clean = repairScriptBody(body);
      return `<script${attrs}>${clean}</script>`;
    }
    return match;
  });

  site.latestCode = fixedCode;
  await site.save();
  console.log("Site 6a9507b07a2cc90d9e0af757 saved and repaired in DB! ✅");
  await mongoose.disconnect();
}

repairSite();
