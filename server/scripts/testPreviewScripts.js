import fs from 'fs';

const editorCode = fs.readFileSync('../client/src/pages/Editor.jsx', 'utf8');

// Extract getPreviewCode function body
const funcStart = editorCode.indexOf('const getPreviewCode = () => {');
const funcEnd = editorCode.indexOf('function WebsiteEditor() {', funcStart);
const getPreviewCodeStr = editorCode.slice(funcStart, funcEnd);

// Let's create the function in node
const testFunc = new Function('code', `
  const unescaped = (code || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  ${getPreviewCodeStr.replace('const getPreviewCode = () => {', '').replace(/return \`[\s\S]*?React Live Preview[\s\S]*?;\s*}/i, '')}
`);

const rawHtml = '<!DOCTYPE html><html><head></head><body><h1>Hello</h1></body></html>';
const generatedHtml = testFunc(rawHtml);
console.log('--- GENERATED PREVIEW HTML ---');
console.log('HTML Length:', generatedHtml.length);

// Check all script tags inside generated HTML
const scripts = generatedHtml.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Found scripts:', scripts.length);
scripts.forEach((s, idx) => {
  const body = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
  if (!body.trim()) return;
  try {
    new Function(body);
    console.log(`Script #${idx + 1} is SYNTACTICALLY VALID! ✅`);
  } catch (err) {
    console.error(`SYNTAX ERROR in script #${idx + 1}: ${err.message}`);
    const lines = body.split('\n');
    for (let i = 0; i < lines.length; i++) {
      try {
        new Function(lines.slice(0, i + 1).join('\n'));
      } catch (e) {
        console.log(`Error around line ${i + 1}: [${lines[i]}]`);
        break;
      }
    }
  }
});
