const fs = require('fs');
let text = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

text = text.replace(/ðŸ ª/g, '🏪');
text = text.replace(/ðŸ“œ/g, '📜');
text = text.replace(/ðŸª™/g, '🪙');
text = text.replace(/ðŸŽ²/g, '🎲');
text = text.replace(/ðŸ ’/g, '🍒');
text = text.replace(/ðŸ’Ž/g, '💎');
text = text.replace(/ðŸŽ°/g, '🎰');
text = text.replace(/âœ✨/g, '✨');
text = text.replace(/âœ¨/g, '✨');
text = text.replace(/âœ¦/g, '✦');

// Fix side props correctly:
text = text.replace(/<div class="floating-prop prop-1">[^<]+<\/div>/, '<div class="floating-prop prop-1">🎲</div>');
text = text.replace(/<div class="floating-prop prop-2">[^<]+<\/div>/, '<div class="floating-prop prop-2">🍒</div>');
text = text.replace(/<div class="floating-prop prop-3">[^<]+<\/div>/, '<div class="floating-prop prop-3">💎</div>');
text = text.replace(/<div class="floating-prop prop-4">[^<]+<\/div>/, '<div class="floating-prop prop-4">🎰</div>');

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', text, 'utf8');
console.log('Fixed navbar and side props.');
