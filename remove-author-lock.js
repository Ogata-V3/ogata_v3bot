const fs = require("fs");
const path = require("path");

const targetDir = process.argv[2] || "./scripts/cmds";

const pattern = /[ \t]*const\s+obfuscatedAuthor\s*=\s*String\.fromCharCode\([^)]*\)\s*;\s*if\s*\(\s*module\.exports\.config\.author\s*!==\s*obfuscatedAuthor\s*\)\s*\{[^}]*\}\s*\n?/gs;

let changedFiles = [];
let scannedCount = 0;

function walk(directory) {
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch (e) {
    console.error(`Cannot read directory: ${directory} (${e.message})`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      scannedCount++;
      const content = fs.readFileSync(fullPath, "utf8");
      pattern.lastIndex = 0;
      if (pattern.test(content)) {
        pattern.lastIndex = 0;
        const newContent = content.replace(pattern, "\n");
        fs.writeFileSync(fullPath, newContent, "utf8");
        changedFiles.push(fullPath);
      }
    }
  }
}

console.log(`Scanning: ${targetDir}\n`);
walk(targetDir);

console.log(`Scanned ${scannedCount} .js files.`);
console.log(`Removed author-lock block from ${changedFiles.length} file(s):\n`);
changedFiles.forEach(f => console.log(" -", f));

if (changedFiles.length === 0) {
  console.log("\nNo matches found.");
}
