/**
 * TITAH RATU SYSTEM - Isolated Component
 * Created to be robust, beautiful, and protected from external magic chaos.
 */

(function() {
    // 1. Data & Messages
    const titahMessages = [
        "“Dewan Kerajaan menyatakan:\nRatu adalah pusat keindahan hari ini.\nKeputusan ini tidak bisa diganggu gugat.”",
        "“Titah Istana:\nRatu diperbolehkan melakukan apapun hari ini,\ntermasuk tidak melakukan apa-apa.”",
        "“Peraturan Kerajaan:\ntidak ada yang boleh membuat Ratu merasa buruk.\nTermasuk pikirannya sendiri.”",
        "“Catatan dari Penjaga Istana:\nsenyum Ratu memiliki nilai yang lebih tinggi\ndaripada emas mana pun.”",
        "“Keputusan Dewan:\nRatu tidak perlu terburu-buru.\nSemua hal akan datang pada waktunya.”",
        "“Laporan Rahasia Istana:\nada seseorang di luar kerajaan\nyang diam-diam mengagumi Ratu.”",
        "“Undang-undang kerajaan terbaru:\nRatu wajib menjaga dirinya dengan baik.\nKarena keberadaannya terlalu berharga untuk diabaikan.”",
        "“Pesan dari Pembuat telah tiba!\nPembuat berharap senyum Ratu\nselalu bisa membuat harinya cerah.”"
    ];

    // 2. Style Injection (With Protection)
    const style = document.createElement('style');
    style.id = 'titahRatuStyles';
    style.innerHTML = `
        /* PROTECTION: Prevent Abrakadabra from affecting this system */
        #titahRatuBtn,
        #titahRatuModal,
        #titahRatuModal * {
            animation: none !important;
            transform: none !important;
            transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease, box-shadow 0.3s ease !important;
            isolation: isolate;
        }

        /* 👑 TITAH RATU BUTTON 👑 */
        #titahRatuBtn {
            position: fixed;
            top: 70px;
            left: 20px;
            z-index: 9999999;
            padding: 12px 24px;
            border-radius: 50px;
            background: linear-gradient(135deg, #d4af37 0%, #f1c40f 50%, #b8860b 100%);
            border: 2px solid rgba(255, 215, 120, 0.7);
            color: #1a0f2e;
            font-family: 'Playfair Display', serif;
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            cursor: pointer;
            display: none; /* Controlled by refreshTitahSystem */
            align-items: center;
            gap: 10px;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3);
            text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }

        #titahRatuBtn:hover {
            filter: brightness(1.1);
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.4);
            transform: translateY(-2px) scale(1.05) !important;
        }

        #titahRatuBtn:active {
            transform: scale(0.95) !important;
        }

        /* 👑 MODAL OVERLAY 👑 */
        #titahRatuModal {
            position: fixed;
            inset: 0;
            background: rgba(8, 4, 12, 0.6);
            backdrop-filter: blur(8px);
            z-index: 10000000;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.4s ease !important;
        }

        #titahRatuModal.active {
            display: flex;
            opacity: 1;
        }

        /* 👑 SCROLL CONTAINER 👑 */
        .titah-scroll-main {
            width: min(90%, 480px);
            position: relative;
            transform-origin: center;
            opacity: 0;
            transform: scale(0.8) translateY(20px) !important;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        #titahRatuModal.active .titah-scroll-main {
            opacity: 1;
            transform: scale(1) translateY(0) !important;
        }

        /* Parchment Paper */
        .parchment {
            background: #fdfaf6 url('https://www.transparenttextures.com/patterns/aged-paper.png');
            background-size: cover;
            padding: 50px 40px;
            border-left: 4px solid #8b4513;
            border-right: 4px solid #8b4513;
            box-shadow: 0 25px 60px rgba(0,0,0,0.5);
            position: relative;
            overflow: hidden;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
        }

        /* Scroll Rollers */
        .scroll-roller {
            position: absolute;
            left: -15px;
            right: -15px;
            height: 30px;
            background: linear-gradient(to bottom, #4d2305, #b8860b, #d4af37, #b8860b, #4d2305);
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10;
        }
        .scroll-roller.top { top: -15px; }
        .scroll-roller.bottom { bottom: -15px; }

        .scroll-roller::before, .scroll-roller::after {
            content: '';
            position: absolute;
            width: 22px; height: 40px;
            background: #d4af37;
            top: -5px; border-radius: 4px;
            box-shadow: inset 0 0 8px rgba(0,0,0,0.3);
        }
        .scroll-roller::before { left: -5px; }
        .scroll-roller::after { right: -5px; }

        /* Content Styles */
        .titah-header {
            font-family: 'Playfair Display', serif;
            font-size: 26px;
            color: #8b0000;
            font-weight: 900;
            letter-spacing: 4px;
            margin-bottom: 20px;
            text-transform: uppercase;
            border-bottom: 2px solid rgba(139, 69, 19, 0.2);
            padding-bottom: 10px;
            width: 100%;
        }

        .titah-category {
            font-family: 'VT323', monospace;
            font-size: 16px;
            color: #b8860b;
            letter-spacing: 2px;
            margin-bottom: 15px;
        }

        .titah-body {
            font-family: 'Lora', serif;
            font-size: 19px;
            line-height: 1.7;
            color: #2c1810;
            font-style: italic;
            font-weight: 500;
            margin-bottom: 30px;
            opacity: 0;
            transform: translateY(10px) !important;
            transition: all 0.6s ease 0.3s !important;
        }

        #titahRatuModal.active .titah-body {
            opacity: 1;
            transform: translateY(0) !important;
        }

        /* Close Button */
        .titah-close-btn {
            background: transparent;
            color: #8b0000;
            border: 2px solid #8b0000;
            padding: 8px 25px;
            border-radius: 20px;
            font-family: 'VT323', monospace;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease !important;
            margin-top: 10px;
        }

        .titah-close-btn:hover {
            background: rgba(139, 0, 0, 0.05);
            transform: scale(1.1) !important;
            box-shadow: 0 0 15px rgba(139, 0, 0, 0.2);
        }

        /* Particles */
        .titah-particle {
            position: absolute;
            pointer-events: none;
            font-size: 16px;
            z-index: 5;
            filter: drop-shadow(0 0 5px gold);
        }

        @keyframes titahParticleFloat {
            0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(45deg); }
            80% { opacity: 0.8; transform: translate(calc(var(--tx) * 2), calc(var(--ty) * 2)) scale(1) rotate(90deg); }
            100% { transform: translate(calc(var(--tx) * 3), calc(var(--ty) * 3)) scale(0) rotate(180deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // 3. UI Elements Creation
    const btn = document.createElement('button');
    btn.id = 'titahRatuBtn';
    btn.innerHTML = '<span>👑</span> Titah Ratu';
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.id = 'titahRatuModal';
    modal.innerHTML = `
        <div class="titah-scroll-main">
            <div class="scroll-roller top"></div>
            <div class="parchment">
                <div class="titah-category">TITAH ISTANA</div>
                <div class="titah-header">👑 Titah Ratu 👑</div>
                <div class="titah-body" id="titahBodyText"></div>
                <button class="titah-close-btn" id="titahModalClose">Tutup</button>
            </div>
            <div class="scroll-roller bottom"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const bodyText = modal.querySelector('#titahBodyText');

    // 4. Sound Effects Utility
    function playRoyalSound(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            const now = ctx.currentTime;
            
            if (type === 'open') {
                // Paper scroll sound simulation (sine sweep)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
                gain.gain.linearRampToValueAtTime(0, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            } else if (type === 'close') {
                // Fold sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(660, now);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        } catch (e) {
            console.warn("Audio Context failed for Royal Sound", e);
        }
    }

    // 5. Logic & Events
    function openScroll() {
        const msg = titahMessages[Math.floor(Math.random() * titahMessages.length)];
        bodyText.innerHTML = msg.replace(/\n/g, '<br>');
        modal.classList.add('active');
        playRoyalSound('open');
        spawnSparkles();
    }

    function closeScroll() {
        modal.classList.remove('active');
        playRoyalSound('close');
    }

    function spawnSparkles() {
        const emojis = ['✨', '💫', '🌟'];
        const container = modal.querySelector('.parchment');
        const rect = container.getBoundingClientRect();
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                if (!modal.classList.contains('active')) return;
                const p = document.createElement('div');
                p.className = 'titah-particle';
                p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                p.style.left = (rect.left + Math.random() * rect.width) + 'px';
                p.style.top = (rect.top + Math.random() * rect.height) + 'px';
                
                const tx = (Math.random() * 100 - 50);
                const ty = (Math.random() * -100 - 20);
                p.style.setProperty('--tx', tx + 'px');
                p.style.setProperty('--ty', ty + 'px');
                
                const dur = (2 + Math.random() * 2) + 's';
                p.style.animation = `titahParticleFloat ${dur} ease-out forwards`;
                
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 4000);
            }, i * 150);
        }
    }

    btn.onclick = (e) => {
        // Ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            border-radius: 50%;
            background: rgba(255, 215, 120, 0.4);
            transform: scale(0);
            pointer-events: none;
            z-index: 10000000;
            width: 100px; height: 100px;
            left: ${e.clientX - 50}px; top: ${e.clientY - 50}px;
            animation: royalRipple 0.6s ease-out forwards;
        `;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);

        playRoyalSound('click');
        setTimeout(openScroll, 200);
    };

    modal.querySelector('#titahModalClose').onclick = closeScroll;
    modal.onclick = (e) => { if (e.target === modal) closeScroll(); };

    // 6. Global Bridge
    window.refreshTitahSystem = function() {
        const isQueenActive = localStorage.getItem('isQueenActive') === 'true';
        const display = isQueenActive ? 'flex' : 'none';
        
        if (btn.style.display !== display) {
            console.log("[TitahSystem] Visibility change:", display);
            btn.style.display = display;
            document.body.classList.toggle('queen-mode', isQueenActive);
        }

        // Re-append if lost (DOM protection)
        if (!document.body.contains(btn)) document.body.appendChild(btn);
        if (!document.body.contains(modal)) document.body.appendChild(modal);
    };

    // Initial check
    window.refreshTitahSystem();

    // Inject ripple animation keyframes
    const kf = document.createElement('style');
    kf.innerHTML = `@keyframes royalRipple { to { transform: scale(3); opacity: 0; } }`;
    document.head.appendChild(kf);

    console.log("👑 Titah Ratu System (Isolated) Initialized.");
})();
