import fs from "fs";

const html = fs.readFileSync("./vortex_site.html", "utf8");
const lines = html.split("\n");

console.log("--- SEARCHING FOR TABS / BUTTONS ---");
lines.forEach((line, idx) => {
  if (line.includes("Capture Data") || line.includes("Verify & Enrich") || line.includes("Automate Action")) {
    console.log(`Line ${idx + 1}:`);
    console.log(lines.slice(Math.max(0, idx - 5), idx + 10).join("\n"));
  }
});
