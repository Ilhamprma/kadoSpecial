const fs = require('fs');

let bday = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

bday = bday.replace(/\.wrapper/g, '.card-container');

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', bday, 'utf8');
console.log('Fixed wrapper logic!');
