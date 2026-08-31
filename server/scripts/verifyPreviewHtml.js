import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Website from '../models/website.model.js';
import fs from 'fs';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const site = await Website.findById('6a953d7ed4298bf3113bf5d9');
  const editorCode = fs.readFileSync('../client/src/pages/Editor.jsx', 'utf8');

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

  const guardStart = editorCode.indexOf('const navigationGuard = `') + 'const navigationGuard = `'.length;
  const guardEnd = editorCode.indexOf('`;', guardStart);
  const navGuard = editorCode.slice(guardStart, guardEnd);

  let finalPreview = sanitizedHtml;
  if (/<head[^>]*>/i.test(sanitizedHtml)) {
    finalPreview = sanitizedHtml.replace(/<head[^>]*>/i, (match) => match + "\n" + navGuard);
  } else {
    finalPreview = `${navGuard}${sanitizedHtml}`;
  }

  const scripts = finalPreview.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log(`Found ${scripts.length} script tags in final rendered iframe HTML.`);

  let errorCount = 0;
  scripts.forEach((s, idx) => {
    const body = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    if (!body.trim()) return;
    try {
      new Function(body);
      console.log(`Script #${idx + 1} parsed cleanly with ZERO syntax errors! ✅`);
    } catch (err) {
      errorCount++;
      console.error(`SYNTAX ERROR in Script #${idx + 1}: ${err.message}`);
    }
  });

  if (errorCount === 0) {
    console.log('\n🎉 ALL SCRIPTS IN PREVIEW ARE 100% CLEAN AND SYNTAX-ERROR-FREE! 🎉');
  } else {
    console.error(`\n❌ FOUND ${errorCount} ERRORS!`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
