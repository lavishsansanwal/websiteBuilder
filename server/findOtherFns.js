import fs from "fs";

const html = fs.readFileSync("./vortex_site.html", "utf8");
const lines = html.split("\n");

console.log("--- SEARCHING FOR selectVolumePill and toggleBilling ---");
lines.forEach((line, idx) => {
  if (line.includes("selectVolumePill") || line.includes("toggleBilling") || line.includes("scrollToContact")) {
    console.log(`Line ${idx + 1}:`);
    console.log(lines.slice(Math.max(0, idx - 4), idx + 8).join("\n"));
  }
});
