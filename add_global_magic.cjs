const fs = require('fs');
const path = require('path');

const MAGIC_JS = `
// GLOBAL MAGIC WAND EFFECT
(function() {
    // 1. Inject global CSS
    const style = document.createElement('style');
    style.innerHTML = \`
        body.reality-change-mode {
            animation: realityHue 5s linear infinite !important;
        }
        @keyframes realityHue {
            0% { filter: hue-rotate(0deg) contrast(1.1) drop-shadow(0 0 10px rgba(255,100,200,0.3)); }
            100% { filter: hue-rotate(360deg) contrast(1.1) drop-shadow(0 0 10px rgba(100,255,200,0.3)); }
        }

        /* Generic floating for elements */
        body.anti-gravity-mode .item-card,
        body.anti-gravity-mode .greeting-card,
        body.anti-gravity-mode .letter-char,
        body.anti-gravity-mode .slot-machine,
        body.anti-gravity-mode .menu-btn {
            animation: globalFloat 4s ease-in-out infinite !important;
        }
        
        body.anti-gravity-mode .item-card:nth-child(odd),
        body.anti-gravity-mode .letter-char:nth-child(odd) {
            animation-duration: 3.5s !important;
            animation-name: globalFloatOdd !important;
        }

        body.anti-gravity-mode .item-emoji {
            animation: popOutEmoji 3s ease-in-out infinite !important;
            display: inline-block;
        }

        @keyframes globalFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-20px, -40px) rotate(-10deg); box-shadow: 0 40px 50px rgba(0,0,0,0.5); }
            66% { transform: translate(20px, -30px) rotate(8deg); box-shadow: 0 20px 30px rgba(0,0,0,0.4); }
        }
        @keyframes globalFloatOdd {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -50px) rotate(12deg); box-shadow: 0 30px 40px rgba(0,0,0,0.5); }
            66% { transform: translate(-25px, -60px) rotate(-6deg); box-shadow: 0 50px 60px rgba(0,0,0,0.5); }
        }
        @keyframes popOutEmoji {
            0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
            50% { transform: translate(100px, -150px) scale(2) rotate(360deg); z-index: 100; filter: drop-shadow(0 0 20px #fff); }
        }
    \`;
    document.head.appendChild(style);

    // 2. Check loop
    function checkMagic() {
        const endTime = parseInt(localStorage.getItem('abrakadabraEndTime')) || 0;
        if (Date.now() < endTime) {
            document.body.classList.add('anti-gravity-mode');
            document.body.classList.add('reality-change-mode');
            requestAnimationFrame(checkMagic);
        } else {
            document.body.classList.remove('anti-gravity-mode');
            document.body.classList.remove('reality-change-mode');
            // Re-check periodically in case another tab activates it
            setTimeout(checkMagic, 1000);
        }
    }
    
    // Wrap characters in birthday.html for individual floating
    if (location.pathname.includes('birthday.html')) {
        window.addEventListener('DOMContentLoaded', () => {
            const wrapText = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return;
                const text = el.textContent;
                el.innerHTML = '';
                for (let char of text) {
                    if (char === ' ') {
                        el.appendChild(document.createTextNode(' '));
                    } else {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.className = 'letter-char';
                        span.style.display = 'inline-block';
                        el.appendChild(span);
                    }
                }
            };
            wrapText('.title'); // The Happy 18th Birthday Nanaz!
            wrapText('.greeting-card p'); // The message inside
        });
    }

    checkMagic();
})();
`;

const files = ['shop.html', 'birthday.html', 'slot.html', 'history.html', 'fact.html', 'fortune.html', 'intro.html'];

fs.writeFileSync('public/magic_global.js', MAGIC_JS);
console.log('Created magic_global.js');

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('magic_global.js')) {
            content = content.replace('</body>', '    <script src="magic_global.js"></script>\n</body>');
            fs.writeFileSync(filePath, content);
            console.log('Injected into ' + file);
        }
    }
});
