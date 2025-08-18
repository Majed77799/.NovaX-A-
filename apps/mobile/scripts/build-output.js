const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'build');
const marker = path.join(outDir, 'expo-go.txt');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(marker, 'Expo Go build handled externally.\n');
console.log('Wrote build marker to', marker);

