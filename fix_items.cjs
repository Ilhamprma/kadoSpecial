const fs = require('fs');
let html = fs.readFileSync('shop.html', 'utf8');

// ===== 1. ADD CSS for Rose Bloom & Shooting Star scenes =====
const cssMarker = '        /* ===== DRAMATIC EFFECTS ===== */';
const cssIdx = html.indexOf(cssMarker);
if (cssIdx === -1) { console.log('CSS marker not found!'); process.exit(1); }

const newCSS = `        /* ===== ROSE BLOOM SCENE ===== */
        .rose-scene { position: fixed; inset: 0; z-index: 20001; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 50%, #2a0020 0%, #0a0008 100%); }
        .rose-scene .rose-petals-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .rose-scene .bg-petal { position: absolute; font-size: 28px; opacity: 0.15; animation: petalDrift 6s linear infinite; }
        @keyframes petalDrift { 0% { transform: translateY(-20px) rotate(0deg); opacity: 0; } 20% { opacity: 0.15; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }
        .rose-bloom-container { position: relative; z-index: 2; cursor: pointer; }
        .rose-bloom-emoji { font-size: 140px; display: block; filter: drop-shadow(0 0 40px rgba(255,100,150,0.5)); transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .rose-bloom-emoji:hover { transform: scale(1.1); filter: drop-shadow(0 0 60px rgba(255,100,150,0.7)); }
        .rose-bloom-emoji.bloom-1 { transform: scale(1.15) rotate(5deg); filter: drop-shadow(0 0 50px rgba(255,100,150,0.6)); }
        .rose-bloom-emoji.bloom-2 { transform: scale(1.3) rotate(-5deg); filter: drop-shadow(0 0 70px rgba(255,150,200,0.8)); }
        .rose-bloom-emoji.bloom-3 { transform: scale(1.5); filter: drop-shadow(0 0 80px rgba(255,150,200,0.9)); }
        .rose-bloom-emoji.bloom-burst { animation: roseBurst 0.8s ease-out forwards; }
        @keyframes roseBurst { 0% { transform: scale(1.5); opacity: 1; } 50% { transform: scale(2.5); opacity: 0.5; } 100% { transform: scale(3); opacity: 0; } }
        .rose-word-bubble { position: absolute; font-family: 'Pacifico', cursive; color: #ff9ff3; font-size: 22px; text-shadow: 0 0 15px rgba(255,159,243,0.5); opacity: 0; animation: wordBubbleIn 2s ease-out forwards; pointer-events: none; white-space: nowrap; }
        @keyframes wordBubbleIn { 0% { transform: scale(0) translateY(0); opacity: 0; } 20% { transform: scale(1.2) translateY(-20px); opacity: 1; } 80% { opacity: 1; } 100% { transform: scale(0.8) translateY(-80px); opacity: 0; } }
        .rose-final-text { font-family: 'Pacifico', cursive; font-size: 26px; color: #ff9ff3; text-align: center; line-height: 1.6; margin-top: 30px; opacity: 0; animation: roseFinalIn 1s ease-out forwards; text-shadow: 0 0 20px rgba(255,159,243,0.4); z-index: 3; max-width: 400px; }
        @keyframes roseFinalIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .rose-hint { font-family: 'VT323', monospace; font-size: 16px; color: rgba(255,255,255,0.25); margin-top: 20px; animation: hintPulse 2s infinite; z-index: 3; }

        /* ===== SHOOTING STAR SCENE ===== */
        .star-scene { position: fixed; inset: 0; z-index: 20001; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(ellipse at 50% 20%, #0a0a2e 0%, #020210 60%, #000 100%); overflow: hidden; }
        .star-scene .night-sky { position: absolute; inset: 0; }
        .star-scene .sky-star { position: absolute; width: 2px; height: 2px; background: #fff; border-radius: 50%; animation: skyTwinkle 3s ease-in-out infinite; }
        @keyframes skyTwinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        .shooting-star-trail { position: absolute; width: 200px; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,215,100,0.8), rgba(255,255,255,0.95)); border-radius: 2px; transform-origin: right center; animation: shootStar 1.5s ease-out forwards; opacity: 0; filter: drop-shadow(0 0 8px rgba(255,215,100,0.6)); }
        @keyframes shootStar { 0% { transform: translateX(30vw) translateY(-20vh) rotate(-30deg); opacity: 0; width: 0; } 10% { opacity: 1; width: 200px; } 100% { transform: translateX(-60vw) translateY(40vh) rotate(-30deg); opacity: 0; width: 300px; } }
        .star-wish-container { position: relative; z-index: 2; text-align: center; }
        .star-wish-emoji { font-size: 120px; display: block; filter: drop-shadow(0 0 50px rgba(255,215,100,0.6)); animation: starGlow 2s ease-in-out infinite; }
        @keyframes starGlow { 0%,100% { filter: drop-shadow(0 0 40px rgba(255,215,100,0.5)); transform: scale(1); } 50% { filter: drop-shadow(0 0 80px rgba(255,215,100,0.9)); transform: scale(1.1); } }
        .star-wish-text { font-family: 'Pacifico', cursive; font-size: 26px; color: rgba(255,215,100,0.9); text-align: center; margin-top: 25px; opacity: 0; animation: starTextIn 1.5s ease-out 1s forwards; text-shadow: 0 0 20px rgba(255,215,100,0.3); line-height: 1.6; max-width: 450px; z-index: 3; }
        @keyframes starTextIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .star-wish-hint { font-family: 'VT323', monospace; font-size: 16px; color: rgba(255,215,100,0.2); margin-top: 25px; animation: hintPulse 2s infinite; z-index: 3; }
        .star-trail-burst { position: absolute; font-size: 20px; opacity: 0; animation: trailBurst 1.5s ease-out forwards; pointer-events: none; }
        @keyframes trailBurst { 0% { transform: scale(0); opacity: 0; } 20% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.5) translateY(-100px); opacity: 0; } }

        `;

