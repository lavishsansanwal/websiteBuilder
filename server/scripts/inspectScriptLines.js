import fs from "fs";

const html = fs.readFileSync("./preview_debug.html", "utf8");
const lines = html.split("\n");
console.log("--- LINES 170 to 220 ---");
console.log(lines.slice(170, 220).join("\n"));
