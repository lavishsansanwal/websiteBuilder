import fs from "fs";

const html = fs.readFileSync("./preview_debug.html", "utf8");
const lines = html.split("\n");
console.log("--- LINES 450 to 475 ---");
console.log(lines.slice(450, 475).join("\n"));
