const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

async function minifyFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const code = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);
  const opts = ext === '.js' ? { compress: { drop_console: true }, mangle: true } : {};
  try {
    const result = await minify(code, opts);
    if (result.code) fs.writeFileSync(filePath, result.code);
  } catch (e) { console.error(`Minify failed for ${filePath}:`, e.message); }
}

async function main() {
  const dir = process.argv[2] || '_site';
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.js') || f.endsWith('.css'));
  for (const f of files) await minifyFile(path.join(dir, f));
  console.log(`✅ Minified ${files.length} files`);
}
main();
