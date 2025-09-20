const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Создаем директории, если они не существуют
const dirs = ['dist', 'dist/esm'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Компилируем TypeScript в JavaScript
console.log('Building plugin...');
execSync('tsc', { stdio: 'inherit' });

console.log('Plugin built successfully!');