import fs from "fs";

const html = fs.readFileSync("./vortex_site.html", "utf8");
const lines = html.split("\n");

console.log("--- SEARCHING FOR switchDemoStep ---");
lines.forEach((line, idx) => {
  if (line.includes("switchDemoStep")) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
