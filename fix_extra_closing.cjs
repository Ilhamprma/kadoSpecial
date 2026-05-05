const fs = require('fs');

let content = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

// The file has:
// 1446:     }
// 1447: });
// 1448: 
// 1449: });

// Let's remove the extra }); 

content = content.replace(/\}\);\n\n\}\);/g, '});');
// Or more safely:
content = content.split('\n');
let newLines = [];
let foundFirst = false;
for (let i = 0; i < content.length; i++) {
    let line = content[i].trim();
    if (line === '});' && !foundFirst) {
        foundFirst = true;
        newLines.push(content[i]);
    } else if (line === '});' && foundFirst) {
        // Skip subsequent }); that aren't expected
        const nextLine = (content[i+1] || '').trim();
        if (nextLine.startsWith('function') || nextLine.startsWith('//') || nextLine === '') {
            // Likely the bad one
            console.log('Skipping extra }); at line ' + (i+1));
            continue;
        }
        newLines.push(content[i]);
    } else {
        newLines.push(content[i]);
    }
}

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', newLines.join('\n'), 'utf8');
console.log('Extra }); removed.');
