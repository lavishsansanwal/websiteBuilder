import fs from "fs";

const html = fs.readFileSync("./vortex_site.html", "utf8");
const lines = html.split("\n");

console.log("--- SEARCHING FOR MODALS IN VORTEX SITE ---");
lines.forEach((line, idx) => {
  if (line.includes("modal") || line.includes("Modal") || line.includes("Sign In")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
