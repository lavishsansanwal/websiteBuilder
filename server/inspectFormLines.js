import fs from "fs";

const html = fs.readFileSync("./apexscale_site.html", "utf8");
const lines = html.split("\n");

console.log("--- LINES 1070 to 1140 ---");
console.log(lines.slice(1070, 1140).join("\n"));
