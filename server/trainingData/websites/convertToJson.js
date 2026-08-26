import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read website-05.html
const htmlPath = path.join(
    __dirname,
    "website-05.html"
);

const html = fs.readFileSync(
    htmlPath,
    "utf-8"
);

// Create training data
const trainingData = {
    input: {
        pageType: "website",
        prompt: "Create a premium modern website with a professional, responsive and interactive design."
    },

    output: {
        message:
            "A premium modern responsive website with interactive functionality.",
        code: html
    }
};

// Save as website-05.json
const jsonPath = path.join(
    __dirname,
    "website-05.json"
);

fs.writeFileSync(
    jsonPath,
    JSON.stringify(trainingData, null, 2),
    "utf-8"
);

console.log(
    "website-05.json created successfully!"
);