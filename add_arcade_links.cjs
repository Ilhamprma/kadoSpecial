const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('_backup_'));

const blackjackLink = '\n                    <a href="blackjack.html" class="dropdown-link"><span class="dropdown-emoji">🃏</span><span>BLACKJACK</span></a>';
const runnerLink = '\n                    <a href="runner.html" class="dropdown-link"><span class="dropdown-emoji">🧚</span><span>RUNNER</span></a>';

files.forEach(file => {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    let modified = false;
    if (content.includes('<div class="dropdown-menu">')) {
        if (!content.includes('href="blackjack.html"')) {
            content = content.replace('<div class="dropdown-menu">', `<div class="dropdown-menu">${blackjackLink}`);
            modified = true;
        }
        if (!content.includes('href="runner.html"')) {
            content = content.replace('<div class="dropdown-menu">', `<div class="dropdown-menu">${runnerLink}`);
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Added links to ${file}`);
    }
});
