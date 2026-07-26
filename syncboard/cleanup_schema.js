const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');
content = content.replace(/  @@schema\("public"\)\n/g, '');
content = content.replace(/  schemas  = \["public", "auth"\]\n/g, '');
content = content.replace(/  previewFeatures = \["multiSchema"\]\n/g, '');
fs.writeFileSync('prisma/schema.prisma', content);
