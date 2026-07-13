const fs = require("fs");
const path = require("path");

const targetDir = process.argv[2] || "./scripts/cmds";

const startRegex = /String\.fromCharCode\(\s*77\s*,\s*97\s*,\s*104\s*,\s*77\s*,\s*85\s*,\s*68\s*\)/;

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (startRegex.test(lines[i])) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return false;

  let braceDepth = 0;
  let openFound = false;
  let endIdx = -1;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (ch === "{") {
        braceDepth++;
        openFound = true;
      } else if (ch === "}") {
        braceDepth--;
      }
    }
    if (openFound && braceDepth === 0) {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) return false;

  const newLines = lines.slice(0, startIdx).concat(lines.slice(endIdx + 1));
  fs.writeFileSync(filePath, newLines.join("\n"), "utf8");
  return true;
}

function walk(dir) {
  let changed = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    console.error(`Cannot read directory: ${dir} (${e.message})`);
    return changed;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      changed = changed.concat(walk(full));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      try {
        if (processFile(full)) changed.push(full);
      } catch (e) {
        console.error(`Error processing ${full}: ${e.message}`);
      }
    }
  }
  return changed;
}

console.log(`Scanning: ${targetDir}\n`);
const changed = walk(targetDir);
console.log(`Fixed ${changed.length} file(s):\n`);
changed.forEach(f => console.log(" -", f));
if (changed.length === 0) {
  console.log("\nNo matches found.");
}
