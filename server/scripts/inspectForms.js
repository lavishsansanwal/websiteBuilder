import fs from "fs";

const html = fs.readFileSync("./preview_debug.html", "utf8");
const lines = html.split("\n");
console.log("--- FORM 1 (around line 473) ---");
console.log(lines.slice(465, 495).join("\n"));

console.log("--- FORM 2 (around line 1292) ---");
console.log(lines.slice(1285, 1315).join("\n"));
