import fs from "fs";

const html = fs.readFileSync("./vortex_site.html", "utf8");
const lines = html.split("\n");

console.log("--- LINES 710 to 820 (DEMO PANELS) ---");
console.log(lines.slice(710, 820).join("\n"));
