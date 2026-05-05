/**
 * QUEEN INTERACTION EFFECTS
 * Safe extension - adds visual reactions to clicks when Crown is active.
 */

(function() {
    // 1. Style Injection
    const style = document.createElement('style');
    style.id = 'queenInteractionStyles';
    style.innerHTML = `
        .queen-edge-pulse {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 10000001;
            box-shadow: inset 0 0 40px rgba(255, 215, 0, 0.6);
            opacity: 0;
            animation: queenEdgePulseAnim 0.8s ease-out forwards;
        }
        @keyframes queenEdgePulseAnim {
            0% { opacity: 0; }
            30% { opacity: 1; }
            100% { opacity: 0; }
        }

        .queen-ripple {
            position: fixed;
            border-radius: 50%;
            border: 2px solid gold;
            box-shadow: 0 0 10px gold;
            pointer-events: none;
            z-index: 10000002;
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
            animation: queenRippleAnim 0.6s ease-out forwards;
        }
        @keyframes queenRippleAnim {
            to { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }

        .queen-blessing {
            position: fixed;
            pointer-events: none;
            z-index: 10000003;
            font-size: 24px;
            filter: drop-shadow(0 0 5px gold);
            animation: queenBlessingAnim 2.5s ease-in-out forwards;
        }
        @keyframes queenBlessingAnim {
            0% { transform: translateY(-50px) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh) translateX(var(--drift)) rotate(360deg); opacity: 0; }
        }

        /* Protection from Abrakadabra */
        .queen-edge-pulse, .queen-ripple, .queen-blessing {
            transform: none; /* Reset if Abrakadabra tries to touch */
            animation-play-state: running !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Effect Implementations
    const effects = {
        edgePulse: () => {
            const el = document.createElement('div');
            el.className = 'queen-edge-pulse';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1000);
        },
        royalRipple: (x, y) => {
            const el = document.createElement('div');
            el.className = 'queen-ripple';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.width = '60px';
            el.style.height = '60px';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 800);
        },
        blessingDrop: () => {
            const emojis = ['👑', '✨', '💫'];
            const count = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const el = document.createElement('div');
                    el.className = 'queen-blessing';
                    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    el.style.left = Math.random() * 100 + 'vw';
                    el.style.top = '-50px';
                    el.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
                    document.body.appendChild(el);
                    setTimeout(() => el.remove(), 3000);
                }, i * 300);
            }
        },
        royalBreeze: (x, y) => {
            // Find nearby icons
            const icons = Array.from(document.querySelectorAll('.item-emoji, .nav-item span, .card-icon, .stat-icon'));
            const nearby = icons.filter(icon => {
                const rect = icon.getBoundingClientRect();
                const dist = Math.hypot(rect.left + rect.width/2 - x, rect.top + rect.height/2 - y);
                return dist < 250;
            }).slice(0, 4);

            nearby.forEach(icon => {
                // Filter out protected elements
                if (icon.closest('button') || icon.closest('#titahRatuBtn') || icon.closest('#titahRatuModal')) return;
                
                const originalTransition = icon.style.transition;
                const originalTransform = icon.style.transform;
                
                icon.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                const tx = (Math.random() * 8 - 4);
                const rot = (Math.random() * 4 - 2);
                icon.style.transform = `translateY(${tx}px) rotate(${rot}deg)`;
                
                setTimeout(() => {
                    icon.style.transform = originalTransform;
                    setTimeout(() => {
                        icon.style.transition = originalTransition;
                    }, 500);
                }, 600);
            });
        }
    };

    // 3. Global Listener
    document.addEventListener('click', function(e) {
        // Condition: Queen Mode must be active
        if (!document.body.classList.contains('queen-mode') && localStorage.getItem('isQueenActive') !== 'true') return;

        // Condition: 30% chance
        if (Math.random() > 0.3) return;

        // Choose one random effect
        const keys = Object.keys(effects);
        const effectName = keys[Math.floor(Math.random() * keys.length)];
        
        console.log("[QueenInteraction] Triggering:", effectName);
        effects[effectName](e.clientX, e.clientY);
    }, { passive: true });

    console.log("👑 Queen Interaction System Initialized.");
})();
