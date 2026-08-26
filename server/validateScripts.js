import fs from "fs";

const html = fs.readFileSync("./preview_debug.html", "utf8");
const scriptMatches = html.match(/<script[\s\S]*?<\/script>/gi);

scriptMatches.forEach((s, idx) => {
  if (!s.includes("src=")) {
    console.log(`Testing Script ${idx + 1}...`);
    const js = s.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
    try {
      new Function(js);
      console.log(`Script ${idx + 1} syntax: VALID ✅`);
    } catch (err) {
      console.error(`Script ${idx + 1} syntax: ERROR ❌`, err.message);
    }
  }
});
