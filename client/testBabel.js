import fs from 'fs';
import * as babel from '@babel/parser';

const editorCode = fs.readFileSync('./src/pages/Editor.jsx', 'utf8');

try {
  const ast = babel.parse(editorCode, { sourceType: 'module', plugins: ['jsx'] });
  console.log('Editor.jsx is 100% valid JSX! Ast body statements:', ast.program.body.length);
} catch (err) {
  console.error('BABEL PARSE ERROR IN Editor.jsx:', err.message, 'at line', err.loc);
}
