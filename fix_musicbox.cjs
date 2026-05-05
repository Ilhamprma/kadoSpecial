const fs = require('fs');
let html = fs.readFileSync('shop.html', 'utf8');

// Replace CSS section (lines 40-170)
const cssStart = '        /* ===== MUSIC BOX STYLES ===== */';
const cssEnd = '            padding: 6px 12px; letter-spacing: 1px;\n        }';
const afterCss = '\n\n\n        * {';

const startIdx = html.indexOf(cssStart);
const endIdx = html.indexOf(afterCss, startIdx);

if (startIdx === -1 || endIdx === -1) {
    console.log('CSS markers not found!', startIdx, endIdx);
    process.exit(1);
}

const newCSS = `        /* ===== MUSIC BOX PLAYER ===== */
        .music-box-overlay {
            position: fixed; inset: 0; z-index: 12000;
            background: rgba(5, 2, 20, 0.95); backdrop-filter: blur(20px);
            display: none; align-items: center; justify-content: center;
        }
        .music-player-card {
            width: 780px; max-width: 95vw; max-height: 90vh;
            background: linear-gradient(145deg, #1a0a2e, #0d0520);
            border: 2px solid rgba(254, 202, 87, 0.4); border-radius: 20px;
            box-shadow: 0 0 80px rgba(254, 202, 87, 0.15), inset 0 0 40px rgba(0,0,0,0.5);
            padding: 0; position: relative; overflow: hidden;
            animation: playerPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes playerPop { from { transform: scale(0.85) translateY(30px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .player-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 18px 25px; border-bottom: 1px solid rgba(254,202,87,0.15);
            background: rgba(0,0,0,0.3);
        }
        .player-title { font-family: 'Press Start 2P', monospace; font-size: 9px; color: #feca57; text-shadow: 0 0 10px #feca57; letter-spacing: 2px; }
        .player-close { background: none; border: none; color: #555; font-size: 26px; cursor: pointer; transition: 0.3s; }
        .player-close:hover { color: #e94560; transform: scale(1.2) rotate(90deg); }
        .player-body { display: flex; min-height: 380px; }
        .player-left {
            flex: 1; padding: 30px; display: flex; flex-direction: column; align-items: center;
            border-right: 1px solid rgba(254,202,87,0.1);
        }
        .vinyl-container { position: relative; width: 200px; height: 200px; margin-bottom: 25px; }
        .vinyl-disc {
            width: 200px; height: 200px; border-radius: 50%;
            background: radial-gradient(circle at 50% 50%, #333 0%, #111 30%, #222 31%, #0a0a0a 60%, #1a1a1a 61%, #111 100%);
            box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.03);
            animation: vinylSpin 3s linear infinite; animation-play-state: paused;
            position: relative;
        }
        .vinyl-disc.playing { animation-play-state: running; }
        .vinyl-disc::before {
            content: ''; position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 60px; height: 60px;
            border-radius: 50%; background: radial-gradient(circle, #feca57 0%, #e67e22 40%, #1a0a2e 60%);
            box-shadow: 0 0 15px rgba(254,202,87,0.4);
        }
        .vinyl-disc::after {
            content: '\\1F3B5'; position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); font-size: 18px;
        }
        .vinyl-grooves {
            position: absolute; inset: 25px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.04);
            box-shadow: inset 0 0 0 10px rgba(255,255,255,0.02), inset 0 0 0 20px rgba(255,255,255,0.015),
                        inset 0 0 0 30px rgba(255,255,255,0.01), inset 0 0 0 40px rgba(255,255,255,0.008),
                        inset 0 0 0 50px rgba(255,255,255,0.005);
            pointer-events: none;
        }
        .vinyl-glow {
            position: absolute; inset: -15px; border-radius: 50%;
            background: radial-gradient(circle, rgba(254,202,87,0.15) 0%, transparent 70%);
            opacity: 0; transition: opacity 0.5s;
        }
        .vinyl-disc.playing ~ .vinyl-glow { opacity: 1; }
        .vinyl-arm {
            position: absolute; top: -10px; right: -15px; width: 80px; height: 4px;
            background: linear-gradient(90deg, #888, #ccc); border-radius: 2px;
            transform-origin: right center; transform: rotate(-30deg);
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;
        }
        .vinyl-arm::before {
            content: ''; position: absolute; right: -6px; top: -6px;
            width: 16px; height: 16px; border-radius: 50%;
            background: radial-gradient(circle, #ddd, #888); box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .vinyl-arm::after {
            content: ''; position: absolute; left: -3px; top: -2px;
            width: 8px; height: 8px; background: #aaa; border-radius: 1px; transform: rotate(45deg);
        }
        .vinyl-arm.playing { transform: rotate(-10deg); }
        @keyframes vinylSpin { to { transform: rotate(360deg); } }
        .song-title-display {
            font-family: 'Pacifico', cursive; font-size: 22px; color: #feca57;
            text-align: center; margin-bottom: 8px; line-height: 1.3;
            text-shadow: 0 0 15px rgba(254,202,87,0.4);
            min-height: 60px; display: flex; align-items: center; justify-content: center;
        }
        .song-desc-display {
            font-family: 'VT323', monospace; font-size: 17px; color: #c8b6d8;
            text-align: center; line-height: 1.5; opacity: 0.8;
            min-height: 50px; max-width: 300px;
        }
        .player-controls {
            display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 20px;
        }
        .ctrl-btn {
            width: 45px; height: 45px; border-radius: 50%;
            border: 2px solid rgba(254,202,87,0.4); background: rgba(0,0,0,0.4);
            color: #feca57; font-size: 18px; cursor: pointer; transition: all 0.3s;
            display: flex; align-items: center; justify-content: center;
        }
        .ctrl-btn:hover { background: #feca57; color: #1a0a2e; box-shadow: 0 0 15px rgba(254,202,87,0.5); transform: scale(1.1); }
        .ctrl-btn.play-main { width: 60px; height: 60px; font-size: 24px; border-color: #feca57; border-width: 3px; }
        .player-right { width: 300px; display: flex; flex-direction: column; background: rgba(0,0,0,0.2); }
        .tracklist-header {
            padding: 15px 20px; font-family: 'Press Start 2P', monospace;
            font-size: 8px; color: #48dbfb; letter-spacing: 2px;
            border-bottom: 1px solid rgba(72,219,251,0.15);
            display: flex; justify-content: space-between; align-items: center;
        }
        .tracklist-count { color: #ff9ff3; font-size: 7px; }
        .track-list { flex: 1; overflow-y: auto; padding: 8px 0; }
        .track-list::-webkit-scrollbar { width: 3px; }
        .track-list::-webkit-scrollbar-track { background: transparent; }
        .track-list::-webkit-scrollbar-thumb { background: rgba(254,202,87,0.2); border-radius: 3px; }
        .track-item {
            padding: 10px 20px; cursor: pointer; transition: all 0.3s;
            font-family: 'VT323', monospace; font-size: 16px; color: #888;
            display: flex; align-items: center; gap: 12px; border-left: 3px solid transparent;
        }
        .track-item:hover { background: rgba(254,202,87,0.05); color: #ccc; }
        .track-item.active { background: rgba(254,202,87,0.1); color: #feca57; border-left-color: #feca57; }
        .track-item.locked { cursor: default; opacity: 0.4; }
        .track-item.locked:hover { background: transparent; color: #888; }
        .track-num { font-family: 'Press Start 2P', monospace; font-size: 7px; color: #555; min-width: 20px; }
        .track-item.active .track-num { color: #feca57; }
        .track-lock { color: #444; font-size: 14px; }

        /* ===== MUSIC UNLOCK SCENE ===== */
        .music-unlock-scene {
            position: fixed; inset: 0; z-index: 12500;
            background: radial-gradient(circle at 50% 40%, #1a0a3e 0%, #080020 50%, #000 100%);
            display: none; flex-direction: column; align-items: center; justify-content: center; overflow: hidden;
        }
        .music-unlock-scene.active { display: flex; animation: sceneFlashIn 0.8s ease-out; }
        @keyframes sceneFlashIn { 0% { opacity: 0; } 30% { opacity: 1; } }
        .unlock-stars { position: absolute; inset: 0; pointer-events: none; }
        .unlock-star { position: absolute; width: 3px; height: 3px; background: #fff; border-radius: 50%; animation: starTwinkle2 2s infinite; }
        @keyframes starTwinkle2 { 0%,100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        .crystal-box { position: relative; width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }
        .crystal-box-glow { position: absolute; inset: -30px; border-radius: 50%; background: radial-gradient(circle, rgba(254,202,87,0.3) 0%, transparent 70%); animation: glowPulse 2s ease-in-out infinite; }
        @keyframes glowPulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.2); opacity: 1; } }
        .crystal-box-icon { font-size: 100px; position: relative; z-index: 2; filter: drop-shadow(0 0 30px rgba(254,202,87,0.6)); animation: boxFloat 3s ease-in-out infinite; }
        @keyframes boxFloat { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
        .crystal-box-ring { position: absolute; width: 200px; height: 200px; border: 2px solid rgba(254,202,87,0.2); border-radius: 50%; animation: ringRotate 6s linear infinite; }
        .crystal-box-ring:nth-child(2) { width: 240px; height: 240px; animation-duration: 8s; animation-direction: reverse; border-color: rgba(255,159,243,0.15); }
        @keyframes ringRotate { to { transform: rotate(360deg); } }
        .unlock-text-container { text-align: center; position: relative; z-index: 5; opacity: 0; transform: translateY(30px); animation: unlockTextIn 1s ease-out 1.5s forwards; }
        @keyframes unlockTextIn { to { opacity: 1; transform: translateY(0); } }
        .unlock-label { font-family: 'Press Start 2P', monospace; font-size: 12px; color: #48dbfb; letter-spacing: 4px; margin-bottom: 15px; text-shadow: 0 0 15px rgba(72,219,251,0.5); }
        .unlock-song-name { font-family: 'Pacifico', cursive; font-size: 32px; color: #feca57; text-shadow: 0 0 20px rgba(254,202,87,0.6); margin-bottom: 10px; line-height: 1.4; }
        .unlock-progress { font-family: 'Press Start 2P', monospace; font-size: 8px; color: #ff9ff3; margin-top: 15px; letter-spacing: 2px; opacity: 0.7; }
        .unlock-progress-bar { width: 200px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin: 12px auto 0; overflow: hidden; }
        .unlock-progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #48dbfb, #feca57, #ff9ff3); transition: width 1s ease-out; }
        .unlock-hint { font-family: 'VT323', monospace; font-size: 18px; color: rgba(255,255,255,0.3); margin-top: 30px; animation: hintPulse 2s infinite; }
        @keyframes hintPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .unlock-note { position: absolute; pointer-events: none; z-index: 3; font-size: 30px; opacity: 0; animation: noteFloat 3s ease-out forwards; }
        @keyframes noteFloat { 0% { transform: translateY(0) scale(0); opacity: 0; } 20% { transform: translateY(-20px) scale(1); opacity: 1; } 100% { transform: translateY(-200px) rotate(var(--rot)) scale(0.5); opacity: 0; } }
        .unlock-complete-badge { position: absolute; top: 20px; right: 20px; font-family: 'Press Start 2P', monospace; font-size: 7px; color: #2ecc71; background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.3); border-radius: 20px; padding: 6px 12px; letter-spacing: 1px; }
`;

