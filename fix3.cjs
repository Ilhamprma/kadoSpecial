const fs = require('fs');
const lines = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8').split('\n');
lines[984] = '                <span class=\"nav-emoji\">🛍️</span>'; // Shop
lines[988] = '                <span class=\"nav-emoji\">📜</span>'; // Sejarah
lines[994] = '            <span class=\"nav-coin-icon\">🪙</span>'; // Coin
fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', lines.join('\n'), 'utf8');
console.log('Fixed lines 985, 989, 995');
