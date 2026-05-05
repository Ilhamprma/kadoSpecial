const fs = require('fs');
const path = require('path');

const files = [
    'index.html', 'intro.html', 'birthday.html', 'slot.html', 'shop.html', 
    'fortune.html', 'fact.html', 'history.html', 'letters.html', 
    'public/magic_global.js', 'public/titah_system.js', 'public/queen_interaction.js'
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        const ext = path.extname(file);
        const name = path.basename(file, ext);
        const dir = path.dirname(file);
        const backupName = `${name}_backup_final1${ext}`;
        const dest = path.join(__dirname, dir, backupName);
        
        fs.copyFileSync(fullPath, dest);
        console.log(`Backed up ${file} to ${dest}`);
    } else {
        console.warn(`File not found: ${file}`);
    }
});
