// build-slides.js
// Run: node build-slides.js

const fs   = require('fs');
const path = require('path');

const IMAGES_DIR   = path.join(__dirname, 'images');
const HTML_FILE    = path.join(__dirname, 'index.html');
const EXTENSIONS   = ['.jpg', '.jpeg', '.png', '.webp'];
const START_MARKER = '<!-- SLIDES:START -->';
const END_MARKER   = '<!-- SLIDES:END -->';

// 1. Read images
const files = fs.readdirSync(IMAGES_DIR)
  .filter(f => EXTENSIONS.includes(path.extname(f).toLowerCase()))
  .sort();

console.log(`Found ${files.length} images`);

// 2. Build slide HTML
const slides = files.map((file, i) => {
  const active = i === 0 ? ' active' : '';
  return `    <div class="slide${active}"><img src="images/${file}" alt=""></div>`;
}).join('\n');

// 3. Read index.html
let html = fs.readFileSync(HTML_FILE, 'utf8');
console.log(`index.html length: ${html.length}`);

const startIdx = html.indexOf(START_MARKER);
const endIdx   = html.indexOf(END_MARKER);
console.log(`START marker at: ${startIdx}, END marker at: ${endIdx}`);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find markers');
  process.exit(1);
}

const before = html.slice(0, startIdx + START_MARKER.length);
const after  = html.slice(endIdx);
html = before + '\n' + slides + '\n    ' + after;

fs.writeFileSync(HTML_FILE, html, 'utf8');
console.log(`Done — ${files.length} slides written`);