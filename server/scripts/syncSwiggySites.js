import mongoose from "mongoose";
import dotenv from "dotenv";
import Website from "../models/website.model.js";
import { normalizeHtml } from "../utils/normalizeHtml.js";

dotenv.config();

const SITE_IDS = ["6a8fd031d891cf44ff2194e9", "6a8fc4c3c438ac7f645d3a98"];

async function updateSites() {
    try {
        const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("No MongoDB URI in env");
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");

        // Read latest code from the existing working updated site or script
        const sourceSite = await Website.findById("6a8fc4c3c438ac7f645d3a98");
        if (!sourceSite) {
            console.error("Source site not found");
            process.exit(1);
        }

        for (const id of SITE_IDS) {
            const targetSite = await Website.findById(id);
            if (targetSite) {
                targetSite.latestCode = sourceSite.latestCode;
                await targetSite.save();
                console.log(`Updated site ${id} (${targetSite.title}) with full 72-dish Swiggy platform!`);
            }
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateSites();
