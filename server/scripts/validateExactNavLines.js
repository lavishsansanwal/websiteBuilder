import fs from 'fs';

const editorCode = fs.readFileSync('../client/src/pages/Editor.jsx', 'utf8');
const lines = editorCode.split('\n');

// Line 420 to 1028
const navLines = lines.slice(419, 1028);
const navJS = navLines.join('\n');

console.log('Total navigation lines:', navLines.length);
console.log('First 5 lines:', navLines.slice(0, 5).join('\n'));
console.log('Last 5 lines:', navLines.slice(-5).join('\n'));

try {
  new Function(navJS);
  console.log('🎉 NAVIGATION GUARD CODE IS 100% CLEAN AND SYNTAX ERROR FREE! 🚀');
} catch (err) {
  console.error('SYNTAX ERROR:', err.message);
  for (let i = 0; i < navLines.length; i++) {
    try {
      new Function(navLines.slice(0, i + 1).join('\n'));
    } catch (e) {
      console.log(`Failed at line ${i + 1} (${419 + i}): ${navLines[i]}`);
      console.log(`Error: ${e.message}`);
      break;
    }
  }
}
