import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";
import { injectRealImages } from "../utils/injectImages.js";

async function fixAudioSite() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8ed2d414f694a199bd5def");
    if (!site) {
      console.log("Site not found");
      return;
    }

    console.log("Fixing images for site:", site.title);
    let code = site.latestCode;
    
    // Replace the first occurrence of the smartwatch on wrist photo (Chrono Watch Ultra) with minimalist black watch photo
    const firstWatchIdx = code.indexOf("https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1");
    if (firstWatchIdx !== -1) {
      code = code.substring(0, firstWatchIdx) + 
             "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80" + 
             code.substring(firstWatchIdx + "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80".length);
    }

    site.latestCode = code;
    await site.save();
    console.log("Successfully updated Aura Chrono Watch Ultra to unique photo!");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

fixAudioSite();
