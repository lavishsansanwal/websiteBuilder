import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folders = [
    "websites",
    "Dashboard"
];
const outputFile = path.join(
    __dirname,
    "dataset.jsonl"
);

let dataset = [];

for (const folder of folders) {

    const folderPath = path.join(
        __dirname,
        folder
    );

    if (!fs.existsSync(folderPath)) {
        console.log(`Folder not found: ${folder}`);
        continue;
    }

    const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".json"));

    console.log(
        `Found ${files.length} JSON files in ${folder}`
    );

    for (const file of files) {

        const filePath = path.join(
            folderPath,
            file
        );

        try {

            const content = fs.readFileSync(
                filePath,
                "utf-8"
            );

            const json = JSON.parse(content);

            dataset.push(json);

            console.log(
                `Added: ${folder}/${file}`
            );

        } catch (error) {

            console.log(
                `Error reading ${file}:`,
                error.message
            );

        }

    }

}

const jsonlContent = dataset
    .map((item) => JSON.stringify(item))
    .join("\n");

fs.writeFileSync(
    outputFile,
    jsonlContent,
    "utf-8"
);

console.log("\n==============================");
console.log("DATASET CREATED SUCCESSFULLY");
console.log("==============================");
console.log(`Total examples: ${dataset.length}`);
console.log(`Saved to: ${outputFile}`);