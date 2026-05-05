const fs = require('fs');

let content = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

// 1. Check if intro is done, if not, kick back to intro.html
// Place this at the very top of the script tag or DOMContentLoaded
const redirectSnippet = `
    // SECURITY CHECK: Must finish intro first
    if (!localStorage.getItem('introDone')) {
        window.location.href = 'intro.html';
    }
`;

// Find the start of the last script tag
const scriptIndex = content.lastIndexOf('<script>');
if (scriptIndex !== -1) {
    const insertPos = content.indexOf('{', scriptIndex + 7) + 1; // Just after window.addEventListener('DOMContentLoaded', () => { or similar
    // Actually, better to just put it at the very start of the script
    content = content.substring(0, scriptIndex + 8) + redirectSnippet + content.substring(scriptIndex + 8);
}

// 2. Fix the double closeTutorial function
// I'll search for the functions and keep only the correct one (the one that shows the card)
const correctCloseTutorial = `
// Tutorial closing logic
function closeTutorial() {
    const o = document.getElementById('tutorialOverlay');
    if (o) {
        o.style.transition = 'opacity 0.5s ease';
        o.style.opacity = '0';
        setTimeout(() => {
            o.style.display = 'none';
            localStorage.setItem('tutorialDone', 'true');
            const wrapper = document.querySelector('.card-container');
            if (wrapper) {
                wrapper.style.opacity = '0';
                wrapper.style.display = 'flex';
                setTimeout(() => wrapper.style.opacity = '1', 50);
            }
        }, 500);
    }
}
`;

// Remove all existing definitions of closeTutorial
content = content.replace(/function closeTutorial\(\)\{.*?\}\n/gs, '');
content = content.replace(/function closeTutorial\(\)\{.*?\}/gs, '');

// Append the correct one before the closing </script>
const closingScriptTag = content.lastIndexOf('</script>');
if (closingScriptTag !== -1) {
    content = content.substring(0, closingScriptTag) + correctCloseTutorial + content.substring(closingScriptTag);
}

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', content, 'utf8');
console.log('Birthday.html cleaned and secured.');
