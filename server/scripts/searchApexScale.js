import fs from "fs";

const html = fs.readFileSync("./apexscale_site.html", "utf8");
const lines = html.split("\n");

console.log("--- SEARCHING APEXSCALE SITE ---");
lines.forEach((line, idx) => {
  if (line.includes("Sign In") || line.includes("GET QUALIFIED LEADS") || line.includes("<form") || line.includes("submitLeadForm") || line.includes("onclick=")) {
    console.log(`Line ${idx + 1}: ${line.trim().slice(0, 120)}`);
  }
});
