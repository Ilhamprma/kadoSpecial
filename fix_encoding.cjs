const fs = require('fs');
let text = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');
const corruptions = {
  'ðŸŽ‚': '🎂',
  'ðŸŽ²': '🎲',
  'ðŸ ’': '🍒',
  'ðŸ’Ž': '💎',
  'ðŸŽ°': '🎰',
  'âœ✨': '✨',
  'âœ¨': '✨',
  'âœ¦': '✦',
  'ðŸŽ‰': '🎉',
  'ðŸ˜œ': '😜',
  'ðŸ’–': '💖',
  'ðŸ˜¤': '😤',
  'ï¿½ï¿½ðŸ’•ðŸŽ‚ðŸ’•ðŸ˜‚': '🌟💖🎂💖🌟',
  'ðŸ’Œ': '💌',
  'â—€': '◀',
  'â–¶': '▶',
  'â˜…': '★',
  'ðŸ †': '🏆',
  'ðŸ’•': '💕',
  'ðŸ˜ ': '😍',
  'ðŸ•¯': '🕯️',
  'ðŸ”¥': '🔥',
  'ðŸ’»': '💻',
  'ðŸ˜­': '😭',
  'â ¤': '❤️',
  'ðŸ˜¢': '😢',
  'ðŸŽ ': '🎁',
  'ðŸ’ ': '💍',
  'ðŸŒ¹': '🌹',
  'ðŸ§¸': '🧸',
  'ðŸ «': '🍫',
  'â­ ': '⭐',
  'ðŸ‘‘': '👑',
  'ðŸŽµ': '🎵',
  'ðŸ €': '🍀',
  'ðŸŒ¸': '🌸',
  'ðŸŽ«': '🎫',
  'ðŸ› ï¸ ': '🛍️',
  'ðŸ”‡': '🔇',
  'ðŸ”Š': '🔊',
  'â™¦': '♦'
};

for (const [bad, good] of Object.entries(corruptions)) {
  text = text.split(bad).join(good);
}

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', text, 'utf8');
console.log('Fixed birthday.html');
