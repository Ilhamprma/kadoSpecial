const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'slot.html');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add CSS for Lucky Hat and UI Glow
if (!content.includes('.lucky-leprechaun-hat')) {
    const cssToInject = `
        /* --- LUCKY CLOVER EFFECTS --- */
        .lucky-leprechaun-hat {
            position: absolute;
            top: -45px;
            z-index: 60;
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0;
            transform: translateY(-10px) scale(0.5);
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
        }
        .css-robot.is-lucky .lucky-leprechaun-hat {
            opacity: 1;
            transform: translateY(0) scale(1.1);
        }
        .lucky-leprechaun-hat .hat-top {
            width: 40px; height: 35px;
            background: linear-gradient(to right, #00b894, #55efc4);
            border-radius: 8px 8px 0 0;
            border: 2px solid #000;
            border-bottom: none;
        }
        .lucky-leprechaun-hat .hat-buckle {
            width: 44px; height: 10px;
            background: #2d3436;
            border: 2px solid #000;
            display: flex; justify-content: center; align-items: center;
            margin-top: -2px;
        }
        .lucky-leprechaun-hat .hat-buckle::after {
            content: '';
            width: 12px; height: 6px;
            border: 2px solid #f1c40f;
            border-radius: 2px;
        }
        .lucky-leprechaun-hat .hat-brim {
            width: 60px; height: 10px;
            background: #00b894;
            border: 2px solid #000;
            border-radius: 10px;
            margin-top: -2px;
        }
        .lucky-leprechaun-hat .hat-clover {
            position: absolute;
            right: -10px; top: 10px;
            font-size: 20px;
            filter: drop-shadow(0 0 5px #55efc4);
            animation: cloverSway 2s ease-in-out infinite alternate;
        }
        @keyframes cloverSway {
            0% { transform: rotate(-15deg); }
            100% { transform: rotate(15deg); }
        }

        .lucky-glow {
            box-shadow: 0 0 50px rgba(46, 204, 113, 0.4), inset 0 0 20px rgba(46, 204, 113, 0.2) !important;
            border-color: #2ecc71 !important;
            transition: all 0.5s ease;
        }
        .lucky-glow .screen {
            box-shadow: inset 0 0 30px rgba(46, 204, 113, 0.3) !important;
        }
`;
    content = content.replace('/* --- LEFT SIDE ROBOT --- */', cssToInject + '\n        /* --- LEFT SIDE ROBOT --- */');
}

// 2. Insert the Hat HTML into the robot
if (!content.includes('<div class="lucky-leprechaun-hat"')) {
    const hatHTML = `
                    <div class="lucky-leprechaun-hat" id="robotLuckyHat">
                        <div class="hat-top"></div>
                        <div class="hat-buckle"></div>
                        <div class="hat-brim"></div>
                        <div class="hat-clover">🍀</div>
                    </div>`;
    content = content.replace('<div class="rob-antenna"></div>', '<div class="rob-antenna"></div>' + hatHTML);
}

// 3. Add explosion function and logic to JS
if (!content.includes('function spawnLuckyExplosion')) {
    const explosionFunc = `
        function spawnLuckyExplosion() {
            const lever = document.getElementById('lever');
            if (!lever) return;
            const rect = lever.getBoundingClientRect();
            for (let i = 0; i < 15; i++) {
                const p = document.createElement('div');
                p.textContent = ['🍀', '✨', '🪙'][Math.floor(Math.random() * 3)];
                p.style.position = 'fixed';
                p.style.zIndex = '999999';
                p.style.left = (rect.left + rect.width / 2) + 'px';
                p.style.top = (rect.top + 20) + 'px';
                p.style.fontSize = (15 + Math.random() * 15) + 'px';
                p.style.pointerEvents = 'none';
                p.style.opacity = '1';
                p.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                document.body.appendChild(p);
                
                requestAnimationFrame(() => {
                    p.style.transform = \`translate(\${(Math.random() - 0.5) * 200}px, \${(Math.random() - 0.5) * 200}px) rotate(\${Math.random() * 360}deg)\`;
                    p.style.opacity = '0';
                });
                setTimeout(() => p.remove(), 1000);
            }
        }
`;
    content = content.replace('function spawnCoins(n)', explosionFunc + '\n        function spawnCoins(n)');
}

// 4. Trigger explosion in pullLever
if (!content.includes('spawnLuckyExplosion();')) {
    content = content.replace(
        "setTimeout(() => lev.classList.remove('pulled'), 400);",
        "setTimeout(() => lev.classList.remove('pulled'), 400);\n            if (isFreeSpin) spawnLuckyExplosion();"
    );
}

// 5. Update UI logic for Lucky Active
if (!content.includes("bot.classList.add('is-lucky')")) {
    const uiLogic = `
            // Lucky Clover visual effects update
            const luckyActive = localStorage.getItem('isLuckyActive') === 'true';
            const luckyEx = parseInt(localStorage.getItem('luckyExpiry') || '0');
            const bot = document.getElementById('robotAvatar');
            const machine = document.querySelector('.cabinet');
            if (luckyActive && Date.now() < luckyEx) {
                if (bot) bot.classList.add('is-lucky');
                if (machine) machine.classList.add('lucky-glow');
            } else {
                if (bot) bot.classList.remove('is-lucky');
                if (machine) machine.classList.remove('lucky-glow');
            }
`;
    content = content.replace('document.getElementById(\'betDisplay\').textContent = bet;', 'document.getElementById(\'betDisplay\').textContent = bet;\n' + uiLogic);
}

fs.writeFileSync(targetFile, content);
console.log('Successfully injected lucky clover effects into slot.html');
