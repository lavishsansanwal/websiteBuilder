const brokenSnippet2 = `
function render() {
  var grid = document.getElementById('grid');
  grid.innerHTML = '<div class="col-span-full"><p>No archive items match your search filter.</p><button onclick="filterCategory('all'); document.getElementById('productSearchInput').value=\\'\\'; handleProductSearch(\\'\\');" class="btn">Reset Search</button></div>';
}
`;

const brokenLine = `  grid.innerHTML = '<div class="col-span-full text-center py-16 text-slate-500 font-bold uppercase tracking-wider text-xs space-y-3"><i data-lucide="search-x" class="w-10 h-10 mx-auto text-slate-700"></i><p>No archive items match your search filter.</p><button onclick="filterCategory('all'); document.getElementById('productSearchInput').value=\\'\\'; handleProductSearch(\\'\\');" class="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-xs uppercase">Reset Search</button></div>';`;

function repairScriptBody(body) {
  try {
    new Function(body);
    console.log("Valid JS from start!");
    return body;
  } catch (e) {
    console.log("Original body failed syntax check:", e.message);
  }

  // Line-by-line repair
  const lines = body.split("\n");
  const repairedLines = lines.map(line => {
    // If line assigns HTML string with single quotes e.g. .innerHTML = '<div ...';
    if (/\.(?:innerHTML|outerHTML)\s*=\s*'[\s\S]*<\w+[\s\S]*'[\s;]*$/.test(line)) {
      const match = line.match(/^(\s*[\w$.]+\.(?:innerHTML|outerHTML)\s*=\s*)'([\s\S]*)'([;\s]*)$/);
      if (match) {
        const prefix = match[1];
        const inner = match[2];
        const suffix = match[3];
        // Convert to backtick template literal
        return `${prefix}\`${inner}\`${suffix}`;
      }
    }
    // Also check for unescaped onclick="fn('val')" inside innerHTML assignments
    if (/innerHTML\s*=/.test(line) && line.includes("onclick=\"") && line.includes("'")) {
      const firstQuoteIdx = line.indexOf("= '");
      const lastQuoteIdx = line.lastIndexOf("';");
      if (firstQuoteIdx !== -1 && lastQuoteIdx !== -1 && lastQuoteIdx > firstQuoteIdx) {
        const prefix = line.slice(0, firstQuoteIdx + 2); // includes =
        const inner = line.slice(firstQuoteIdx + 3, lastQuoteIdx);
        const suffix = line.slice(lastQuoteIdx + 1); // includes ;
        return `${prefix}\`${inner}\`${suffix}`;
      }
    }
    return line;
  });

  const fixed = repairedLines.join("\n");
  try {
    new Function(fixed);
    console.log("Fixed successfully! ✅");
    return fixed;
  } catch (e2) {
    console.log("Still failed syntax check:", e2.message);
    return fixed;
  }
}

const wholeScript = `
function render() {
  var grid = document.getElementById('grid');
${brokenLine}
}
`;

repairScriptBody(wholeScript);
