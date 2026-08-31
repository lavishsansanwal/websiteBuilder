import fs from 'fs';

const editorCode = fs.readFileSync('../client/src/pages/Editor.jsx', 'utf8');
const lines = editorCode.split('\n');

const navLines = lines.slice(419, 1028);
const navJS = navLines.join('\n');

// Test with acorn/babel in client directory
try {
  new Function(navJS);
  console.log('Valid Function!');
} catch (err) {
  console.log('Error:', err.message);
  // Find binary search
  for (let len = 1; len <= navLines.length; len++) {
    const chunk = navLines.slice(0, len).join('\n') + '\n})();';
    try {
      new Function(chunk);
      console.log(`Working up to line ${len} (${419 + len})`);
    } catch (e) {
      if (!e.message.includes('Unexpected end of input')) {
        console.log(`FIRST REAL ERROR at line ${len} (${419 + len}):`);
        console.log(`Line content: [${navLines[len - 1]}]`);
        console.log(`Error: ${e.message}`);
        break;
      }
    }
  }
}
