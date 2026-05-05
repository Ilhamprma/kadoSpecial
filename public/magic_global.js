/* 
 * Magic Global Controller - Fairy Rescue, Music Box & Magic Effects
 * Works globally across all HTML pages
 */

(function() {
    // 0. Global Setup
    const path = window.location.pathname.toLowerCase();
    const isIntroPage = path.includes('intro.html');
    const isOnboardingPage = path.includes('onboarding.html');

    let phase = 'normal'; // normal, freeze, popup, flight, casting, refill, unfreeze
    const COST = 50;
    const totalSongsRequired = 10;
    
    // Define getUnlockedSongs globally for shop.html and other pages
    window.getUnlockedSongs = () => JSON.parse(localStorage.getItem('unlockedSongs') || '[]');

    // 1. Style Injection
    const style = document.createElement('style');
    style.innerHTML = `
        /* Subtler Reality Change */
        body.reality-change-mode {
            animation: realityHue 8s linear infinite !important;
        }
        @keyframes realityHue {
            0% { filter: contrast(1.02) drop-shadow(0 0 5px rgba(255,100,200,0.1)); }
            100% { filter: contrast(1.02) drop-shadow(0 0 5px rgba(100,255,200,0.1)); }
        }



        /* Global Freeze Overlay */
        #fairyOverlay {
            position: fixed; inset: 0;
            background: rgba(8, 0, 20, 0.75);
            backdrop-filter: blur(8px);
            z-index: 9999998;
            display: none; flex-direction: column;
            justify-content: center; align-items: center;
            opacity: 0; transition: opacity 0.5s ease;
            pointer-events: auto;
        }
        #fairyOverlay.active { opacity: 1; }
        
        #fairyOverlay .freeze-text {
            position: absolute; bottom: 15%; left: 50%;
            transform: translateX(-50%);
            font-family: 'Press Start 2P', monospace;
            font-size: 12px; color: #00ffff;
            letter-spacing: 3px; animation: fairyPulse 1.5s infinite alternate;
            text-align: center; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            pointer-events: none;
        }
        
        #fairyPopup {
            background: rgba(16, 5, 29, 0.9);
            border: 1.5px solid rgba(255, 215, 0, 0.6);
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
            border-radius: 20px; padding: 30px;
            width: 420px; max-width: 90vw;
            text-align: center; z-index: 9999999;
            transform: scale(0.7); opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
        }
        #fairyPopup.show { transform: scale(1); opacity: 1; }

        .fairy-avatar {
            font-size: 60px; margin-bottom: 20px;
            display: inline-block; animation: fairyFloat 2s ease-in-out infinite alternate;
        }

        .fairy-message {
            font-family: 'VT323', monospace; font-size: 24px;
            color: #ffb7fb; line-height: 1.5; margin-bottom: 25px;
            text-shadow: 0 0 5px rgba(255,183,251,0.3);
        }

        /* ===== CHAOTIC MAGIC UPGRADES ===== */
        .magic-aurora {
            position: fixed; inset: 0; pointer-events: none; z-index: 10001;
            background: linear-gradient(125deg, rgba(255,159,243,0.05), rgba(72,219,251,0.05), rgba(254,202,103,0.05));
            background-size: 400% 400%; animation: auroraShift 12s ease infinite;
            opacity: 0; transition: opacity 2s ease;
        }
        @keyframes auroraShift {
            0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }
        }
        
        body.chaotic-magic-mode {
            filter: contrast(1.05) brightness(1.02);
            transition: filter 1s ease;
        }
        body.chaotic-magic-mode main, 
        body.chaotic-magic-mode .shop-container,
        body.chaotic-magic-mode .slot-container {
            filter: blur(0.4px);
        }

        /* GOLDEN RECORD REWARD POPUP (USER DESIGN) */
        .reward-popup-overlay {
            position: fixed; inset: 0; z-index: 9999999;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease;
        }
        .reward-popup-overlay.active { display: flex; opacity: 1; }
        .reward-popup-content {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #ffd700;
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1);
            position: relative;
            overflow: hidden;
            transform: scale(0.5) translateY(50px);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .reward-popup-overlay.active .reward-popup-content {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        .reward-popup-glow {
            position: absolute; inset: 0;
            background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
            pointer-events: none;
        }
        .reward-popup-title {
            font-family: 'Pacifico', cursive;
            font-size: 32px;
            color: #ffd700;
            margin-bottom: 20px;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
        }
        .reward-popup-body {
            font-family: 'VT323', monospace;
            font-size: 22px;
            color: #fff;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .reward-popup-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            margin: 30px 0;
        }
        .reward-popup-disc {
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, #ffd700 30%, #b8860b 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 50px;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
            animation: recordRotate 4s linear infinite;
            border: 3px solid rgba(255,255,255,0.2);
        }
        @keyframes recordRotate { to { transform: rotate(360deg); } }
        .reward-popup-btn {
            background: #ffd700;
            color: #000;
            border: none;
            padding: 15px 40px;
            font-family: 'Press Start 2P', monospace;
            font-size: 12px;
            border-radius: 50px;
            cursor: pointer;
            transition: 0.3s;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
        }
        .reward-popup-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.7);
        }

        .sparkle-storm-container {
            position: fixed; inset: 0; pointer-events: none; z-index: 10002;
            overflow: hidden; opacity: 0; transition: opacity 1s ease;
        }
        
        .magic-ring-burst {
            position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(0);
            width: 100px; height: 100px; border: 4px solid #ffb7fb; border-radius: 50%;
            box-shadow: 0 0 50px #ffb7fb, inset 0 0 50px #ffb7fb;
            pointer-events: none; z-index: 10003; opacity: 0;
        }
        @keyframes ringExpand {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
        }

        .detached-icon {
            position: fixed; z-index: 11000; pointer-events: none;
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.6));
            will-change: transform;
            animation: abracadabraFloatClone var(--float-duration) ease-in-out infinite;
            animation-delay: var(--float-delay);
        }
        
        @keyframes abracadabraFloatClone {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(1);
            }
            50% {
                transform: translate(var(--float-x), var(--float-y)) rotate(var(--float-rot)) scale(var(--float-scale));
            }
            100% {
                transform: translate(0, 0) rotate(0deg) scale(1);
            }
        }

        .fairy-btn {
            background: rgba(0, 255, 255, 0.1);
            border: 1.5px solid #00ffff; color: #00ffff;
            font-family: 'Press Start 2P', monospace; font-size: 10px;
            padding: 12px 24px; border-radius: 50px;
            cursor: pointer; transition: 0.3s;
            box-shadow: 0 0 15px rgba(0,255,255,0.3);
        }
        .fairy-btn:hover {
            background: rgba(0, 255, 255, 0.3);
            box-shadow: 0 0 25px rgba(0,255,255,0.6);
            transform: translateY(-2px);
        }

        #fairyActor {
            position: fixed; font-size: 40px; z-index: 10000000;
            pointer-events: none; transition: all 1.2s cubic-bezier(0.25, 1, 0.5, 1);
            transform: translate(-50%, -50%); opacity: 0;
            left: 50%; top: 50%;
        }

        #magicRune {
            position: fixed; z-index: 9999999; width: 120px; height: 120px;
            border: 2px dashed #ffd700; border-radius: 50%;
            pointer-events: none; opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg);
            transition: opacity 0.5s ease;
            box-shadow: 0 0 20px rgba(255,215,0,0.4), inset 0 0 20px rgba(255,215,0,0.4);
        }
        #magicRune.spinning { opacity: 1; animation: runeSpin 2s linear infinite; }

        .sparkle-dot {
            position: fixed; width: 8px; height: 8px;
            border-radius: 50%; pointer-events: none;
            z-index: 10000001; opacity: 1;
            animation: sparkleFade 0.8s forwards ease-out;
        }

        @keyframes fairyFloat {
            0% { transform: translateY(0px) rotate(-3deg); }
            100% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes fairyPulse { 0% { opacity: 0.4; } 100% { opacity: 1; } }
        @keyframes runeSpin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes sparkleFade { 100% { opacity: 0; transform: scale(0.2) translateY(10px); } }
        
        .grayscale-freeze {
            filter: grayscale(60%) contrast(0.9) brightness(0.5) !important;
            pointer-events: none !important; user-select: none !important;
            transition: filter 0.8s ease;
        }

        #fairyHelperNode {
            position: fixed; bottom: 80px; left: 20px;
            z-index: 9999990; cursor: pointer; display: none;
            flex-direction: column; align-items: center;
            animation: floatingFairy 2.5s ease-in-out infinite alternate;
            transition: transform 0.3s ease;
        }
        #fairyHelperNode:hover { transform: scale(1.15); }
        .helper-avatar {
            font-size: 45px; filter: drop-shadow(0 0 10px rgba(0,255,255,0.4));
            transition: filter 0.3s ease;
        }
        .helper-bubble {
            position: absolute; top: -45px; background: rgba(16, 5, 29, 0.9);
            border: 1.5px solid #48dbfb; box-shadow: 0 0 15px rgba(72,219,251,0.4);
            border-radius: 8px; padding: 6px 12px;
            font-family: 'VT323', monospace; font-size: 16px; color: #ffb7fb;
            white-space: nowrap; animation: helperPulse 1.5s infinite alternate;
        }
        @keyframes floatingFairy { 0% { transform: translateY(0px) rotate(-2deg); } 100% { transform: translateY(-12px) rotate(2deg); } }

        /* GOLD DISC BUTTON */
        #goldDisc {
            position: fixed !important;
            bottom: 24px !important;
            right: 24px !important;
            width: 64px !important;
            height: 64px !important;
            border-radius: 50% !important;
            background: radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 60%, #8b6b14 100%) !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4), 0 0 20px rgba(255,215,0,0.3) !important;
            cursor: pointer !important;
            z-index: 9999999 !important;
            display: none;
            justify-content: center;
            align-items: center;
            border: 2px solid rgba(255,255,255,0.2) !important;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            animation: discRotate 8s linear infinite, discFloat 3s ease-in-out infinite alternate;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        #goldDisc:hover { transform: scale(1.08); box-shadow: 0 6px 25px rgba(0,0,0,0.5), 0 0 35px rgba(255,215,0,0.5); }
        #goldDisc::after {
            content: ''; position: absolute; inset: -2px; border-radius: 50%;
            background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%);
            background-size: 200% 200%; animation: discShine 4s infinite; pointer-events: none;
        }

        .eq-container { display: flex; align-items: flex-end; gap: 2px; height: 14px; z-index: 2; pointer-events: none; }
        .eq-bar { width: 3px; background: #fff; height: 3px; transition: height 0.15s ease; box-shadow: 0 0 4px #fff; }
        #goldDisc.playing .eq-bar:nth-child(1) { animation: eqAnim 0.4s infinite alternate; }
        #goldDisc.playing .eq-bar:nth-child(2) { animation: eqAnim 0.6s infinite alternate; }
        #goldDisc.playing .eq-bar:nth-child(3) { animation: eqAnim 0.3s infinite alternate; }
        #goldDisc.playing .eq-bar:nth-child(4) { animation: eqAnim 0.5s infinite alternate; }

        @keyframes eqAnim { 0% { height: 3px; } 100% { height: 12px; } }
        @keyframes discRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes discFloat { 0% { transform: translateY(0px); } 100% { transform: translateY(-6px); } }
        @keyframes discShine { 0% { background-position: -200% -200%; } 100% { background-position: 200% 200%; } }
        #goldDisc.playing { animation: discRotate 4s linear infinite, discPulse 2s ease-in-out infinite alternate; }
        @keyframes discPulse { 0% { box-shadow: 0 0 20px rgba(255,215,0,0.3); } 100% { box-shadow: 0 0 45px rgba(255,215,0,0.7); } }

        #spawnOverlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.75);
            backdrop-filter: blur(4px); z-index: 10000000;
            display: none; opacity: 0; transition: opacity 0.8s ease;
            pointer-events: none;
        }

        .ripple {
            position: absolute; border: 2px solid rgba(255,215,0,0.6);
            border-radius: 50%; animation: rippleEffect 0.8s ease-out forwards;
            pointer-events: none; z-index: 9999998;
        }
        @keyframes rippleEffect { 0% { width: 0; height: 0; opacity: 1; } 100% { width: 200px; height: 200px; opacity: 0; } }

        @media (max-width: 600px) {
            #goldDisc { width: 50px; height: 50px; bottom: 15px; right: 15px; }
            .eq-container { height: 10px; }
        }

        /* ===== MUSIC BOX PLAYER ===== */
        .music-box-overlay {
            position: fixed; inset: 0; z-index: 12000;
            background: rgba(2, 1, 12, 0.96); backdrop-filter: blur(25px);
            display: none; align-items: center; justify-content: center;
        }
        .music-player-card {
            width: 820px; max-width: 95vw; max-height: 95vh;
            background: linear-gradient(160deg, #15082a 0%, #0c0418 40%, #1a0830 100%);
            border: 1px solid rgba(212, 175, 110, 0.25); border-radius: 16px;
            box-shadow: 0 0 100px rgba(212, 175, 110, 0.08), 0 25px 80px rgba(0,0,0,0.6),
                        inset 0 1px 0 rgba(255,255,255,0.04);
            padding: 0; position: relative; overflow: hidden;
            animation: playerPop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .music-player-card::before {
            content: ''; position: absolute; inset: 0; border-radius: 16px;
            background: linear-gradient(180deg, rgba(212,175,110,0.03) 0%, transparent 40%);
            pointer-events: none;
        }
        @keyframes playerPop { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .player-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 30px; border-bottom: 1px solid rgba(212,175,110,0.12);
        }
        .player-title {
            font-family: 'VT323', monospace; font-size: 18px; color: rgba(212,175,110,0.9);
            letter-spacing: 6px; text-transform: uppercase;
        }
        .player-close {
            background: none; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.25);
            width: 32px; height: 32px; border-radius: 50%; font-size: 18px;
            cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center;
        }
        .player-close:hover { color: #e94560; border-color: rgba(233,69,96,0.3); background: rgba(233,69,96,0.08); }
        .player-body { display: flex; min-height: 520px; }

        .player-left {
            flex: 1; padding: 25px 25px 15px; display: flex; flex-direction: column; align-items: center;
            border-right: 1px solid rgba(212,175,110,0.08);
            background: radial-gradient(ellipse at 50% 30%, rgba(212,175,110,0.04) 0%, transparent 70%);
            overflow-y: auto;
        }
        .vinyl-container { position: relative; width: 180px; height: 180px; margin-bottom: 15px; }
        .vinyl-disc {
            width: 180px; height: 180px; border-radius: 50%;
            background: radial-gradient(circle at 50% 50%, #2a2a2a 0%, #0a0a0a 28%, #181818 29%, #0d0d0d 32%, #151515 33%, #0a0a0a 50%, #131313 51%, #080808 65%, #111 66%, #060606 100%);
            box-shadow: 0 0 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.4), inset 0 0 1px rgba(255,255,255,0.05);
            animation: vinylSpin 2.5s linear infinite; animation-play-state: paused;
            position: relative;
        }
        .vinyl-disc.playing { animation-play-state: running; }
        .vinyl-disc::before {
            content: ''; position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 65px; height: 65px;
            border-radius: 50%;
            background: radial-gradient(circle, #d4af6e 0%, #b8860b 35%, #8b6914 50%, #2a1a00 70%, #1a0a2e 80%);
            box-shadow: 0 0 20px rgba(212,175,110,0.25), inset 0 0 10px rgba(0,0,0,0.5);
        }
        .vinyl-disc::after {
            content: ''; position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 8px; height: 8px;
            border-radius: 50%; background: #d4af6e;
            box-shadow: 0 0 6px rgba(212,175,110,0.6);
        }
        .vinyl-grooves {
            position: absolute; inset: 0; border-radius: 50%;
            background: repeating-radial-gradient(circle at 50% 50%, transparent 34px, rgba(255,255,255,0.015) 35px, transparent 36px, transparent 38px, rgba(255,255,255,0.01) 39px, transparent 40px, transparent 44px, rgba(255,255,255,0.012) 45px, transparent 46px, transparent 50px, rgba(255,255,255,0.008) 51px, transparent 52px, transparent 58px, rgba(255,255,255,0.01) 59px, transparent 60px, transparent 66px, rgba(255,255,255,0.008) 67px, transparent 68px, transparent 76px, rgba(255,255,255,0.006) 77px, transparent 78px, transparent 86px, rgba(255,255,255,0.005) 87px, transparent 88px, transparent 96px, rgba(255,255,255,0.004) 97px, transparent 98px);
            pointer-events: none;
        }
        .vinyl-glow {
            position: absolute; inset: -20px; border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,110,0.12) 0%, transparent 60%);
            opacity: 0; transition: opacity 0.8s ease;
        }
        .vinyl-disc.playing ~ .vinyl-glow { opacity: 1; }
        .vinyl-arm {
            position: absolute; top: -5px; right: -20px; width: 90px; height: 3px;
            background: linear-gradient(90deg, rgba(180,180,180,0.9), rgba(220,220,220,0.95));
            border-radius: 2px;
            transform-origin: right center; transform: rotate(-35deg);
            transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;
        }
        .vinyl-arm.playing { transform: rotate(-12deg); }
        @keyframes vinylSpin { to { transform: rotate(360deg); } }

        .song-title-display {
            font-family: 'Pacifico', cursive; font-size: 24px;
            color: rgba(212, 175, 110, 0.95);
            text-align: center; margin-bottom: 10px; line-height: 1.3;
            text-shadow: 0 0 20px rgba(212,175,110,0.2);
            min-height: 40px; display: flex; align-items: center; justify-content: center;
        }
        .song-desc-display {
            font-family: 'VT323', monospace; font-size: 17px;
            color: rgba(200, 190, 210, 0.6); font-style: italic;
            text-align: center; line-height: 1.5;
            min-height: 50px; max-width: 320px; letter-spacing: 0.5px;
            padding: 8px 8px; margin-bottom: 5px; flex-shrink: 1;
        }
        .player-controls {
            display: flex; justify-content: center; align-items: center; gap: 18px;
            margin-top: auto; padding: 10px 0 5px; flex-shrink: 0;
        }
        .ctrl-btn {
            width: 48px; height: 38px; border-radius: 8px;
            border: 1px solid rgba(212,175,110,0.3); background: rgba(212,175,110,0.06);
            color: rgba(212,175,110,0.7); font-size: 16px; cursor: pointer;
            transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
        }
        .ctrl-btn:hover {
            border-color: rgba(212,175,110,0.6); color: #d4af6e;
            background: rgba(212,175,110,0.12); box-shadow: 0 0 15px rgba(212,175,110,0.15);
            transform: scale(1.05);
        }
        .ctrl-btn.play-main { width: 64px; height: 42px; font-size: 20px; border-color: rgba(212,175,110,0.5); border-width: 2px; }

        .player-right { width: 310px; display: flex; flex-direction: column; background: rgba(0,0,0,0.15); }
        .tracklist-header {
            padding: 18px 24px; font-family: 'VT323', monospace;
            font-size: 16px; color: rgba(212,175,110,0.6); letter-spacing: 4px;
            border-bottom: 1px solid rgba(212,175,110,0.08);
            display: flex; justify-content: space-between; align-items: center;
            text-transform: uppercase;
        }
        .tracklist-count { color: rgba(255,159,243,0.5); font-size: 14px; letter-spacing: 2px; }
        .track-list { flex: 1; overflow-y: auto; padding: 6px 0; }
        .track-item {
            padding: 10px 24px; cursor: pointer; transition: all 0.3s ease;
            font-family: 'VT323', monospace; font-size: 17px; color: rgba(200,190,210,0.5);
            display: flex; align-items: center; gap: 14px;
            border-left: 2px solid transparent; letter-spacing: 0.5px;
        }
        .track-item:hover { background: rgba(212,175,110,0.04); color: rgba(212,175,110,0.8); }
        .track-item.active { background: linear-gradient(90deg, rgba(212,175,110,0.1), transparent); color: rgba(212,175,110,0.95); border-left-color: rgba(212,175,110,0.7); }
        .track-item.locked { cursor: default; opacity: 0.3; }
        .track-num { font-family: 'VT323', monospace; font-size: 14px; color: rgba(212,175,110,0.25); min-width: 22px; }
        .track-lock { color: rgba(200,190,210,0.25); font-size: 14px; letter-spacing: 3px; }

        .player-progress-container { width: 100%; max-width: 320px; display: flex; align-items: center; gap: 12px; margin: 15px 0; padding: 0 10px; flex-shrink: 0; }
        .time-display { font-family: 'VT323', monospace; font-size: 14px; color: rgba(200, 190, 210, 0.6); min-width: 35px; text-align: center; }
        .progress-bar-track { flex: 1; height: 6px; background: rgba(0, 0, 0, 0.3); border-radius: 999px; position: relative; cursor: pointer; border: 1px solid rgba(212, 175, 110, 0.1); }
        .progress-bar-fill { position: absolute; left: 0; top: 0; height: 100%; width: 0%; background: linear-gradient(90deg, #d4af6e, #ff9ff3); border-radius: 999px; box-shadow: 0 0 10px rgba(212, 175, 110, 0.3); pointer-events: none; display: flex; align-items: center; justify-content: flex-end; }
        .progress-knob { width: 12px; height: 12px; background: #d4af6e; border-radius: 50%; margin-right: -6px; box-shadow: 0 0 10px rgba(212, 175, 110, 0.8); border: 2px solid #15082a; }

        /* MAGIC WAND STYLES */
        .magic-cursor-mode, .magic-cursor-mode * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='20'%3E🪄%3C/text%3E%3C/svg%3E") 4 20, auto !important; }
        .magic-particle { position: fixed; pointer-events: none; z-index: 10000002; font-size: 14px; animation: magicFade 1.2s ease-out forwards; }
        @keyframes magicFade { 0% { transform: translate(0,0) scale(1); opacity: 0.8; } 100% { transform: translate(var(--mx), var(--my)) scale(0); opacity: 0; } }
    
    `;
    document.head.appendChild(style);

    // --- GLOBAL AUDIO MANAGER ---
    const gAudio = new Audio();
    gAudio.id = 'globalMusicBoxAudio';

    const MUSIC_PLAYLIST = [
        { name: "Always - Bon Jovi", file: "music/Bon Jovi - Always (Official Music Video).mp3", desc: "Lagu ini tentang cinta yang tetap bertahan meskipun hubungan sudah retak. Perasaan setia yang tidak berubah, walau kenyataannya sudah tidak bisa kembali seperti dulu." },
        { name: "Fast Rap - Yuno Miles", file: "music/Fast Rap _Yuno Miles\u201d Official video.mp3", desc: "Lagu ini biar ga kaku kaku banget ya naz :p" },
        { name: "Iris - Goo Goo Dolls", file: "music/Goo Goo Dolls \u2013 Iris [Official Music Video] [4K Remaster].mp3", desc: "Tentang keinginan untuk benar-benar dimengerti dan diterima apa adanya. Saat kita ingin seseorang melihat sisi terdalam kita, tanpa harus berpura-pura." },
        { name: "Backburner - NIKI", file: "music/NIKI -  Backburner (Official Lyric Video).mp3", desc: "Mengisahkan seseorang yang selalu dijadikan pilihan kedua. Meski sadar, tetap bertahan karena masih berharap suatu hari akan dipilih." },
        { name: "Champagne Supernova - Oasis", file: "music/Oasis - Champagne Supernova (Official Video).mp3", desc: "Lagu ini terasa seperti renungan panjang tentang hidup, mimpi, dan kehilangan. Tentang perjalanan yang penuh pertanyaan tanpa jawaban pasti." },
        { name: "Kau Rumahku - Raissa Anggiani", file: "music/Raissa Anggiani (Rai) - Kau Rumahku (Official Audio).mp3", desc: "Menggambarkan seseorang yang terasa seperti tempat pulang. Sosok yang memberi rasa nyaman, aman, dan selalu ingin kita kembali." },
        { name: "Back To December - Taylor Swift", file: "music/Taylor Swift - Back To December.mp3", desc: "Menceritakan penyesalan yang datang terlambat, saat seseorang sadar telah menyia-nyiakan orang yang tulus. Keinginan untuk kembali ke masa lalu, walau tahu itu tidak mungkin." },
        { name: "Love Story - Taylor Swift", file: "music/Taylor Swift - Love Story.mp3", desc: "Tentang dua orang yang tetap percaya pada cinta, meski banyak rintangan di depan mereka. Harapan bahwa pada akhirnya, cinta yang tulus akan menemukan jalannya." },
        { name: "Dan Bandung - The Panasdalam Bank", file: "music/The Panasdalam Bank - Dan Bandung (Feat. Danilla) (Official Lyric Video).mp3", desc: "Tentang jatuh cinta di tempat yang penuh kenangan. Kota yang bukan hanya tempat, tapi jadi bagian dari cerita perasaan itu sendiri." },
        { name: "Cool Enough For You", file: "music/cool enough for you.mp3", desc: "Menggambarkan perasaan tidak pernah cukup di mata seseorang yang kita suka. Sudah berusaha menjadi yang terbaik, tapi tetap merasa kurang." }
    ];

    let currentTrackIdx = -1;

    function syncGlobalAudio() {
        if (!gAudio.src) {
            const lastSrc = localStorage.getItem('mbCurrentSrc');
            const wasPlaying = localStorage.getItem('mbIsPlaying') === 'true';
            
            if (lastSrc) {
                const decodedSrc = decodeURIComponent(lastSrc);
                
                // Robust matching: decode URL and check if it matches the track file path
                currentTrackIdx = MUSIC_PLAYLIST.findIndex(t => {
                    const encodedFile = encodeURIComponent(t.file).replace(/%20/g, '+');
                    return decodedSrc.endsWith(t.file) || 
                           decodedSrc.includes(t.file) ||
                           lastSrc.includes(encodedFile) ||
                           lastSrc.toLowerCase().includes(t.file.toLowerCase());
                });

                if (currentTrackIdx !== -1) {
                    gAudio.src = MUSIC_PLAYLIST[currentTrackIdx].file;
                    const lastTime = parseFloat(localStorage.getItem('mbCurrentTime') || "0");
                    if (!isNaN(lastTime)) gAudio.currentTime = lastTime;
                    
                    if (wasPlaying) {
                        gAudio.play().catch(e => {
                            document.addEventListener('click', () => {
                                if (gAudio.paused) gAudio.play();
                            }, { once: true });
                        });
                    }
                }
            }
        }
    }

    setInterval(() => {
        if (gAudio.src && !gAudio.paused) {
            localStorage.setItem('mbCurrentSrc', gAudio.src);
            localStorage.setItem('mbCurrentTime', gAudio.currentTime);
            localStorage.setItem('mbIsPlaying', 'true');
        } else if (gAudio.paused) {
            localStorage.setItem('mbIsPlaying', 'false');
        }
    }, 1000);

    // Preload SFX
    const sfxPop = new Audio("https://assets.mixkit.co/active_storage/sfx/1432/1432-preview.mp3");
    const sfxMagic = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    
    const playSFXGlobal = (freqs, type = 'sine', vol = 0.2, duration = 0.1) => {
        try {
            if (window.playSFX) {
                window.playSFX(freqs, type, vol, duration);
                return;
            }
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freqs[0], ctx.currentTime);
            if (freqs.length > 1) {
                for (let i = 1; i < freqs.length; i++) {
                    osc.frequency.exponentialRampToValueAtTime(freqs[i], ctx.currentTime + (duration * i / (freqs.length - 1)));
                }
            }
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    };

    // DOM Creation
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
    helperNode.innerHTML = `<div class="helper-bubble">Klik aku!</div><span class="helper-avatar">🧚‍♀️</span>`;

    const spawnOverlay = document.createElement('div');
    spawnOverlay.id = 'spawnOverlay';

    const goldDisc = document.createElement('div');
    goldDisc.id = 'goldDisc';
    goldDisc.innerHTML = `<div class="eq-container"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`;

    // Music Box Overlay HTML
    const mbOverlay = document.createElement('div');
    mbOverlay.id = 'musicBoxOverlay';
    mbOverlay.className = 'music-box-overlay';
    mbOverlay.innerHTML = `
        <div class="music-player-card">
            <div class="player-header">
                <span class="player-title">🎶 CRYSTAL MUSIC BOX</span>
                <button class="player-close" id="mbCloseBtn">×</button>
            </div>
            <div class="player-body">
                <div class="player-left">
                    <div class="vinyl-container">
                        <div class="vinyl-disc" id="vinylDisc">
                            <div class="vinyl-grooves"></div>
                        </div>
                        <div class="vinyl-arm" id="vinylArm"></div>
                        <div class="vinyl-glow"></div>
                    </div>
                    <div class="song-title-display" id="songTitleDisplay">Pilih lagu untuk diputar...</div>
                    <div class="song-desc-display" id="songDescDisplay">Buka Music Box untuk menemukan lagu baru!</div>
                    <div class="player-progress-container">
                        <span class="time-display" id="currentTimeDisp">0:00</span>
                        <div class="progress-bar-track" id="progressBarTrack">
                            <div class="progress-bar-fill" id="progressBarFill">
                                <div class="progress-knob"></div>
                            </div>
                        </div>
                        <span class="time-display" id="totalDurationDisp">0:00</span>
                    </div>
                    <div class="player-controls">
                        <button class="ctrl-btn" id="mbPrevBtn">⏮</button>
                        <button class="ctrl-btn play-main" id="musicBoxPlayPause">▶</button>
                        <button class="ctrl-btn" id="mbNextBtn">⏭</button>
                    </div>
                </div>
                <div class="player-right">
                    <div class="tracklist-header">
                        <span>PLAYLIST</span>
                        <span class="tracklist-count" id="tracklistCount">0/10</span>
                    </div>
                    <div class="track-list" id="unlockedTrackList"></div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.appendChild(popup);
    document.body.appendChild(actor);
    document.body.appendChild(rune);
    document.body.appendChild(helperNode);
    document.body.appendChild(spawnOverlay);
    document.body.appendChild(goldDisc);
    document.body.appendChild(mbOverlay);


    const magicStyle = document.createElement('style');
    magicStyle.innerHTML = `
        /* --- GLOBAL MAGIC AMBIENCE --- */
        body.abrakadabra-active::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 9990;
            background: 
                radial-gradient(circle at 15% 15%, rgba(255, 0, 255, 0.4), transparent 45%),
                radial-gradient(circle at 85% 15%, rgba(0, 255, 255, 0.4), transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(255, 255, 0, 0.3), transparent 55%),
                linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(0, 255, 0, 0.2));
            mix-blend-mode: screen;
            animation: abrakadabraAuraFlow 1.5s linear infinite;
            filter: blur(4px);
            box-shadow: inset 0 0 80px 20px rgba(255, 0, 255, 0.5), inset 0 0 120px 30px rgba(0, 255, 255, 0.4);
        }

        /* Starry Sky Overlay */
        body.abrakadabra-active .magic-star-field {
            position: fixed;
            inset: 0;
            z-index: 9988;
            pointer-events: none;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2'%3E%3Ccircle cx='1' cy='1' r='1' fill='white' opacity='0.3'/%3E%3C/svg%3E");
            opacity: 0.4;
            animation: abrakadabraStars 15s linear infinite;
        }

        /* Magic Runes in Corners */
        .magic-rune {
            position: fixed;
            width: 300px;
            height: 300px;
            pointer-events: none;
            z-index: 9989;
            opacity: 0.08;
            filter: blur(1px);
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='white' stroke-width='0.5'/%3E%3Cpath d='M50 5 L50 95 M5 50 L95 50 M15 15 L85 85 M15 85 L85 15' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E") no-repeat center;
            animation: abrakadabraRuneRotate 20s linear infinite;
        }
        .magic-rune-tl { top: -100px; left: -100px; }
        .magic-rune-br { bottom: -100px; right: -100px; animation-direction: reverse; }

        /* --- ORIGINAL FLOAT REDESIGN --- */
        body.abrakadabra-active .shop-card,
        body.abrakadabra-active .item-card,
        body.abrakadabra-active .inventory-card,
        body.abrakadabra-active .shop-grid,
        body.abrakadabra-active .inventory-grid {
            overflow: visible !important;
        }

        .abrakadabra-original-float {
            position: relative;
            z-index: 9999;
            will-change: transform;
            animation: 
                abrakadabraOriginalFloat var(--duration) ease-in-out infinite alternate,
                discoColors 0.4s linear infinite;
            animation-delay: var(--delay);
        }

        @keyframes abrakadabraOriginalFloat {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(1);
            }
            30% {
                transform:
                translate(var(--x1), var(--y1))
                rotate(var(--rot1))
                scale(var(--scale));
            }
            65% {
                transform:
                translate(var(--x2), var(--y2))
                rotate(var(--rot2))
                scale(1);
            }
            100% {
                transform:
                translate(calc(var(--x1) * -0.7), calc(var(--y1) * 0.6))
                rotate(calc(var(--rot2) * -0.8))
                scale(1.2);
            }
        }

        .abrakadabra-wiggle {
            position: relative;
            z-index: 9998;
            animation: 
                abrakadabraWiggle var(--wiggle-duration, 0.8s) ease-in-out infinite,
                discoColors 0.5s linear infinite;
        }

        .abrakadabra-card-wiggle {
            animation: 
                abrakadabraCardWiggle var(--wiggle-duration, 0.6s) ease-in-out infinite,
                discoColors 0.7s linear infinite;
            filter: drop-shadow(0 0 10px rgba(255, 0, 255, 0.5));
        }

        @keyframes abrakadabraCardWiggle {
            0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
            20% { transform: translate(15px, -10px) rotate(10deg) scale(1.1); }
            40% { transform: translate(-15px, 15px) rotate(-10deg) scale(0.9); }
            60% { transform: translate(12px, -15px) rotate(8deg) scale(1.15); }
            80% { transform: translate(-12px, 12px) rotate(-8deg) scale(0.85); }
        }

        @keyframes abrakadabraWiggle {
            0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
            15% { transform: translate(12px, -10px) rotate(15deg) scale(1.15); }
            30% { transform: translate(-12px, 12px) rotate(-15deg) scale(0.85); }
            45% { transform: translate(10px, 15px) rotate(20deg) scale(1.2); }
            60% { transform: translate(-15px, -12px) rotate(-10deg) scale(0.8); }
            75% { transform: translate(15px, -8px) rotate(25deg) scale(1.1); }
            90% { transform: translate(-10px, 10px) rotate(-20deg) scale(0.9); }
        }

        @keyframes discoColors {
            0% { filter: drop-shadow(0 0 15px #ff00ff) hue-rotate(0deg) brightness(1.2); }
            20% { filter: drop-shadow(0 0 25px #00ffff) hue-rotate(72deg) brightness(1.5); }
            40% { filter: drop-shadow(0 0 15px #00ff00) hue-rotate(144deg) brightness(1.2); }
            60% { filter: drop-shadow(0 0 25px #ffff00) hue-rotate(216deg) brightness(1.5); }
            80% { filter: drop-shadow(0 0 15px #ff0000) hue-rotate(288deg) brightness(1.2); }
            100% { filter: drop-shadow(0 0 25px #ff00ff) hue-rotate(360deg) brightness(1.5); }
        }

        /* Casting Burst Effect */
        .magic-casting-burst {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: #fff;
            border-radius: 50%;
            z-index: 1000000;
            pointer-events: none;
            box-shadow: 0 0 50px 20px #fff, 0 0 100px 40px rgba(255, 215, 120, 0.6);
            animation: abrakadabraBurst 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }

        @keyframes abrakadabraBurst {
            0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(150); opacity: 0; }
        }

        /* --- ANIMATIONS --- */
        @keyframes abrakadabraAuraFlow {
            0% { opacity: 0.7; filter: hue-rotate(0deg) blur(2px); }
            25% { opacity: 0.95; filter: hue-rotate(90deg) blur(4px); }
            50% { opacity: 0.7; filter: hue-rotate(180deg) blur(2px); }
            75% { opacity: 0.95; filter: hue-rotate(270deg) blur(4px); }
            100% { opacity: 0.7; filter: hue-rotate(360deg) blur(2px); }
        }
        @keyframes abrakadabraStars {
            from { background-position: 0 0; }
            to { background-position: 100px 100px; }
        }
        @keyframes abrakadabraRuneRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .abrakadabra-particle {
            position: fixed;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9991;
            background: radial-gradient(circle, #fff 20%, rgba(255,215,120,0.8) 50%, transparent 100%);
            box-shadow: 0 0 10px #fff;
            opacity: 0.8;
            animation: abrakadabraParticleFloat var(--p-dur) linear infinite;
        }
        @keyframes abrakadabraParticleFloat {
            from { transform: translateY(100vh) rotate(0deg) scale(1); opacity: 0.8; }
            to { transform: translateY(-100px) rotate(360deg) scale(0.5); opacity: 0; }
        }
    `;
    document.head.appendChild(magicStyle);

    let floatLayer = null;
    let particleInterval = null;

    function startSubtleParticles() {
        if (particleInterval) clearInterval(particleInterval);
        particleInterval = setInterval(() => {
            if (!document.body.classList.contains('abrakadabra-active')) {
                clearInterval(particleInterval);
                return;
            }
            if (document.querySelectorAll('.abrakadabra-particle').length > 25) return;

            const p = document.createElement('div');
            p.className = 'abrakadabra-particle';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = Math.random() * 100 + 'vh';
            const size = Math.random() * 4 + 2;
            p.style.width = size + 'px';
            
            const dur = (Math.random() * 4 + 3).toFixed(1);
            p.style.setProperty('--p-dur', `${dur}s`);
            
            document.body.appendChild(p);
            setTimeout(() => p.remove(), dur * 1000);
        }, 300);
    }

    function startIconFloating() {
        if (floatLayer) return;
        
        document.body.classList.add('abrakadabra-active');
        
        // Add Star Field
        const stars = document.createElement('div');
        stars.className = 'magic-star-field';
        document.body.appendChild(stars);

        // Add Runes
        const r1 = document.createElement('div'); r1.className = 'magic-rune magic-rune-tl'; document.body.appendChild(r1);
        const r2 = document.createElement('div'); r2.className = 'magic-rune magic-rune-br'; document.body.appendChild(r2);

        // Add Casting Burst
        const burst = document.createElement('div');
        burst.className = 'magic-casting-burst';
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 1200);

        // Selection of eligible visual elements - CORRECTED SELECTORS
        const eligibleSelectors = [
            '.item-card .item-emoji',
            '.inv-item .inv-emoji',
            '.shop-item .item-icon',
            '.inventory-item .item-icon',
            '.decorative-icon',
            '.floating-accessory',
            '.title-decoration',
            '.side-decoration',
            '.shop-title-cart-left',
            '.shop-title-cart-right',
            '.final-reward-emoji',
            '.flower-neon',
            '.page-title .icon',
            '.slot-symbol',
            '.letter-folder-icon',
            '.history-icon',
            '.arcade-icon',
            '.coin-icon',
            '.coin-display',
            '.scroll-down-neon',
            '.shop-title-icon',
            '.shop-cart-icon',
            '.cake',
            '.hearts',
            '.retro-badge',
            '.bear-guard-sprite',
            '.dilan-label',
            '.game-logo',
            '.mascot-emoji',
            '.pixel-heart',
            '.music-btn',
            '#robotAvatar',
            '#dealerBubble',
            '.st',
            '.reel-sym',
            '.neon-date',
            '.neon-subtitle',
            '.diamond',
            '.fact-emoji',
            '.bg-star',
            '.back-btn',
            '.envelope-wrapper',
            '.collection-title',
            '#progressEmoji',
            '.mini-collection-note',
            '.crystal-ball-wrap',
            '.machine-title-neon',
            '.nav-welcome-text',
            '.gacha-glass',
            '.gacha-balls',
            '.react-btn'
        ];

        let allEligible = [];
        eligibleSelectors.forEach(sel => {
            const nodes = document.querySelectorAll(sel);
            nodes.forEach(n => allEligible.push(n));
        });

        // 95-100% for floating originals (extreme chaos)
        const floatCount = Math.min(Math.floor(allEligible.length * 0.95) + 10, 80);
        const shuffled = [...allEligible].sort(() => 0.5 - Math.random());
        const forFloating = shuffled.slice(0, floatCount);
        
        // 25% for static wiggle (remaining)
        const wiggleCount = Math.floor(allEligible.length * 0.25);
        const forWiggle = shuffled.slice(floatCount, floatCount + wiggleCount);

        // Card wiggle selectors
        const cardSelectors = ['.shop-card', '.item-card', '.inventory-card', '.shelf-item', '.dev-letter-ui', '.scroll-down-container', '.mouse-icon', '.scroll-down-neon', '.card', '.cabinet', '.fact-card', '.letter-paper', '.letter-paper-final', '.fortune-cabinet', '.gacha-container'];
        let allCards = [];
        cardSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(n => allCards.push(n));
        });

        // Apply card wiggle
        allCards.forEach(el => {
            el.classList.add('abrakadabra-card-wiggle');
            const wiggleDuration = (Math.random() * 0.5 + 0.4).toFixed(2); // 0.4s to 0.9s
            el.style.setProperty('--wiggle-duration', `${wiggleDuration}s`);
        });

        // Apply floating to originals
        forFloating.forEach(el => {
            el.classList.add('abrakadabra-original-float');
            
            // Random parameters (Increased Chaos)
            const x1 = (Math.random() * 500 - 250).toFixed(1); 
            const y1 = (Math.random() * 400 - 200).toFixed(1); 
            const x2 = (Math.random() * 700 - 350).toFixed(1); 
            const y2 = (Math.random() * 600 - 300).toFixed(1); 
            const rot1 = (Math.random() * 360 - 180).toFixed(1); 
            const rot2 = (Math.random() * 720 - 360).toFixed(1); 
            const scale = (Math.random() * 3.0 + 0.5).toFixed(2); // 0.5 to 3.5 (beberapa membesar ekstrem)
            const duration = (Math.random() * 10 + 1.5).toFixed(1); // Fast to Slow: 1.5s to 11.5s
            const delay = (Math.random() * 0.5).toFixed(1); 

            el.style.setProperty('--x1', `${x1}px`);
            el.style.setProperty('--y1', `${y1}px`);
            el.style.setProperty('--x2', `${x2}px`);
            el.style.setProperty('--y2', `${y2}px`);
            el.style.setProperty('--rot1', `${rot1}deg`);
            el.style.setProperty('--rot2', `${rot2}deg`);
            el.style.setProperty('--scale', scale);
            el.style.setProperty('--duration', `${duration}s`);
            el.style.setProperty('--delay', `${delay}s`);
        });

        // Apply wiggle
        forWiggle.forEach(el => {
            el.classList.add('abrakadabra-wiggle');
            const wiggleDuration = (Math.random() * 1 + 1.2).toFixed(1); // 1.2s to 2.2s
            el.style.setProperty('--wiggle-duration', `${wiggleDuration}s`);
        });

        // Start particles
        startSubtleParticles();
    }

    function stopIconFloating() {
        document.body.classList.remove('abrakadabra-active');
        
        // Remove Overlays
        document.querySelectorAll('.magic-star-field, .magic-rune, .magic-casting-burst').forEach(el => el.remove());

        // Remove floating class and vars
        document.querySelectorAll('.abrakadabra-original-float').forEach(el => {
            el.classList.remove('abrakadabra-original-float');
            el.style.removeProperty('--x1');
            el.style.removeProperty('--y1');
            el.style.removeProperty('--x2');
            el.style.removeProperty('--y2');
            el.style.removeProperty('--rot1');
            el.style.removeProperty('--rot2');
            el.style.removeProperty('--scale');
            el.style.removeProperty('--duration');
            el.style.removeProperty('--delay');
        });

        // Remove wiggle class and vars
        document.querySelectorAll('.abrakadabra-wiggle').forEach(el => {
            el.classList.remove('abrakadabra-wiggle');
            el.style.removeProperty('--wiggle-duration');
        });

        // Remove card wiggle
        document.querySelectorAll('.abrakadabra-card-wiggle').forEach(el => {
            el.classList.remove('abrakadabra-card-wiggle');
            el.style.removeProperty('--wiggle-duration');
        });

        document.querySelectorAll('.abrakadabra-particle').forEach(p => p.remove());
        if (particleInterval) clearInterval(particleInterval);
    }

    window.triggerChaoticMagic = function(active) {
        if (active) {
            startIconFloating();
        } else {
            stopIconFloating();
        }
    };

    // --- MUSIC BOX FUNCTIONS ---
    window.openMusicPlayer = function() {
        const overlayEl = document.getElementById('musicBoxOverlay');
        if (overlayEl) overlayEl.style.display = 'flex';
        
        // Re-sync index if it's lost but audio is playing
        if (gAudio.src && currentTrackIdx === -1) {
            const decodedSrc = decodeURIComponent(gAudio.src);
            currentTrackIdx = MUSIC_PLAYLIST.findIndex(t => 
                decodedSrc.endsWith(t.file) || 
                decodedSrc.includes(t.file)
            );
        }

        if (currentTrackIdx !== -1) {
            const track = MUSIC_PLAYLIST[currentTrackIdx];
            document.getElementById('songTitleDisplay').textContent = track.name;
            document.getElementById('songDescDisplay').textContent = track.desc || '';
            
            if (!gAudio.paused) {
                document.getElementById('vinylDisc').classList.add('playing');
                document.getElementById('vinylArm').classList.add('playing');
                document.getElementById('musicBoxPlayPause').textContent = '\u23F8'; // Pause icon
            } else {
                document.getElementById('vinylDisc').classList.remove('playing');
                document.getElementById('vinylArm').classList.remove('playing');
                document.getElementById('musicBoxPlayPause').textContent = '\u25B6'; // Play icon
            }
            if (gAudio.duration) document.getElementById('totalDurationDisp').textContent = formatTime(gAudio.duration);
        }

        const bgm = document.getElementById('bgm');
        if (bgm && !bgm.paused) {
            bgm.pause();
            if (overlayEl) overlayEl.dataset.bgmWasPlaying = 'true';
        }
        updateTrackList();
        playSFXGlobal([440, 880]);
    };

    window.closeMusicPlayer = function() {
        const overlayEl = document.getElementById('musicBoxOverlay');
        if (overlayEl) overlayEl.style.display = 'none';
        const unlocked = JSON.parse(localStorage.getItem('unlockedSongs') || '[]');
        const hasGoldDisc = localStorage.getItem('goldDiscUnlocked') === 'true' || unlocked.length >= 10;
        if (!hasGoldDisc) {
            gAudio.pause();
            document.getElementById('musicBoxPlayPause').textContent = '\u25B6';
            document.getElementById('vinylDisc').classList.remove('playing');
            document.getElementById('vinylArm').classList.remove('playing');
            const bgm = document.getElementById('bgm');
            if (overlayEl && overlayEl.dataset.bgmWasPlaying === 'true' && bgm) bgm.play();
        }
        if (overlayEl) overlayEl.dataset.bgmWasPlaying = '';
        playSFXGlobal([400, 300]);
    };

    function formatTime(s) {
        if (isNaN(s)) return "0:00";
        const m = Math.floor(s / 60), sc = Math.floor(s % 60);
        return `${m}:${sc < 10 ? '0' : ''}${sc}`;
    }

    window.toggleMusicBox = function() {
        if (currentTrackIdx === -1) {
            const unlocked = JSON.parse(localStorage.getItem('unlockedSongs') || '[]');
            if (unlocked.length > 0) playTrack(unlocked[0]);
            return;
        }
        if (gAudio.paused) {
            gAudio.play();
            document.getElementById('musicBoxPlayPause').textContent = '\u23F8';
            document.getElementById('vinylDisc').classList.add('playing');
            document.getElementById('vinylArm').classList.add('playing');
        } else {
            gAudio.pause();
            document.getElementById('musicBoxPlayPause').textContent = '\u25B6';
            document.getElementById('vinylDisc').classList.remove('playing');
            document.getElementById('vinylArm').classList.remove('playing');
        }
        playSFXGlobal([523]);
    };

    window.playTrack = function(idx) {
        currentTrackIdx = idx;
        const track = MUSIC_PLAYLIST[idx];
        gAudio.src = track.file;
        gAudio.play();
        document.getElementById('songTitleDisplay').textContent = track.name;
        document.getElementById('songDescDisplay').textContent = track.desc || '';
        document.getElementById('musicBoxPlayPause').textContent = '\u23F8';
        document.getElementById('vinylDisc').classList.add('playing');
        document.getElementById('vinylArm').classList.add('playing');
        updateTrackList();
        playSFXGlobal([523, 659]);
    };

    window.nextTrack = function() {
        const unlocked = JSON.parse(localStorage.getItem('unlockedSongs') || '[]');
        if (unlocked.length === 0) return;
        let nextIdx = unlocked.indexOf(currentTrackIdx) + 1;
        if (nextIdx >= unlocked.length) nextIdx = 0;
        playTrack(unlocked[nextIdx]);
    };

    window.prevTrack = function() {
        const unlocked = JSON.parse(localStorage.getItem('unlockedSongs') || '[]');
        if (unlocked.length === 0) return;
        let prevIdx = unlocked.indexOf(currentTrackIdx) - 1;
        if (prevIdx < 0) prevIdx = unlocked.length - 1;
        playTrack(unlocked[prevIdx]);
    };

    function updateTrackList() {
        const unlocked = JSON.parse(localStorage.getItem('unlockedSongs') || '[]');
        const list = document.getElementById('unlockedTrackList');
        if (!list) return;
        list.innerHTML = '';
        MUSIC_PLAYLIST.forEach((track, idx) => {
            const isUnlocked = unlocked.includes(idx);
            const item = document.createElement('div');
            item.className = 'track-item' + (currentTrackIdx === idx ? ' active' : '') + (!isUnlocked ? ' locked' : '');
            if (isUnlocked) {
                item.innerHTML = `<span class="track-num">${String(idx + 1).padStart(2, '0')}</span><span>${track.name}</span>`;
                item.onclick = () => playTrack(idx);
            } else {
                item.innerHTML = `<span class="track-num">${String(idx + 1).padStart(2, '0')}</span><span class="track-lock">🔒 ? ? ?</span>`;
            }
            list.appendChild(item);
        });
        document.getElementById('tracklistCount').textContent = `${unlocked.length}/10`;
    }

    gAudio.ontimeupdate = () => {
        const fill = document.getElementById('progressBarFill');
        const currDisp = document.getElementById('currentTimeDisp');
        if (fill && gAudio.duration) {
            fill.style.width = (gAudio.currentTime / gAudio.duration * 100) + '%';
            currDisp.textContent = formatTime(gAudio.currentTime);
        }
    };

    gAudio.onloadedmetadata = () => {
        const totDisp = document.getElementById('totalDurationDisp');
        if (totDisp) totDisp.textContent = formatTime(gAudio.duration);
    };

    // --- EVENT BINDINGS ---
    document.getElementById('mbCloseBtn').onclick = window.closeMusicPlayer;
    document.getElementById('musicBoxPlayPause').onclick = window.toggleMusicBox;
    document.getElementById('mbNextBtn').onclick = window.nextTrack;
    document.getElementById('mbPrevBtn').onclick = window.prevTrack;
    
    const progTrack = document.getElementById('progressBarTrack');
    progTrack.onclick = (e) => {
        const rect = progTrack.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (gAudio.duration) gAudio.currentTime = pos * gAudio.duration;
    };

    document.getElementById('fairyMagicBtn').addEventListener('click', startMagicRoutine);
    
    helperNode.addEventListener('click', () => {
        const rect = helperNode.getBoundingClientRect();
        createSparkle(rect.left + 20, rect.top + 20);
        for(let i=0; i<15; i++) setTimeout(() => createSparkle(rect.left + Math.random()*40, rect.top + Math.random()*40), i*20);
        helperNode.style.display = 'none';
        triggerFairyRescue();
    });

    gAudio.onended = () => window.nextTrack();

    goldDisc.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX - 100 + 'px';
        ripple.style.top = e.clientY - 100 + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
        window.openMusicPlayer();
    });


    function updateGlobalUI() {
        if (!isIntroPage && !isOnboardingPage) {
            const currentCoins = parseInt(localStorage.getItem('slotCoins') || '0');
            const introDone = localStorage.getItem('introDone') === 'true';
            if (currentCoins <= 0 && introDone && phase === 'normal') {
                helperNode.style.display = 'flex';
            } else {
                helperNode.style.display = 'none';
            }

            // Gold Disc Logic
            const unlockedSongs = JSON.parse(localStorage.getItem('unlockedSongs') || '[]');
            const goldDiscUnlocked = localStorage.getItem('goldDiscUnlocked') === 'true';
            const shouldUnlock = unlockedSongs.length >= totalSongsRequired;

            if (shouldUnlock && !goldDiscUnlocked) {
                localStorage.setItem('goldDiscUnlocked', 'true');
                localStorage.setItem('goldenRecordUnlocked', 'true');
            }

            const isNowUnlocked = goldDiscUnlocked || shouldUnlock;
            if (isNowUnlocked) {
                if (localStorage.getItem('goldDiscSpawned') !== 'true') {
                    triggerGoldDiscSpawn();
                } else {
                    goldDisc.style.display = 'flex';
                }
                
                const isPlaying = !gAudio.paused && gAudio.src;
                if (isPlaying) {
                    goldDisc.classList.add('playing');
                    const bgm = document.getElementById('bgm');
                    if (bgm && !bgm.paused) bgm.pause();
                } else {
                    goldDisc.classList.remove('playing');
                }
            } else {
                goldDisc.style.display = 'none';
            }
        } else {
            goldDisc.style.display = 'none';
            helperNode.style.display = 'none';
        }

        if (!gAudio.src) syncGlobalAudio();
    }

    setInterval(updateGlobalUI, 1000);
    updateGlobalUI();

    // Fairy Rescue Logic
    function triggerFairyRescue() {
        phase = 'freeze';
        const children = document.body.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i] !== overlay && children[i] !== actor && children[i] !== rune && children[i].tagName !== 'STYLE' && children[i].tagName !== 'SCRIPT') {
                children[i].classList.add('grayscale-freeze');
            }
        }
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 100);
        try { sfxPop.play(); } catch(e){}
        setTimeout(() => { phase = 'popup'; popup.classList.add('show'); }, 800);
    }

    function createSparkle(x, y) {
        const dot = document.createElement('div');
        dot.className = 'sparkle-dot';
        dot.style.left = x + 'px'; dot.style.top = y + 'px';
        const colors = ['#ffb7fb', '#00ffff', '#ffd700', '#fff'];
        dot.style.background = colors[Math.floor(Math.random() * colors.length)];
        dot.style.boxShadow = `0 0 8px ${dot.style.background}`;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 800);
    }

    function startMagicRoutine() {
        phase = 'flight';
        popup.classList.remove('show');
        setTimeout(() => { overlay.classList.remove('active'); overlay.style.display = 'none'; }, 400);
        actor.style.opacity = '1';
        let coinTarget = document.getElementById('coinDisplay') || document.getElementById('navCoinDisplay') || document.querySelector('.nav-right');
        let targetX = window.innerWidth - 80, targetY = 40;
        if (coinTarget) {
            const rect = coinTarget.getBoundingClientRect();
            targetX = rect.left + rect.width / 2; targetY = rect.top + rect.height / 2;
        }
        const startX = window.innerWidth / 2, startY = window.innerHeight / 2;
        let pct = 0;
        try { sfxMagic.play(); } catch(e){}
        const flightInterval = setInterval(() => {
            pct += 0.05;
            if (pct >= 1) {
                clearInterval(flightInterval);
                actor.style.left = targetX + 'px'; actor.style.top = targetY + 'px';
                startCasting(targetX, targetY);
            } else {
                const currentX = startX + (targetX - startX) * pct + Math.sin(pct * Math.PI) * 100;
                const currentY = startY + (targetY - startY) * pct - Math.sin(pct * Math.PI) * 150;
                actor.style.left = currentX + 'px'; actor.style.top = currentY + 'px';
                createSparkle(currentX, currentY);
            }
        }, 30);
    }

    function startCasting(targetX, targetY) {
        phase = 'casting';
        rune.style.left = targetX + 'px'; rune.style.top = targetY + 'px';
        rune.classList.add('spinning');
        const spellText = document.createElement('div');
        spellText.style.cssText = `position: fixed; left: ${targetX - 50}px; top: ${targetY + 40}px; color: #ffd700; font-family: 'VT323', monospace; font-size: 24px; text-shadow: 0 0 10px #ffd700; z-index: 10000002; animation: fairyPulse 0.5s infinite alternate; pointer-events: none;`;
        spellText.textContent = "Bim salabim... koin, muncul!";
        document.body.appendChild(spellText);
        setTimeout(() => {
            phase = 'refill'; spellText.remove(); rune.classList.remove('spinning');
            let coinTarget = document.getElementById('coinDisplay') || document.getElementById('navCoinDisplay');
            let startVal = 0, endVal = 100;
            const countTimer = setInterval(() => {
                startVal += Math.floor(Math.random() * 15) + 10;
                if (startVal >= endVal) { startVal = endVal; clearInterval(countTimer); finalizeRescue(); }
                if (coinTarget) coinTarget.textContent = startVal;
            }, 50);
            for(let i=0; i<30; i++) setTimeout(() => {
                const angle = Math.random() * Math.PI * 2, dist = Math.random() * 80 + 20;
                createSparkle(targetX + Math.cos(angle) * dist, targetY + Math.sin(angle) * dist);
            }, i * 20);
        }, 1500);
    }

    function finalizeRescue() {
        phase = 'unfreeze';
        localStorage.setItem('slotCoins', 50);
        document.querySelectorAll('.grayscale-freeze').forEach(el => el.classList.remove('grayscale-freeze'));
        const goodbye = document.createElement('div');
        goodbye.style.cssText = `position: fixed; left: 50%; top: 40%; transform: translate(-50%, -50%); color: #ffb7fb; font-family: 'VT323', monospace; font-size: 32px; text-shadow: 0 0 10px #ffb7fb; z-index: 10000002; background: rgba(16, 5, 29, 0.8); border: 1px solid rgba(255,183,251,0.5); padding: 10px 20px; border-radius: 10px; pointer-events: none;`;
        goodbye.textContent = "Sudah kuisi kembali. Gunakan dengan bijak ya! 😉";
        document.body.appendChild(goodbye);
        actor.style.transform = 'translate(-50%, -50%) scale(1.5) rotate(360deg)'; actor.style.transition = 'all 1s ease-out';
        setTimeout(() => {
            goodbye.remove(); actor.style.opacity = '0';
            setTimeout(() => { actor.style.left = '50%'; actor.style.top = '50%'; actor.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)'; phase = 'normal'; }, 1000);
        }, 2000);
    }

    // --- GLOBAL REWARD POPUP (USER DESIGN) ---
    function initGlobalRewardPopup() {
        if (document.getElementById('goldenRecordRewardPopup')) return;
        const html = `
            <div class="reward-popup-overlay" id="goldenRecordRewardPopup">
                <div class="reward-popup-content">
                    <div class="reward-popup-glow"></div>
                    <div class="reward-popup-title">Semua Lagu Terbuka</div>
                    <div class="reward-popup-body">
                        Selamat, Naz.<br><br>
                        Semua lagu berhasil kamu buka.<br><br>
                        Sebagai hadiah, kamu mendapatkan:
                    </div>
                    <div class="reward-popup-item">
                        <div class="reward-popup-disc">📀</div>
                        <div style="color:#ffd700; font-family:'Press Start 2P'; font-size:10px;">PIRINGAN EMAS</div>
                    </div>
                    <div class="reward-popup-body" style="font-size: 18px; color: #aaa;">
                        Sekarang kamu bisa mengakses Music Box kapan saja lewat tombol melayang di pojok kanan bawah.
                    </div>
                    <button class="reward-popup-btn" onclick="closeGoldenRecordPopup()">KEREN! ✨</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    window.openGoldenRecordPopup = function() {
        initGlobalRewardPopup();
        const popup = document.getElementById('goldenRecordRewardPopup');
        if (popup) {
            popup.style.display = 'flex';
            setTimeout(() => popup.classList.add('active'), 50);
            if (window.playSFX) playSFX([523, 659, 783, 1046], 'sine', 0.5, 0.2);
            if (typeof triggerFireworks === 'function') triggerFireworks();
        }
    };

    window.closeGoldenRecordPopup = function() {
        const popup = document.getElementById('goldenRecordRewardPopup');
        if (popup) popup.classList.remove('active');
        setTimeout(() => {
            if (popup) popup.style.display = 'none';
            if (window.showFlirt) {
                showFlirt("Piringan Emas sekarang milikmu! Cek pojok kanan bawah. ✨📀");
            }
            if (typeof updateOwnershipUI === 'function') updateOwnershipUI();
        }, 500);
        if (window.playSFX) playSFX([400, 300], 'sine', 0.2, 0.1);
    };

    function triggerGoldDiscSpawn() {
        if (localStorage.getItem('goldDiscSpawned') === 'true') return;
        localStorage.setItem('goldDiscSpawned', 'true');
        
        spawnOverlay.style.display = 'block';
        setTimeout(() => spawnOverlay.style.opacity = '1', 50);

        // Trigger the global version of the user's design
        window.openGoldenRecordPopup();

        goldDisc.style.display = 'flex'; goldDisc.style.bottom = '50%'; goldDisc.style.right = '50%'; goldDisc.style.transform = 'translate(50%, 50%) scale(0)'; goldDisc.style.transition = 'none';
        setTimeout(() => {
            goldDisc.style.transition = 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            goldDisc.style.transform = 'translate(50%, 50%) scale(1.5) rotate(360deg)';
            if (window.playSFX) window.playSFX([261, 329, 392, 523, 1046], 'sine', 1.2, 0.15);
            
            setTimeout(() => {
                goldDisc.style.transition = 'all 1.2s cubic-bezier(0.76, 0, 0.24, 1)';
                goldDisc.style.bottom = '24px'; goldDisc.style.right = '24px';
                goldDisc.style.transform = 'translate(0, 0) scale(1) rotate(720deg)';
                spawnOverlay.style.opacity = '0';
                setTimeout(() => { 
                    spawnOverlay.style.display = 'none'; 
                    setTimeout(() => goldDisc.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 100); 
                }, 1000);
            }, 3000);
        }, 100);
    }
    window.globalMusicBoxAudio = gAudio;

    // Titah Ratu logic has been moved to titah_system.js for better isolation and protection.
    window.refreshMagicUI = function() {
        if (typeof window.refreshTitahSystem === 'function') {
            window.refreshTitahSystem();
        }
    };


    // --- BIRTHDAY CHARACTER WRAPPING ---
    if (path.includes('birthday.html')) {
        window.addEventListener('DOMContentLoaded', () => {
            const wrapText = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return;

                const wrapNodes = (element, isStrikethrough) => {
                    const childNodes = Array.from(element.childNodes);
                    element.innerHTML = '';
                    childNodes.forEach(node => {
                        if (node.nodeType === 3) { // Text node
                            const text = node.textContent;
                            let wordBuffer = [];

                            const flushWord = () => {
                                if (wordBuffer.length === 0) return;
                                const wordWrap = document.createElement('span');
                                wordWrap.style.cssText = 'display:inline-block; white-space:nowrap;';
                                wordBuffer.forEach(ch => {
                                    const span = document.createElement('span');
                                    span.textContent = ch;
                                    span.className = 'letter-char';
                                    span.style.display = 'inline-block';
                                    if (isStrikethrough) {
                                        span.style.textDecoration = 'line-through';
                                        span.style.textDecorationColor = '#e94560';
                                    }
                                    wordWrap.appendChild(span);
                                });
                                element.appendChild(wordWrap);
                                wordBuffer = [];
                            };

                            for (let char of text) {
                                if (char === ' ' || char === '\n' || char === '\r' || char === '\t') {
                                    flushWord();
                                    element.appendChild(document.createTextNode(char));
                                } else {
                                    wordBuffer.push(char);
                                }
                            }
                            flushWord();
                        } else { // Element node (br, span, etc.)
                            const isChildStrike = node.classList && node.classList.contains('strikethrough');
                            wrapNodes(node, isStrikethrough || isChildStrike);
                            element.appendChild(node);
                        }
                    });
                };

                wrapNodes(el);
            };
            wrapText('.title');
            wrapText('.message');
            wrapText('.health-wish');
        });
    }

    function checkMagic() {
        if (typeof window.refreshMagicUI === 'function') window.refreshMagicUI();

        const endTime = parseInt(localStorage.getItem('abrakadabraEndTime')) || 0;
        const isActive = Date.now() < endTime;

        if (isActive) {
            if (!document.body.classList.contains('abrakadabra-active')) {
                if (typeof triggerChaoticMagic === 'function') triggerChaoticMagic(true);
            }
            requestAnimationFrame(checkMagic);
        } else {
            if (document.body.classList.contains('abrakadabra-active')) {
                if (typeof triggerChaoticMagic === 'function') triggerChaoticMagic(false);
            }
            setTimeout(checkMagic, 800);
        }
    }
    window.checkMagic = checkMagic;

    // --- LUCKY TIMER GLOBAL UI ---
    const luckyTimerStyle = document.createElement('style');
    luckyTimerStyle.innerHTML = `
        #globalLuckyTimer {
            position: fixed; top: 65px; right: 25px;
            background: rgba(15, 30, 20, 0.75);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(46, 204, 113, 0.5);
            border-radius: 12px; padding: 8px 16px;
            color: #2ecc71; font-family: 'Press Start 2P', monospace; font-size: 11px;
            z-index: 9999999; display: flex; align-items: center; gap: 8px;
            cursor: pointer; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(46, 204, 113, 0.1);
            text-shadow: 0 0 8px rgba(46, 204, 113, 0.6);
        }
        #globalLuckyTimer:hover {
            transform: scale(1.05) translateY(-2px);
            border-color: rgba(46, 204, 113, 0.9);
            box-shadow: 0 6px 20px rgba(0,0,0,0.6), inset 0 0 15px rgba(46, 204, 113, 0.3), 0 0 20px rgba(46, 204, 113, 0.4);
            background: rgba(20, 40, 25, 0.85);
        }
        #globalLuckyTimer.active { opacity: 1; animation: luckyPulseGlobal 2.5s infinite alternate; }
        @keyframes luckyPulseGlobal { 
            0% { box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(46,204,113,0.1); } 
            100% { box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 20px rgba(46,204,113,0.3), 0 0 15px rgba(46,204,113,0.3); } 
        }
    `;
    document.head.appendChild(luckyTimerStyle);

    const luckyTimerUI = document.createElement('div');
    luckyTimerUI.id = 'globalLuckyTimer';
    luckyTimerUI.title = "Fever Time Aktif! Diskon Shop 50% & Slot Gratis";
    luckyTimerUI.innerHTML = `<span style="font-size: 16px; filter: drop-shadow(0 0 5px rgba(46,204,113,0.8));">🍀</span> <span id="luckyCountdownTxt">00:00</span>`;
    document.body.appendChild(luckyTimerUI);

    function checkLuckyTimer() {
        const isLucky = localStorage.getItem('isLuckyActive') === 'true';
        const expiry = parseInt(localStorage.getItem('luckyExpiry') || '0');
        const now = Date.now();

        if (isLucky && now < expiry) {
            luckyTimerUI.classList.add('active');
            const diff = Math.floor((expiry - now) / 1000);
            const m = Math.floor(diff / 60);
            const s = diff % 60;
            document.getElementById('luckyCountdownTxt').textContent = 'HOKI: ' + m + ':' + s.toString().padStart(2, '0');
        } else {
            luckyTimerUI.classList.remove('active');
            if (isLucky && now >= expiry) {
                localStorage.setItem('isLuckyActive', 'false');
                if(typeof renderShop === 'function') renderShop(); // auto update price
                if(typeof updateUI === 'function' && window.location.pathname.includes('slot')) updateUI();
            }
        }
        setTimeout(checkLuckyTimer, 1000);
    }
    checkLuckyTimer();

    
    // AMBIENT CLOVERS AND LUCKY UI ENHANCER
    function spawnAmbientClovers() {
        const isLucky = localStorage.getItem('isLuckyActive') === 'true';
        const expiry = parseInt(localStorage.getItem('luckyExpiry') || '0');
        const now = Date.now();
        
        if (isLucky && now < expiry) {
            // Accelerate BGM if exists
            const bgm = document.getElementById('bgm');
            if (bgm && bgm.playbackRate !== 1.3) bgm.playbackRate = 1.3;

            // Spawn floating clover (Tingkatkan spawn rate jadi 80% tiap kali loop jalan)
            if (Math.random() < 0.8) {
                const ambientEmojis = ['🍀', '💰', '💎', '💵', '🪙', '✨'];
                const cl = document.createElement('div');
                cl.textContent = ambientEmojis[Math.floor(Math.random() * ambientEmojis.length)];
                cl.style.cssText = `
                    position: fixed; pointer-events: none; z-index: 99999;
                    font-size: ${15 + Math.random() * 20}px;
                    left: ${Math.random() * 100}vw; bottom: -50px;
                    opacity: 0.6; filter: drop-shadow(0 0 5px rgba(46,204,113,0.5));
                    animation: floatCloverUp ${4 + Math.random() * 4}s linear forwards;
                `;
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
    cloverStyle.innerHTML = `
        @keyframes floatCloverUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(cloverStyle);

    setInterval(spawnAmbientClovers, 200);

    // Start monitoring
    checkMagic();

    // --- GLOBAL MAGIC WAND EFFECTS (SPARKLE & CLICK BURST) ---
    (function initGlobalMagicEffects() {
        const checkEffects = () => {
            const isMagic = localStorage.getItem('isMagicActive') === 'true';
            const isQueen = localStorage.getItem('isQueenActive') === 'true';
            
            if (isMagic) {
                document.documentElement.classList.add('magic-cursor-mode');
            } else if (!isQueen) {
                document.documentElement.classList.remove('magic-cursor-mode');
            }
        };

        // Listen for mousemove for cursor sparkles
        document.addEventListener('mousemove', (e) => {
            if (localStorage.getItem('isMagicActive') !== 'true') return;
            if (Math.random() > 0.6) {
                spawnMagicParticle(e.clientX, e.clientY, false);
            }
        });

        // Listen for click for explosion effect
        document.addEventListener('click', (e) => {
            const isMagic = localStorage.getItem('isMagicActive') === 'true';
            const isQueen = localStorage.getItem('isQueenActive') === 'true';
            
            if (isMagic) {
                // Magic Wand Explosion
                for (let i = 0; i < 8; i++) {
                    spawnMagicParticle(e.clientX, e.clientY, true);
                }
                if (window.playSFX) window.playSFX([600, 800], 'sine', 0.05, 0.1);
            }
            
            if (isQueen && !isMagic) {
                // Royal Click Burst (Fallthrough if only Queen is active)
                const emojis = ['👑', '✨', '💎', '🌟', '⚜️'];
                const colors = ['#f1c40f', '#fff', '#feca57', '#e67e22'];
                for (let i = 0; i < 12; i++) {
                    const p = document.createElement('div');
                    p.className = 'magic-particle';
                    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    p.style.left = e.clientX + 'px';
                    p.style.top = e.clientY + 'px';
                    const angle = (Math.PI * 2 * i) / 12;
                    const distance = 40 + Math.random() * 80;
                    p.style.setProperty('--mx', Math.cos(angle) * distance + 'px');
                    p.style.setProperty('--my', Math.sin(angle) * distance + 'px');
                    p.style.color = colors[Math.floor(Math.random() * colors.length)];
                    p.style.textShadow = `0 0 10px ${p.style.color}`;
                    p.style.fontSize = (12 + Math.random() * 12) + 'px';
                    document.body.appendChild(p);
                    setTimeout(() => p.remove(), 1200);
                }
            }
        });

        function spawnMagicParticle(x, y, isBurst) {
            const isQueen = localStorage.getItem('isQueenActive') === 'true';
            const p = document.createElement('div');
            p.className = 'magic-particle';
            p.textContent = isQueen ? ['✨','💎','🌟','👑'][Math.floor(Math.random()*4)] : ['✨','⭐','🌟','💫'][Math.floor(Math.random()*4)];
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            
            const range = isBurst ? 150 : 120;
            p.style.setProperty('--mx', (Math.random() * range - range/2) + 'px');
            p.style.setProperty('--my', (Math.random() * range - range/2) + 'px');
            
            const colors = isQueen ? ['#f1c40f', '#fff', '#feca57', '#e67e22'] : ['#fff', '#feca57', '#ff9ff3', '#48dbfb', '#1dd1a1'];
            p.style.color = colors[Math.floor(Math.random() * colors.length)];
            p.style.textShadow = `0 0 10px ${p.style.color}`;
            p.style.fontSize = (isBurst ? 14 : 10) + Math.random() * 10 + 'px';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1200);
        }

        setInterval(checkEffects, 1000);
        checkEffects();
    })();
})();
