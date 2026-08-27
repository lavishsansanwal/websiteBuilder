import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

import Website from "../models/website.model.js";

async function inspect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        let site = await Website.findById("6a8fc4c3c438ac7f645d3a98");
        if (!site) {
            site = await Website.findOne({ title: /FeastDash/i }) || await Website.findOne().sort({ updatedAt: -1 });
        }

        if (!site) {
            console.log("No site found");
            process.exit(1);
        }

        console.log("Found site:", site._id, site.title);
        const code = site.latestCode;
        
        fs.writeFileSync("scripts/feastdash_site.html", code, "utf-8");
        console.log("Saved scripts/feastdash_site.html (length:", code.length, ")");
        process.exit(0);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

inspect();
