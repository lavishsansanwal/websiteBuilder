import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Website from '../models/website.model.js';
import fs from 'fs';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const site = await Website.findById('6a953d7ed4298bf3113bf5d9');
  if (!site) {
    console.log('Site not found');
    process.exit(1);
  }

  // Read Editor.jsx to extract navigationGuard and sanitization logic
  const editorCode = fs.readFileSync('../client/src/pages/Editor.jsx', 'utf8');

  // Let's inspect site.latestCode line 582
  const lines = site.latestCode.split('\n');
  console.log('--- RAW SITE CODE LINES 570-595 ---');
  for (let i = 569; i < Math.min(lines.length, 595); i++) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
  }

  // Let's simulate getPreviewCode
  const unescaped = site.latestCode
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  let sanitizedHtml = unescaped
    .replace(/<script>(?:(?!<\/script>)[\s\S])*?__DEFENSIVE_HELPERS__[\s\S]*?<\/script>/gi, "")
    .replace(/<script>(?:(?!<\/script>)[\s\S])*?Auto-initialize Lucide Icons[\s\S]*?<\/script>/gi, "")
    .replace(/<div[^>]*class="[^"]*h-14[^"]*"[^>]*>[\s\S]*?Live Preview[\s\S]*?Deploy[\s\S]*?<\/div>/gi, "")
    .replace(/<header[^>]*class="[^"]*h-14[^"]*"[^>]*>[\s\S]*?Live Preview[\s\S]*?Deploy[\s\S]*?<\/header>/gi, "");

  // Find navigationGuard in Editor.jsx
  const guardStart = editorCode.indexOf('const navigationGuard = `') + 25;
  const guardEnd = editorCode.indexOf('`;', guardStart);
  const navGuard = editorCode.slice(guardStart, guardEnd);

  let finalPreview = sanitizedHtml;
  if (/<head[^>]*>/i.test(sanitizedHtml)) {
    finalPreview = sanitizedHtml.replace(/<head[^>]*>/i, (match) => match + "\n" + navGuard);
  } else {
    finalPreview = `${navGuard}${sanitizedHtml}`;
  }

  const finalLines = finalPreview.split('\n');
  console.log('--- FINAL PREVIEW (SRCDOC) LINES 570-595 ---');
  for (let i = 565; i < Math.min(finalLines.length, 595); i++) {
    console.log(`Line ${i + 1}: ${finalLines[i]}`);
  }

  console.log(`\nEXACT LINE 582:`);
  console.log(finalLines[581]);
  console.log(`\nCol 105 of Line 582:`);
  if (finalLines[581]) {
    console.log(finalLines[581].slice(80, 130));
  }

  await mongoose.disconnect();
}

run().catch(console.error);
