/* 
 * Magic Global Controller - Fairy Rescue System
 * Works globally across all HTML pages
 */

(function() {
    // 0. Disable Fairy Rescue on Intro and Greeting pages
    const path = window.location.pathname.toLowerCase();
    if (path.includes('intro.html') || path.includes('birthday.html') || path.endsWith('/') || path.endsWith('index.html')) {
        return;
    }

    let phase = 'normal'; // normal, freeze, popup, flight, casting, refill, unfreeze
    const COST = 50;
    let checkInterval = null;
    let hasInitializedCoins = true; // State is loaded

    // 1. Style Injection
    const style = document.createElement('style');
    style.innerHTML = `
        /* Global Freeze Overlay */
        #fairyOverlay {
            position: fixed;
            inset: 0;
            background: rgba(8, 0, 20, 0.75);
            backdrop-filter: blur(8px);
            z-index: 9999998;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: auto;
        }
        
        #fairyOverlay.active { opacity: 1; }
        
        #fairyOverlay .freeze-text {
            position: absolute;
            bottom: 15%;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Press Start 2P', monospace;
            font-size: 12px;
            color: #00ffff;
            letter-spacing: 3px;
            animation: fairyPulse 1.5s infinite alternate;
            text-align: center;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            pointer-events: none;
        }

        /* Fairy Popup */
        #fairyPopup {
            background: rgba(16, 5, 29, 0.9);
            border: 1.5px solid rgba(255, 215, 0, 0.6);
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
            border-radius: 20px;
            padding: 30px;
            width: 420px;
            max-width: 90vw;
            text-align: center;
            z-index: 9999999;
            transform: scale(0.7);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
        }
        
        #fairyPopup.show {
            transform: scale(1);
            opacity: 1;
        }

        .fairy-avatar {
            font-size: 60px;
            margin-bottom: 20px;
            display: inline-block;
            animation: fairyFloat 2s ease-in-out infinite alternate;
        }

        .fairy-message {
            font-family: 'VT323', monospace;
            font-size: 24px;
            color: #ffb7fb;
            line-height: 1.5;
            margin-bottom: 25px;
            text-shadow: 0 0 5px rgba(255,183,251,0.3);
        }

        .fairy-btn {
            background: rgba(0, 255, 255, 0.1);
            border: 1.5px solid #00ffff;
            color: #00ffff;
            font-family: 'Press Start 2P', monospace;
            font-size: 10px;
            padding: 12px 24px;
            border-radius: 50px;
            cursor: pointer;
            transition: 0.3s;
            box-shadow: 0 0 15px rgba(0,255,255,0.3);
        }

        .fairy-btn:hover {
            background: rgba(0, 255, 255, 0.3);
            box-shadow: 0 0 25px rgba(0,255,255,0.6);
            transform: translateY(-2px);
        }

        /* Flying Fairy */
        #fairyActor {
            position: fixed;
            font-size: 40px;
            z-index: 10000000;
            pointer-events: none;
            transition: all 1.2s cubic-bezier(0.25, 1, 0.5, 1);
            transform: translate(-50%, -50%);
            opacity: 0;
            left: 50%;
            top: 50%;
        }

        /* Magic Rune */
        #magicRune {
            position: fixed;
            z-index: 9999999;
            width: 120px;
            height: 120px;
            border: 2px dashed #ffd700;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg);
            transition: opacity 0.5s ease;
            box-shadow: 0 0 20px rgba(255,215,0,0.4), inset 0 0 20px rgba(255,215,0,0.4);
        }
        
        #magicRune.spinning {
            opacity: 1;
            animation: runeSpin 2s linear infinite;
        }

        /* Sparkle Trails */
        .sparkle-dot {
            position: fixed;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000001;
            opacity: 1;
            animation: sparkleFade 0.8s forwards ease-out;
        }

        @keyframes fairyFloat {
            0% { transform: translateY(0px) rotate(-3deg); }
            100% { transform: translateY(-10px) rotate(3deg); }
        }

        @keyframes fairyPulse {
            0% { opacity: 0.4; }
            100% { opacity: 1; }
        }

        @keyframes runeSpin {
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes sparkleFade {
            100% { opacity: 0; transform: scale(0.2) translateY(10px); }
        }
        
        .grayscale-freeze {
            filter: grayscale(60%) contrast(0.9) brightness(0.5) !important;
            pointer-events: none !important;
            user-select: none !important;
            transition: filter 0.8s ease;
        }

        /* Floating Fairy Helper */
        #fairyHelperNode {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999990;
            cursor: pointer;
            display: none;
            flex-direction: column;
            align-items: center;
            animation: floatingFairy 2.5s ease-in-out infinite alternate;
            transition: transform 0.3s ease;
        }
        #fairyHelperNode:hover {
            transform: scale(1.15);
        }
        .helper-avatar {
            font-size: 45px;
            filter: drop-shadow(0 0 10px rgba(0,255,255,0.4));
            transition: filter 0.3s ease;
        }
        #fairyHelperNode:hover .helper-avatar {
            filter: drop-shadow(0 0 25px rgba(0,255,255,0.8));
        }
        .helper-bubble {
            position: absolute;
            top: -45px;
            background: rgba(16, 5, 29, 0.9);
            border: 1.5px solid #48dbfb;
            box-shadow: 0 0 15px rgba(72,219,251,0.4);
            border-radius: 8px;
            padding: 6px 12px;
            font-family: 'VT323', monospace;
            font-size: 16px;
            color: #ffb7fb;
            white-space: nowrap;
            animation: helperPulse 1.5s infinite alternate;
        }
        .helper-bubble::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px 6px 0;
            border-style: solid;
            border-color: rgba(16, 5, 29, 0.9) transparent;
            display: block;
            width: 0;
        }
        @keyframes floatingFairy {
            0% { transform: translateY(0px) rotate(-2deg); }
            100% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes helperPulse {
            0% { transform: scale(0.95); opacity: 0.8; }
            100% { transform: scale(1.05); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Audio SFX Preload
    const sfxPop = new Audio("https://assets.mixkit.co/active_storage/sfx/1432/1432-preview.mp3");
    const sfxMagic = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");

    // 2. DOM Node Generation
    const overlay = document.createElement('div');
    overlay.id = 'fairyOverlay';
    overlay.innerHTML = `<div class="freeze-text">ENERGI HABIS...</div>`;

    const popup = document.createElement('div');
    popup.id = 'fairyPopup';
    popup.innerHTML = `
        <div class="fairy-avatar">🧚‍♀️</div>
        <div class="fairy-message">
            Koinmu habis ya? Tenang, aku bantu isi lagi.<br>
            Jangan khawatir, perhatikan keajaiban kecil ini... ✨
        </div>
        <button class="fairy-btn" id="fairyMagicBtn">Lihat Magic ✨</button>
    `;

    const actor = document.createElement('div');
    actor.id = 'fairyActor';
    actor.textContent = '🧚‍♀️';

    const rune = document.createElement('div');
    rune.id = 'magicRune';

    const helperNode = document.createElement('div');
    helperNode.id = 'fairyHelperNode';
    helperNode.innerHTML = `
        <div class="helper-bubble">Klik aku!</div>
        <span class="helper-avatar">🧚‍♀️</span>
    `;

    document.body.appendChild(overlay);
    overlay.appendChild(popup);
    document.body.appendChild(actor);
    document.body.appendChild(rune);
    document.body.appendChild(helperNode);

    // 3. Event Binding
    document.getElementById('fairyMagicBtn').addEventListener('click', startMagicRoutine);
    
    helperNode.addEventListener('click', () => {
        // Poof particles
        const rect = helperNode.getBoundingClientRect();
        createSparkle(rect.left + 20, rect.top + 20);
        for(let i=0; i<15; i++) {
            setTimeout(() => createSparkle(rect.left + Math.random()*40, rect.top + Math.random()*40), i*20);
        }
        helperNode.style.display = 'none';
        triggerFairyRescue();
    });

    // 4. Coin Monitoring Core
    function checkCoins() {
        if (phase !== 'normal') return;
        if (localStorage.getItem('introDone') !== 'true') return;
        
        const currentCoins = parseInt(localStorage.getItem('slotCoins') || '0');
        const isActionProcessing = window.isActionProcessing === true;
        
        if (hasInitializedCoins && currentCoins <= 0 && !isActionProcessing) {
            helperNode.style.display = 'flex';
        } else {
            helperNode.style.display = 'none';
        }
    }

    // Intercept localStorage setItem to act instantly
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'slotCoins') {
            const currentCoins = parseInt(value || '0');
            const isActionProcessing = window.isActionProcessing === true;
            
            if (currentCoins <= 0 && phase === 'normal' && !isActionProcessing && localStorage.getItem('introDone') === 'true') {
                helperNode.style.display = 'flex';
            } else {
                helperNode.style.display = 'none';
            }
        }
    };

    checkInterval = setInterval(checkCoins, 1000);

    function triggerFairyRescue() {
        phase = 'freeze';
        
        // Freeze interactions and desaturate
        const children = document.body.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i] !== overlay && children[i] !== actor && children[i] !== rune && children[i].tagName !== 'STYLE' && children[i].tagName !== 'SCRIPT') {
                children[i].classList.add('grayscale-freeze');
            }
        }

        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 100);

        try { sfxPop.play(); } catch(e){}

        setTimeout(() => {
            phase = 'popup';
            popup.classList.add('show');
        }, 800);
    }

    function createSparkle(x, y) {
        const dot = document.createElement('div');
        dot.className = 'sparkle-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        const colors = ['#ffb7fb', '#00ffff', '#ffd700', '#fff'];
        dot.style.background = colors[Math.floor(Math.random() * colors.length)];
        dot.style.boxShadow = `0 0 8px ${dot.style.background}`;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 800);
    }

    function startMagicRoutine() {
        phase = 'flight';
        popup.classList.remove('show');
        
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
        }, 400);

        actor.style.opacity = '1';
        
        // Find Coin Target
        let coinTarget = document.getElementById('coinDisplay') || document.querySelector('.nav-right');
        let targetX = window.innerWidth - 80;
        let targetY = 40;

        if (coinTarget) {
            const rect = coinTarget.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
        }

        // Flight Trail Implementation
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        let pct = 0;

        try { sfxMagic.play(); } catch(e){}

        const flightInterval = setInterval(() => {
            pct += 0.05;
            if (pct >= 1) {
                clearInterval(flightInterval);
                actor.style.left = targetX + 'px';
                actor.style.top = targetY + 'px';
                startCasting(targetX, targetY);
            } else {
                // Curved Path (Bézier simulation)
                const currentX = startX + (targetX - startX) * pct + Math.sin(pct * Math.PI) * 100;
                const currentY = startY + (targetY - startY) * pct - Math.sin(pct * Math.PI) * 150;
                actor.style.left = currentX + 'px';
                actor.style.top = currentY + 'px';
                
                // Drop sparkle
                createSparkle(currentX, currentY);
            }
        }, 30);
    }

    function startCasting(targetX, targetY) {
        phase = 'casting';
        rune.style.left = targetX + 'px';
        rune.style.top = targetY + 'px';
        rune.classList.add('spinning');

        // Floating spell text
        const spellText = document.createElement('div');
        spellText.style.cssText = `
            position: fixed;
            left: ${targetX - 50}px;
            top: ${targetY + 40}px;
            color: #ffd700;
            font-family: 'VT323', monospace;
            font-size: 24px;
            text-shadow: 0 0 10px #ffd700;
            z-index: 10000002;
            animation: fairyPulse 0.5s infinite alternate;
            pointer-events: none;
        `;
        spellText.textContent = "Bim salabim... koin, muncul!";
        document.body.appendChild(spellText);

        setTimeout(() => {
            phase = 'refill';
            spellText.remove();
            rune.classList.remove('spinning');
            
            // Refill Climax Animation
            let coinTarget = document.getElementById('coinDisplay');
            let startVal = 0;
            const endVal = 100;
            
            const countTimer = setInterval(() => {
                startVal += Math.floor(Math.random() * 15) + 10;
                if (startVal >= endVal) {
                    startVal = endVal;
                    clearInterval(countTimer);
                    finalizeRescue();
                }
                if (coinTarget) coinTarget.textContent = startVal;
            }, 50);

            // Gold Burst particles
            for(let i=0; i<30; i++) {
                setTimeout(() => {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = Math.random() * 80 + 20;
                    const pX = targetX + Math.cos(angle) * dist;
                    const pY = targetY + Math.sin(angle) * dist;
                    createSparkle(pX, pY);
                }, i * 20);
            }

        }, 1500);
    }

    function finalizeRescue() {
        phase = 'unfreeze';
        localStorage.setItem('slotCoins', 100);

        // Remove grayscale freeze
        const frozen = document.querySelectorAll('.grayscale-freeze');
        frozen.forEach(el => el.classList.remove('grayscale-freeze'));

        // Farewell text
        const goodbye = document.createElement('div');
        goodbye.style.cssText = `
            position: fixed;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            color: #ffb7fb;
            font-family: 'VT323', monospace;
            font-size: 32px;
            text-shadow: 0 0 10px #ffb7fb;
            z-index: 10000002;
            background: rgba(16, 5, 29, 0.8);
            border: 1px solid rgba(255,183,251,0.5);
            padding: 10px 20px;
            border-radius: 10px;
            pointer-events: none;
        `;
        goodbye.textContent = "Sudah kuisi kembali. Gunakan dengan bijak ya! 😉";
        document.body.appendChild(goodbye);

        actor.style.transform = 'translate(-50%, -50%) scale(1.5) rotate(360deg)';
        actor.style.transition = 'all 1s ease-out';

        setTimeout(() => {
            goodbye.remove();
            actor.style.opacity = '0';
            setTimeout(() => {
                actor.style.left = '50%';
                actor.style.top = '50%';
                actor.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
                phase = 'normal';
                // Refresh UI after rescue
                if (window.refreshMagicUI) window.refreshMagicUI();
            }, 1000);
        }, 2000);
    }

    // --- GLOBAL STABILIZATION & IDENTITY SYNC ---
    window.refreshMagicUI = function() {
        // Update Coin Displays
        const coins = localStorage.getItem('slotCoins') || '0';
        const coinEls = document.querySelectorAll('#navCoinDisplay, #coinDisplay, .nav-coin-amt, .coin-amount');
        coinEls.forEach(el => {
            if (el.tagName === 'SPAN' || el.tagName === 'DIV') {
                el.textContent = coins;
            }
        });

        // Sync Royal Identity
        window.syncRoyalIdentity();
    };

    window.syncRoyalIdentity = function() {
        const isQueen = localStorage.getItem('isQueenActive') === 'true';
        const isRing = localStorage.getItem('isRingAccepted') === 'true';
        const navWelcome = document.getElementById('navWelcomeText');
        const body = document.body;

        if (isQueen) {
            body.classList.add('royal-mode');
            if (navWelcome) {
                navWelcome.innerHTML = `<div class="royal-name"><div class="royal-crown-icon">👑</div>Her Majesty Queen Nanaz has arrived. ${isRing ? '<span style="color:#48dbfb; cursor:pointer; margin-left:10px; font-size:18px;" title="The Owner of Eternal Diamond Ring">💎💍</span>' : ''}</div>`;
            }
        } else {
            body.classList.remove('royal-mode');
            if (navWelcome) {
                navWelcome.innerHTML = `✨ Welcome Nanaz!!! 💖 ${isRing ? '<span style="color:#48dbfb; cursor:pointer; margin-left:10px; font-size:16px;" title="The Owner of Eternal Diamond Ring">💎💍</span>' : ''}`;
            }
        }

        // Update any specific name fields
        const nameEls = document.querySelectorAll('.user-name-display');
        nameEls.forEach(el => {
            el.textContent = "Ms. hanawazain";
            if (isQueen) el.classList.add('royal-name');
        });
    };

    // Initialize UI on load
    window.addEventListener('DOMContentLoaded', () => {
        window.refreshMagicUI();
        // Set clock if exists
        const clock = document.getElementById('nav-clock');
        if (clock) {
            setInterval(() => {
                const now = new Date();
                clock.textContent = now.toTimeString().split(' ')[0];
            }, 1000);
        }
    });

    // Handle visibility change to keep coins in sync
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            window.refreshMagicUI();
        }
    });

})();
