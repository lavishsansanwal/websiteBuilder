import fs from "fs";

const html = fs.readFileSync("./apexscale_site.html", "utf8");
const lines = html.split("\n");

console.log("--- SEARCHING FOR 'Request Your Custom Demo' ---");
lines.forEach((line, idx) => {
  if (line.includes("Request Your Custom Demo") || line.includes("50 Free Leads") || line.includes("FULL NAME")) {
    console.log(`Line ${idx + 1}:`);
    console.log(lines.slice(Math.max(0, idx - 4), idx + 25).join("\n"));
  }
});
