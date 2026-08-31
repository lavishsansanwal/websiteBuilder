import fs from 'fs';

const editorCode = fs.readFileSync('../client/src/pages/Editor.jsx', 'utf8');

const guardStart = editorCode.indexOf('const navigationGuard = `\n<script>') + 'const navigationGuard = `\n<script>'.length;
const guardEnd = editorCode.indexOf('</script>`;', guardStart);
const navGuardJS = editorCode.slice(guardStart, guardEnd);

console.log('--- NAVIGATION GUARD JS CONTENT ---');
console.log('Length:', navGuardJS.length);

try {
  new Function(navGuardJS);
  console.log('🎉 NAVIGATION GUARD JAVASCRIPT IS 100% VALID WITH ZERO SYNTAX ERRORS! 🎉');
} catch (err) {
  console.error('SYNTAX ERROR:', err.message);
}
