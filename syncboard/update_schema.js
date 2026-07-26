const fs = require('fs');
let lines = fs.readFileSync('prisma/schema.prisma', 'utf8').split('\n');
let out = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '}') {
    let isModelOrEnum = false;
    for (let k = i - 1; k >= 0; k--) {
      if (lines[k].startsWith('model ') || lines[k].startsWith('enum ')) {
        isModelOrEnum = true;
        break;
      }
      if (lines[k].trim() === '}') break;
    }
    if (isModelOrEnum) {
      if (!out[out.length - 1].includes('@@schema')) {
        out.push('  @@schema("public")');
      }
    }
  }
  out.push(lines[i]);
}
fs.writeFileSync('prisma/schema.prisma', out.join('\n'));
