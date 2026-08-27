import fs from "fs";

const html = fs.readFileSync("./apexscale_site.html", "utf8");
const lines = html.split("\n");

console.log("--- LINES 380 to 460 ---");
console.log(lines.slice(380, 460).join("\n"));
