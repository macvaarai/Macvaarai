const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Fix ALL broken template strings (fetch, src, assignment)
      content = content.replace(
        /'\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:8000'\}\/([^']*)'/g,
        "`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/$1`"
      );

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${fullPath}`);
      }
    }
  });
}

walkDir(srcDir);
console.log('Done!');
