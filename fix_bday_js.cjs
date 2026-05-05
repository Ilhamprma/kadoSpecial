const fs = require('fs');

let bday = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

const firstOcc = bday.indexOf('// Fireworks');
const secondOcc = bday.indexOf('// Fireworks', firstOcc + 5);

if (secondOcc !== -1) {
    const startOfDuplicate = bday.lastIndexOf('\n', secondOcc);
    const endScript = bday.indexOf('</script>', secondOcc);
    if (endScript !== -1) {
        bday = bday.substring(0, startOfDuplicate) + '\n' + bday.substring(endScript);
        fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', bday, 'utf8');
        console.log('Fixed duplications!');
    } else {
        console.log('No </script> found after second occurence');
    }
} else {
    console.log('No duplicate found');
}
