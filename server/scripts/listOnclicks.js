import fs from "fs";

const html = fs.readFileSync("./vortex_site.html", "utf8");
const matches = html.match(/onclick="([^"]+)"/g) || [];
const uniqueOnclicks = [...new Set(matches)];
console.log("All unique onclick handlers in generated HTML:");
uniqueOnclicks.forEach(u => console.log(u));
