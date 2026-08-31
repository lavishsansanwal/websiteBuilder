import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Website from '../models/website.model.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const site = await Website.findById('6a953d7ed4298bf3113bf5d9');
  if (!site) {
    console.log('Site not found');
    process.exit(1);
  }

  const code = site.latestCode;
  console.log('Validating all onclick handlers...');
  const onclickRegex = /onclick="([^"]*)"/g;
  let match;
  let count = 0;
  while ((match = onclickRegex.exec(code)) !== null) {
    count++;
    const handler = match[1];
    try {
      new Function(handler);
    } catch (err) {
      console.error(`ERROR in onclick #${count}: [${handler}] -> ${err.message}`);
    }
  }
  console.log(`Checked ${count} onclick handlers.`);

  console.log('Validating all on* attributes...');
  const allEventsRegex = /on(click|change|input|submit|keyup|keydown)="([^"]*)"/g;
  let eventMatch;
  let evCount = 0;
  while ((eventMatch = allEventsRegex.exec(code)) !== null) {
    evCount++;
    const evHandler = eventMatch[2];
    try {
      new Function(evHandler);
    } catch (err) {
      console.error(`ERROR in ${eventMatch[1]} #${evCount}: [${evHandler}] -> ${err.message}`);
    }
  }
  console.log(`Checked ${evCount} event handlers.`);

  console.log('Validating script tags...');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let sCount = 0;
  while ((scriptMatch = scriptRegex.exec(code)) !== null) {
    sCount++;
    const scriptBody = scriptMatch[1];
    if (!scriptBody.trim()) continue;
    try {
      new Function(scriptBody);
      console.log(`Script #${sCount} parsed successfully!`);
    } catch (err) {
      console.error(`ERROR in script #${sCount}: ${err.message}`);
      // Find line
      const lines = scriptBody.split('\n');
      for (let i = 0; i < lines.length; i++) {
        try {
          new Function(lines.slice(0, i + 1).join('\n'));
        } catch (e) {
          console.log(`Error around script line ${i + 1}: ${lines[i]}`);
          break;
        }
      }
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
