import fs from "fs";

const html = fs.readFileSync("./vortex_site.html", "utf8");
const lines = html.split("\n");

console.log("--- LINES 700 to 730 ---");
console.log(lines.slice(700, 730).join("\n"));