html = html.substring(0, cssIdx) + newCSS + html.substring(cssIdx);

// ===== 2. ADD JS for Rose Bloom & Shooting Star logic =====
// Find the section right before "// SPECIAL LOGIC FOR TEDDY BEAR"
const teddyMarker = '            // SPECIAL LOGIC FOR TEDDY BEAR (VIRTUAL HUG)';
const teddyIdx = html.indexOf(teddyMarker);
if (teddyIdx === -1) { console.log('Teddy marker not found!'); process.exit(1); }

const roseStarJS = `            // SPECIAL LOGIC FOR VIRTUAL ROSE (INTERACTIVE BLOOM)
            if (id === 'virtual_rose') {
                contentEl.style.display = 'none';
                overlay.style.background = 'transparent';
                overlay.onclick = null;

                const scene = document.createElement('div');
                scene.className = 'rose-scene';

                // BG petals
                const petalBg = document.createElement('div');
                petalBg.className = 'rose-petals-bg';
                for (let i = 0; i < 25; i++) {
                    const p = document.createElement('div');
                    p.className = 'bg-petal';
                    p.textContent = ['🌸','🌺','💮','🏵️'][Math.floor(Math.random()*4)];
                    p.style.left = Math.random()*100 + '%';
                    p.style.animationDelay = Math.random()*5 + 's';
                    p.style.animationDuration = (4+Math.random()*4) + 's';
                    petalBg.appendChild(p);
                }
                scene.appendChild(petalBg);

                const container = document.createElement('div');
                container.className = 'rose-bloom-container';
                const roseEmoji = document.createElement('span');
                roseEmoji.className = 'rose-bloom-emoji';
                roseEmoji.textContent = '🌹';
                container.appendChild(roseEmoji);
                scene.appendChild(container);

                const hint = document.createElement('div');
                hint.className = 'rose-hint';
                hint.textContent = 'Klik bunga mawar untuk mekarkannya...';
                scene.appendChild(hint);

                overlay.appendChild(scene);

                const ROSE_WORDS = [
                    "You are beautiful ✨",
                    "More than words can say 💕",
                    "Every petal is a reason I adore you 🌹",
                    "You make the world bloom 🌸"
                ];
                const ROSE_FINAL = [
                    "A single rose can be my garden, a single friend my world. And you are both.",
                    "Like a rose, your beauty captivates. But unlike a rose, your charm never fades.",
                    "I'd pick every rose in the world just to see you smile.",
                    "Some see a rose and see just a flower. I see a rose and think of you."
                ];

                let bloomStage = 0;
                roseEmoji.onclick = (e) => {
                    e.stopPropagation();
                    bloomStage++;
                    playSFX([523+bloomStage*100, 659+bloomStage*80], 'sine', 0.3, 0.1);

                    // Floating word
                    if (bloomStage <= ROSE_WORDS.length) {
                        const word = document.createElement('div');
                        word.className = 'rose-word-bubble';
                        word.textContent = ROSE_WORDS[bloomStage-1];
                        word.style.left = (30 + Math.random()*40) + '%';
                        word.style.top = (25 + Math.random()*20) + '%';
                        scene.appendChild(word);
                        setTimeout(() => word.remove(), 2500);
                    }

                    // Bloom stages
                    if (bloomStage === 1) roseEmoji.classList.add('bloom-1');
                    if (bloomStage === 2) { roseEmoji.classList.remove('bloom-1'); roseEmoji.classList.add('bloom-2'); }
                    if (bloomStage === 3) { roseEmoji.classList.remove('bloom-2'); roseEmoji.classList.add('bloom-3'); }

                    if (bloomStage >= 4) {
                        roseEmoji.classList.remove('bloom-3');
                        roseEmoji.classList.add('bloom-burst');
                        roseEmoji.onclick = null;
                        hint.remove();

                        // Burst petals
                        spawnBurst('🌹', true); spawnBurst('🌸', true); spawnBurst('💖', true);
                        playSFX([783.99, 880.00, 987.77, 1046.50], 'sine', 0.6, 0.1);

                        setTimeout(() => {
                            roseEmoji.style.display = 'none';
                            const finalText = document.createElement('div');
                            finalText.className = 'rose-final-text';
                            finalText.textContent = ROSE_FINAL[Math.floor(Math.random()*ROSE_FINAL.length)];
                            scene.appendChild(finalText);

                            const closeHint = document.createElement('div');
                            closeHint.className = 'rose-hint';
                            closeHint.textContent = 'Klik untuk menutup...';
                            scene.appendChild(closeHint);

                            overlay.onclick = () => {
                                overlay.style.animation = 'overlayFadeOut 0.5s ease-in forwards';
                                setTimeout(() => {
                                    overlay.style.display = 'none';
                                    overlay.style.animation = '';
                                    overlay.onclick = null;
                                    scene.remove();
                                }, 500);
                            };
                        }, 900);
                    }
                };

                return;
            }

            // SPECIAL LOGIC FOR SHOOTING STAR (CINEMATIC WISH)
            if (id === 'star_wish') {
                contentEl.style.display = 'none';
                overlay.style.background = 'transparent';
                overlay.onclick = null;

                const scene = document.createElement('div');
                scene.className = 'star-scene';

                // Night sky stars
                const sky = document.createElement('div');
                sky.className = 'night-sky';
                for (let i = 0; i < 80; i++) {
                    const s = document.createElement('div');
                    s.className = 'sky-star';
                    s.style.left = Math.random()*100 + '%';
                    s.style.top = Math.random()*100 + '%';
                    s.style.width = (1+Math.random()*2) + 'px';
                    s.style.height = s.style.width;
                    s.style.animationDelay = Math.random()*3 + 's';
                    s.style.animationDuration = (2+Math.random()*3) + 's';
                    sky.appendChild(s);
                }
                scene.appendChild(sky);

                // Shooting stars interval
                const shootInterval = setInterval(() => {
                    if (!scene.parentElement) { clearInterval(shootInterval); return; }
                    const trail = document.createElement('div');
                    trail.className = 'shooting-star-trail';
                    trail.style.top = Math.random()*40 + '%';
                    trail.style.right = '-200px';
                    scene.appendChild(trail);
                    setTimeout(() => trail.remove(), 1600);
                }, 800);

                // Main star
                const container = document.createElement('div');
                container.className = 'star-wish-container';
                const starEmoji = document.createElement('span');
                starEmoji.className = 'star-wish-emoji';
                starEmoji.textContent = '⭐';
                container.appendChild(starEmoji);
                scene.appendChild(container);

                const WISH_MSGS = [
                    "May every star in the sky watch over you tonight.",
                    "If I could catch a shooting star, I would wish for you, always.",
                    "You shine brighter than every constellation combined.",
                    "Close your eyes, make a wish... because you deserve every one of them.",
                    "The stars are jealous of the light in your eyes."
                ];

                const text = document.createElement('div');
                text.className = 'star-wish-text';
                text.textContent = WISH_MSGS[Math.floor(Math.random()*WISH_MSGS.length)];
                scene.appendChild(text);

                // SFX: dreamy ascending
                playSFX([261.63, 329.63, 392.00, 523.25], 'sine', 0.8, 0.08);
                setTimeout(() => playSFX([392.00, 523.25, 659.25, 783.99], 'sine', 0.6, 0.06), 600);
                setTimeout(() => playSFX([523.25, 659.25, 783.99, 1046.50], 'sine', 0.5, 0.05), 1200);

                // Sparkle bursts
                const sparkleInt = setInterval(() => {
                    if (!scene.parentElement) { clearInterval(sparkleInt); return; }
                    const spark = document.createElement('div');
                    spark.className = 'star-trail-burst';
                    spark.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
                    spark.style.left = (20+Math.random()*60) + '%';
                    spark.style.top = (30+Math.random()*40) + '%';
                    scene.appendChild(spark);
                    setTimeout(() => spark.remove(), 1500);
                }, 400);

                overlay.appendChild(scene);

                const closeHint = document.createElement('div');
                closeHint.className = 'star-wish-hint';
                closeHint.textContent = 'Klik untuk menutup...';
                scene.appendChild(closeHint);

                // Allow close after 3s
                setTimeout(() => {
                    overlay.onclick = () => {
                        clearInterval(shootInterval);
                        clearInterval(sparkleInt);
                        overlay.style.animation = 'overlayFadeOut 0.5s ease-in forwards';
                        setTimeout(() => {
                            overlay.style.display = 'none';
                            overlay.style.animation = '';
                            overlay.onclick = null;
                            scene.remove();
                        }, 500);
                    };
                }, 2000);

                return;
            }

`;

html = html.substring(0, teddyIdx) + roseStarJS + html.substring(teddyIdx);

fs.writeFileSync('shop.html', html, 'utf8');
console.log('Done! Rose bloom + Shooting star scenes added!');
