const fs = require('fs');

let intro = fs.readFileSync('c:/Users/ILHAM/Documents/game/intro.html', 'utf8');
let bday = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

// 1. EXTRACT FROM intro.html
const cssStart = intro.indexOf('/* ===== SURPRISE ===== */');
const cssEnd = intro.indexOf('</style>');
const cssToMove = intro.substring(cssStart, cssEnd);

const htmlStart = intro.indexOf('<!-- SURPRISE OVERLAY -->');
const htmlEnd = intro.indexOf('<!-- INTRO SEQUENCE -->');
const htmlToMove = intro.substring(htmlStart, htmlEnd);

const jsFireworkStart = intro.indexOf('// Fireworks');
const jsEnd = intro.lastIndexOf('</script>');
const jsToMove = intro.substring(jsFireworkStart, jsEnd);

// 2. INJECT INTO birthday.html
// inject CSS just before </style>
bday = bday.replace('</style>', '\n' + cssToMove + '\n</style>');

// inject HTML just after <body>
bday = bday.replace(/<body>/i, '<body>\n' + htmlToMove);

// inject JS just before </script>
const newBdayJs = `

${jsToMove}

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('triggerSurprise') === 'true') {
        localStorage.removeItem('triggerSurprise');
        
        // Hide card initially
        const wrapper = document.querySelector('.wrapper');
        if(wrapper) wrapper.style.display = 'none';

        const surprise = document.getElementById('surpriseOverlay');
        if(surprise) {
            surprise.style.display='block';
            const sf = document.getElementById('surpriseFlash');
            if(sf) sf.style.animation='surpriseFlash 0.8s ease-out forwards';
            launchFireworks();
            setTimeout(()=>{
                const st = document.getElementById('surpriseText');
                if(st) st.style.animation='surpriseTextIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards';
            },400);
            setTimeout(()=>{
                const st = document.getElementById('surpriseText');
                if(st) st.style.animation='surpriseTextOut 0.6s ease-in forwards';
            },3500);
            setTimeout(()=>{
                surprise.style.display='none';
                if(!localStorage.getItem('tutorialDone')){
                    setTimeout(()=>startTutorial(), 500);
                } else {
                    if(wrapper) wrapper.style.display = 'flex';
                }
            },4200);
        }
    } else {
        if(!localStorage.getItem('tutorialDone')){
            const wrapper = document.querySelector('.wrapper');
            if(wrapper) wrapper.style.display = 'none';
            startTutorial();
        }
    }
});

// Override closeTutorial in birthday.html to show the card instead of redirecting
function closeTutorial(){
    const o=document.getElementById('tutorialOverlay');
    if(o) {
        o.style.transition='opacity 0.5s ease';o.style.opacity='0';
        setTimeout(()=>{
            o.style.display='none';
            localStorage.setItem('tutorialDone','true');
            const wrapper = document.querySelector('.wrapper');
            if(wrapper) {
                // fade in wrapper
                wrapper.style.opacity = '0';
                wrapper.style.display = 'flex';
                setTimeout(()=>wrapper.style.opacity = '1', 50);
            }
        },500);
    }
}
</script>`;

bday = bday.replace('</script>\r\n\r\n</body>', newBdayJs + '\r\n</body>');
// account for \n without \r
bday = bday.replace('</script>\n\n</body>', newBdayJs + '\n</body>');
// account for just </script>\n</body>
bday = bday.replace('</script>\n</body>', newBdayJs + '\n</body>');
bday = bday.replace('</script>\r\n</body>', newBdayJs + '\n</body>');


// 3. CLEANUP intro.html
let cleanedIntro = intro.replace(cssToMove, '');
cleanedIntro = cleanedIntro.replace(htmlToMove, '');
cleanedIntro = cleanedIntro.replace(jsToMove, `
</script>`);

const newFinalGift = `// Final Gift
function openFinalGift(){
    localStorage.setItem('introDone','true');
    localStorage.setItem('triggerSurprise','true'); // Send signal to birthday.html!
    const introSeq=document.getElementById('introSequence');
    triggerGlitch();
    setTimeout(()=>{introSeq.style.transition='opacity 0.5s ease';introSeq.style.opacity='0'},300);
    setTimeout(()=>{
        window.location.href='birthday.html';
    },800);
}
`;

cleanedIntro = cleanedIntro.replace(/\/\/ Final Gift[\s\S]*?\/\/ Fireworks/, newFinalGift + '\n// Fireworks');
// but since I already removed // Fireworks (it's inside jsToMove), let's replace the whole block again starting from // Final Gift to the end
cleanedIntro = intro.substring(0, intro.indexOf('// Final Gift')) + newFinalGift + '\n</script>\n</body>\n</html>';

// apply CSS and HTML cleanup on top of the clean intro
cleanedIntro = cleanedIntro.replace(cssToMove, '');
cleanedIntro = cleanedIntro.replace(htmlToMove, '');

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', bday, 'utf8');
fs.writeFileSync('c:/Users/ILHAM/Documents/game/intro.html', cleanedIntro, 'utf8');

console.log('Transfer Complete!');
