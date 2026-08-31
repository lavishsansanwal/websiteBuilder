import fs from 'fs';

const editorCode = fs.readFileSync('../client/src/pages/Editor.jsx', 'utf8');
const guardStart = editorCode.indexOf('const navigationGuard = `') + 'const navigationGuard = `'.length;
const guardEnd = editorCode.indexOf('`;', guardStart);
const navGuard = editorCode.slice(guardStart, guardEnd);

console.log('--- EXTRACTED NAVIGATION GUARD SCRIPT ---');
const scriptOnly = navGuard.replace(/<script>/gi, '').replace(/<\/script>/gi, '');

try {
  new Function(scriptOnly);
  console.log('NAVIGATION GUARD JAVASCRIPT SYNTAX IS 100% VALID! 🚀');
} catch (err) {
  console.error('SYNTAX ERROR IN NAVIGATION GUARD:', err.message);
  const lines = scriptOnly.split('\n');
  for (let i = 0; i < lines.length; i++) {
    try {
      new Function(lines.slice(0, i + 1).join('\n'));
    } catch (e) {
      console.log(`Error around line ${i + 1}: ${lines[i]}`);
      break;
    }
  }
}
