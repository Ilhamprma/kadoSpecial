const fs = require('fs');
const path = require('path');

// 1. UPDATE MAGIC_GLOBAL.JS FOR AMBIENT CLOVERS & BGM & GLOBAL UI APPLY
const globalJsPath = path.join(__dirname, 'public', 'magic_global.js');
let globalJs = fs.readFileSync(globalJsPath, 'utf8');

if (!globalJs.includes('function spawnAmbientClovers')) {
    const ambientCode = `
    // AMBIENT CLOVERS AND LUCKY UI ENHANCER
    function spawnAmbientClovers() {
        const isLucky = localStorage.getItem('isLuckyActive') === 'true';
        const expiry = parseInt(localStorage.getItem('luckyExpiry') || '0');
        const now = Date.now();
        
        if (isLucky && now < expiry) {
            // Accelerate BGM if exists
            const bgm = document.getElementById('bgm');
            if (bgm && bgm.playbackRate !== 1.3) bgm.playbackRate = 1.3;

            // Spawn floating clover randomly
            if (Math.random() < 0.1) {
                const cl = document.createElement('div');
                cl.textContent = '🍀';
                cl.style.cssText = \`
                    position: fixed; pointer-events: none; z-index: -1;
                    font-size: \${15 + Math.random() * 20}px;
                    left: \${Math.random() * 100}vw; bottom: -50px;
                    opacity: 0.6; filter: drop-shadow(0 0 5px rgba(46,204,113,0.5));
                    animation: floatCloverUp \${5 + Math.random() * 5}s linear forwards;
                \`;
                document.body.appendChild(cl);
                setTimeout(() => cl.remove(), 10000);
            }

            // Ensure lucky classes are active globally (slot & shop)
            const bot = document.getElementById('robotAvatar');
            if (bot && !bot.classList.contains('is-lucky')) bot.classList.add('is-lucky');
            
            const machine = document.querySelector('.cabinet');
            if (machine && !machine.classList.contains('lucky-glow')) machine.classList.add('lucky-glow');

            const shopGrid = document.querySelector('.shop-grid');
            if (shopGrid && !shopGrid.classList.contains('lucky-glow')) shopGrid.classList.add('lucky-glow');
            
        } else {
            const bgm = document.getElementById('bgm');
            if (bgm && bgm.playbackRate !== 1.0) bgm.playbackRate = 1.0;
            
            const bot = document.getElementById('robotAvatar');
            if (bot && bot.classList.contains('is-lucky')) bot.classList.remove('is-lucky');

            const machine = document.querySelector('.cabinet');
            if (machine && machine.classList.contains('lucky-glow')) machine.classList.remove('lucky-glow');

            const shopGrid = document.querySelector('.shop-grid');
            if (shopGrid && shopGrid.classList.contains('lucky-glow')) shopGrid.classList.remove('lucky-glow');
        }
    }
    
    // add keyframe
    const cloverStyle = document.createElement('style');
    cloverStyle.innerHTML = \`
        @keyframes floatCloverUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
    \`;
    document.head.appendChild(cloverStyle);

    setInterval(spawnAmbientClovers, 200);
`;
    // Insert before the monitoring call at the end
    globalJs = globalJs.replace('// Start monitoring\n    checkMagic();', ambientCode + '\n    // Start monitoring\n    checkMagic();');
    fs.writeFileSync(globalJsPath, globalJs);
}

// 2. UPDATE SLOT.HTML CSS FOR STRONGER GLOW & FIX HAT POSITION
const slotPath = path.join(__dirname, 'slot.html');
let slotHtml = fs.readFileSync(slotPath, 'utf8');

// Stronger glow
slotHtml = slotHtml.replace(
    /box-shadow: 0 0 50px rgba\(46, 204, 113, 0\.4\), inset 0 0 20px rgba\(46, 204, 113, 0\.2\) !important;/g, 
    'box-shadow: 0 0 80px rgba(46, 204, 113, 0.9), inset 0 0 40px rgba(46, 204, 113, 0.6) !important;'
);

// Fix hat CSS if not visible
if (!slotHtml.includes('.css-robot.is-lucky .lucky-leprechaun-hat {')) {
    // it's there from previous script, just to be sure we'll modify the z-index and top
    slotHtml = slotHtml.replace('top: -45px;', 'top: -65px;'); 
} else {
    // Change top position directly
    slotHtml = slotHtml.replace('top: -45px;', 'top: -55px;');
    // Give css-robot overflow visible
    if (!slotHtml.includes('overflow: visible; /* lucky hat fix */')) {
        slotHtml = slotHtml.replace('.css-robot {', '.css-robot {\n            overflow: visible; /* lucky hat fix */');
    }
}
fs.writeFileSync(slotPath, slotHtml);

console.log("Effects enhanced!");
