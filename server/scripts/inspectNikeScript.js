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

  const scriptStart = site.latestCode.lastIndexOf('<script>');
  const script = site.latestCode.slice(scriptStart);
  console.log('--- SCRIPT SECOND HALF ---');
  console.log(script.slice(3000));

  await mongoose.disconnect();
}

run().catch(console.error);
