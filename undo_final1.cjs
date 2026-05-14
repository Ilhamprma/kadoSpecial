const fs = require('fs');
const path = require('path');

const filesToRestore = [
    'intro.html', 'birthday.html', 'slot.html', 'shop.html', 
    'fortune.html', 'fact.html', 'history.html', 'letters.html'
];

const publicFilesToRestore = [
    'magic_global.js', 'titah_system.js', 'queen_interaction.js'
];

filesToRestore.forEach(file => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const backupName = `${name}_backup_final1${ext}`;
    const backupPath = path.join(__dirname, backupName);
    const targetPath = path.join(__dirname, file);

    if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, targetPath);
        console.log(`Restored ${file} from ${backupName}`);
    } else {
        console.warn(`Backup not found for ${file}`);
    }
});

publicFilesToRestore.forEach(file => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const backupName = `${name}_backup_final1${ext}`;
    const backupPath = path.join(__dirname, 'public', backupName);
    const targetPath = path.join(__dirname, 'public', file);

    if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, targetPath);
        console.log(`Restored public/${file} from public/${backupName}`);
    } else {
        console.warn(`Backup not found for public/${file}`);
    }
});