html = html.substring(0, startIdx) + newCSS + html.substring(endIdx);

// Replace MUSIC BOX OVERLAY HTML
const oldPlayerHTML = `    <!-- MUSIC BOX OVERLAY (PLAYER) -->
    <div id="musicBoxOverlay" class="music-box-overlay">
        <div class="music-player-card">
            <div class="player-header">
                <span class="player-title">🎶 CRYSTAL MUSIC BOX 🎶</span>
                <button class="player-close" onclick="closeMusicPlayer()">×</button>
            </div>
            <div class="player-body">
                <div class="current-track">
                    <div class="track-disc" id="trackDisc">📀</div>
                    <div class="track-info">
                        <div class="track-name" id="currentTrackName">Pilih lagu...</div>
                        <div class="track-status" id="trackStatus">✨ Menunggu perintah Sang Ratu...</div>
                    </div>
                </div>
                <div class="track-list" id="unlockedTrackList"></div>
            </div>
            <div class="player-controls">
                <button class="ctrl-btn" onclick="prevTrack()">⏮</button>
                <button class="ctrl-btn play-main" id="musicBoxPlayPause" onclick="toggleMusicBox()">▶</button>
                <button class="ctrl-btn" onclick="nextTrack()">⏭</button>
            </div>
        </div>
    </div>`;

const newPlayerHTML = `    <!-- MUSIC BOX PLAYER -->
    <div id="musicBoxOverlay" class="music-box-overlay">
        <div class="music-player-card">
            <div class="player-header">
                <span class="player-title">🎶 CRYSTAL MUSIC BOX</span>
                <button class="player-close" onclick="closeMusicPlayer()">×</button>
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
                    <div class="player-controls">
                        <button class="ctrl-btn" onclick="prevTrack()">⏮</button>
                        <button class="ctrl-btn play-main" id="musicBoxPlayPause" onclick="toggleMusicBox()">▶</button>
                        <button class="ctrl-btn" onclick="nextTrack()">⏭</button>
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
    </div>`;

html = html.replace(oldPlayerHTML, newPlayerHTML);

fs.writeFileSync('shop.html', html, 'utf8');
console.log('Done! CSS and HTML replaced.');
