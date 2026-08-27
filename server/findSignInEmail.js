import fs from "fs";

const html = fs.readFileSync("./vortex_site.html", "utf8");
const lines = html.split("\n");

console.log("--- SEARCHING FOR 'Sign In with Email' ---");
lines.forEach((line, idx) => {
  if (line.includes("Sign In with Email") || line.includes("openSignInModal") || line.includes("Sign In with")) {
    console.log(`Line ${idx + 1}:`);
    console.log(lines.slice(Math.max(0, idx - 4), idx + 8).join("\n"));
  }
});
