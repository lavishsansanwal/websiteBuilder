import fs from "fs";

const html = fs.readFileSync("./preview_debug.html", "utf8");
const lines = html.split("\n");
lines.forEach((line, idx) => {
  if (line.includes("submitLeadForm")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
