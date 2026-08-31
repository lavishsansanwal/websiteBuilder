import fs from 'fs';

const editorCode = fs.readFileSync('../client/src/pages/Editor.jsx', 'utf8');
const guardStart = editorCode.indexOf('const navigationGuard = `') + 'const navigationGuard = `'.length;
const guardEnd = editorCode.indexOf('`;', guardStart);
const navGuard = editorCode.slice(guardStart, guardEnd);
const body = navGuard.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');

const lines = body.split('\n');
for (let i = 0; i < lines.length; i++) {
  const slice = lines.slice(0, i + 1).join('\n');
  try {
    new Function(slice);
  } catch (err) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
    console.log(`--> Error: ${err.message}`);
  }
}
