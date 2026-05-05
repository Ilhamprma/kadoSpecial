const fs = require('fs');
let html = fs.readFileSync('shop.html', 'utf8');

// ===== 1. REPLACE CSS =====
const cssStart = '        /* ===== MUSIC BOX PLAYER ===== */';
const cssEnd = '        .unlock-complete-badge {';
const afterBadge = '}\n';

const cssSt = html.indexOf(cssStart);
const cssBadgeStart = html.indexOf(cssEnd, cssSt);
const cssBadgeEnd = html.indexOf(afterBadge, cssBadgeStart + cssEnd.length);

if (cssSt === -1 || cssBadgeStart === -1) {
    console.log('CSS not found', cssSt, cssBadgeStart);
    process.exit(1);
}

const cssEndFull = cssBadgeEnd + afterBadge.length;

const newCSS = `        /* ===== MUSIC BOX PLAYER ===== */
        .music-box-overlay {
            position: fixed; inset: 0; z-index: 12000;
            background: rgba(2, 1, 12, 0.96); backdrop-filter: blur(25px);
            display: none; align-items: center; justify-content: center;
        }
        .music-player-card {
            width: 820px; max-width: 95vw; max-height: 90vh;
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
        .player-body { display: flex; min-height: 420px; }

        /* LEFT: Vinyl + Info */
        .player-left {
            flex: 1; padding: 35px 30px 25px; display: flex; flex-direction: column; align-items: center;
            border-right: 1px solid rgba(212,175,110,0.08);
            background: radial-gradient(ellipse at 50% 30%, rgba(212,175,110,0.04) 0%, transparent 70%);
        }
        .vinyl-container { position: relative; width: 220px; height: 220px; margin-bottom: 28px; }
        .vinyl-disc {
            width: 220px; height: 220px; border-radius: 50%;
            background:
                radial-gradient(circle at 50% 50%, #2a2a2a 0%, #0a0a0a 28%,
                    #181818 29%, #0d0d0d 32%,
                    #151515 33%, #0a0a0a 50%,
                    #131313 51%, #080808 65%,
                    #111 66%, #060606 100%);
            box-shadow: 0 0 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.4),
                        inset 0 0 1px rgba(255,255,255,0.05);
            animation: vinylSpin 2.5s linear infinite; animation-play-state: paused;
            position: relative;
        }
        .vinyl-disc.playing { animation-play-state: running; }
        .vinyl-disc::before {
            content: ''; position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 70px; height: 70px;
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
            background:
                repeating-radial-gradient(circle at 50% 50%,
                    transparent 34px, rgba(255,255,255,0.015) 35px,
                    transparent 36px, transparent 38px, rgba(255,255,255,0.01) 39px,
                    transparent 40px, transparent 44px, rgba(255,255,255,0.012) 45px,
                    transparent 46px, transparent 50px, rgba(255,255,255,0.008) 51px,
                    transparent 52px, transparent 58px, rgba(255,255,255,0.01) 59px,
                    transparent 60px, transparent 66px, rgba(255,255,255,0.008) 67px,
                    transparent 68px, transparent 76px, rgba(255,255,255,0.006) 77px,
                    transparent 78px, transparent 86px, rgba(255,255,255,0.005) 87px,
                    transparent 88px, transparent 96px, rgba(255,255,255,0.004) 97px,
                    transparent 98px);
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
        .vinyl-arm::before {
            content: ''; position: absolute; right: -5px; top: -5px;
            width: 13px; height: 13px; border-radius: 50%;
            background: radial-gradient(circle, #ccc, #666);
            box-shadow: 0 0 8px rgba(0,0,0,0.6);
        }
        .vinyl-arm::after {
            content: ''; position: absolute; left: -2px; top: -1.5px;
            width: 6px; height: 6px; background: rgba(200,200,200,0.8);
            border-radius: 0 0 2px 2px; transform: rotate(45deg);
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
            font-family: 'VT323', monospace; font-size: 18px;
            color: rgba(200, 190, 210, 0.55); font-style: italic;
            text-align: center; line-height: 1.6;
            min-height: 55px; max-width: 320px; letter-spacing: 0.5px;
        }
        .player-controls {
            display: flex; justify-content: center; align-items: center; gap: 22px; margin-top: 22px;
        }
        .ctrl-btn {
            width: 44px; height: 44px; border-radius: 50%;
            border: 1px solid rgba(212,175,110,0.25); background: rgba(0,0,0,0.3);
            color: rgba(212,175,110,0.7); font-size: 16px; cursor: pointer;
            transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
        }
        .ctrl-btn:hover {
            border-color: rgba(212,175,110,0.6); color: #d4af6e;
            background: rgba(212,175,110,0.08); box-shadow: 0 0 15px rgba(212,175,110,0.15);
            transform: scale(1.08);
        }
        .ctrl-btn.play-main {
            width: 58px; height: 58px; font-size: 22px;
            border-color: rgba(212,175,110,0.5); border-width: 2px;
            background: rgba(212,175,110,0.06);
        }
        .ctrl-btn.play-main:hover {
            background: rgba(212,175,110,0.15); box-shadow: 0 0 25px rgba(212,175,110,0.2);
        }

        /* RIGHT: Track List */
        .player-right {
            width: 310px; display: flex; flex-direction: column;
            background: rgba(0,0,0,0.15);
        }
        .tracklist-header {
            padding: 18px 24px; font-family: 'VT323', monospace;
            font-size: 16px; color: rgba(212,175,110,0.6); letter-spacing: 4px;
            border-bottom: 1px solid rgba(212,175,110,0.08);
            display: flex; justify-content: space-between; align-items: center;
            text-transform: uppercase;
        }
        .tracklist-count { color: rgba(255,159,243,0.5); font-size: 14px; letter-spacing: 2px; }
        .track-list { flex: 1; overflow-y: auto; padding: 6px 0; }
        .track-list::-webkit-scrollbar { width: 2px; }
        .track-list::-webkit-scrollbar-track { background: transparent; }
        .track-list::-webkit-scrollbar-thumb { background: rgba(212,175,110,0.15); border-radius: 2px; }
        .track-item {
            padding: 12px 24px; cursor: pointer; transition: all 0.3s ease;
            font-family: 'VT323', monospace; font-size: 17px; color: rgba(200,190,210,0.5);
            display: flex; align-items: center; gap: 14px;
            border-left: 2px solid transparent; letter-spacing: 0.5px;
        }
        .track-item:hover { background: rgba(212,175,110,0.04); color: rgba(212,175,110,0.8); }
        .track-item.active {
            background: linear-gradient(90deg, rgba(212,175,110,0.1), transparent);
            color: rgba(212,175,110,0.95); border-left-color: rgba(212,175,110,0.7);
        }
        .track-item.locked { cursor: default; opacity: 0.3; }
        .track-item.locked:hover { background: transparent; color: rgba(200,190,210,0.5); }
        .track-num {
            font-family: 'VT323', monospace; font-size: 14px;
            color: rgba(212,175,110,0.25); min-width: 22px;
        }
        .track-item.active .track-num { color: rgba(212,175,110,0.7); }
        .track-lock { color: rgba(200,190,210,0.25); font-size: 14px; letter-spacing: 3px; }

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
        .crystal-box-glow { position: absolute; inset: -30px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,110,0.3) 0%, transparent 70%); animation: glowPulse 2s ease-in-out infinite; }
        @keyframes glowPulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.2); opacity: 1; } }
        .crystal-box-icon { font-size: 100px; position: relative; z-index: 2; filter: drop-shadow(0 0 30px rgba(212,175,110,0.6)); animation: boxFloat 3s ease-in-out infinite; }
        @keyframes boxFloat { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
        .crystal-box-ring { position: absolute; width: 200px; height: 200px; border: 2px solid rgba(212,175,110,0.2); border-radius: 50%; animation: ringRotate 6s linear infinite; }
        .crystal-box-ring:nth-child(2) { width: 240px; height: 240px; animation-duration: 8s; animation-direction: reverse; border-color: rgba(255,159,243,0.15); }
        @keyframes ringRotate { to { transform: rotate(360deg); } }
        .unlock-text-container { text-align: center; position: relative; z-index: 5; opacity: 0; transform: translateY(30px); animation: unlockTextIn 1s ease-out 1.5s forwards; }
        @keyframes unlockTextIn { to { opacity: 1; transform: translateY(0); } }
        .unlock-label { font-family: 'VT323', monospace; font-size: 18px; color: rgba(212,175,110,0.8); letter-spacing: 6px; margin-bottom: 15px; text-shadow: 0 0 15px rgba(212,175,110,0.3); }
        .unlock-song-name { font-family: 'Pacifico', cursive; font-size: 32px; color: rgba(212,175,110,0.95); text-shadow: 0 0 20px rgba(212,175,110,0.4); margin-bottom: 10px; line-height: 1.4; }
        .unlock-progress { font-family: 'VT323', monospace; font-size: 14px; color: rgba(255,159,243,0.5); margin-top: 15px; letter-spacing: 3px; }
        .unlock-progress-bar { width: 200px; height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; margin: 12px auto 0; overflow: hidden; }
        .unlock-progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, rgba(212,175,110,0.4), rgba(212,175,110,0.8)); transition: width 1s ease-out; }
        .unlock-hint { font-family: 'VT323', monospace; font-size: 16px; color: rgba(255,255,255,0.2); margin-top: 30px; animation: hintPulse 2.5s infinite; letter-spacing: 2px; }
        @keyframes hintPulse { 0%,100% { opacity: 0.2; } 50% { opacity: 0.5; } }
        .unlock-note { position: absolute; pointer-events: none; z-index: 3; font-size: 30px; opacity: 0; animation: noteFloat 3s ease-out forwards; }
        @keyframes noteFloat { 0% { transform: translateY(0) scale(0); opacity: 0; } 20% { transform: translateY(-20px) scale(1); opacity: 1; } 100% { transform: translateY(-200px) rotate(var(--rot)) scale(0.5); opacity: 0; } }
        .unlock-complete-badge { position: absolute; top: 20px; right: 20px; font-family: 'VT323', monospace; font-size: 14px; color: rgba(46,204,113,0.7); background: rgba(46,204,113,0.08); border: 1px solid rgba(46,204,113,0.2); border-radius: 20px; padding: 6px 16px; letter-spacing: 2px; }
`;

html = html.substring(0, cssSt) + newCSS + html.substring(cssEndFull);

// ===== 2. REPLACE PLAYLIST DESCRIPTIONS =====
const plStart = html.indexOf('        // ===== MUSIC BOX PLAYLIST =====');
const plEnd = html.indexOf('        // ===== RETRO SFX SYNTH =====');

if (plStart === -1 || plEnd === -1) {
    console.log('Playlist section not found', plStart, plEnd);
    process.exit(1);
}

const newPlaylist = `        // ===== MUSIC BOX PLAYLIST =====
        const MUSIC_PLAYLIST = [
            { name: "Always - Bon Jovi", file: "music/Bon Jovi - Always (Official Music Video).mp3", desc: "Balada abadi tentang kesetiaan yang tak pernah pudar, bahkan oleh waktu." },
            { name: "Fast Rap - Yuno Miles", file: "music/Fast Rap _Yuno Miles\\u201d Official video.mp3", desc: "Dentuman lirik cepat yang membakar semangat, penuh energi tanpa henti." },
            { name: "Iris - Goo Goo Dolls", file: "music/Goo Goo Dolls \\u2013 Iris [Official Music Video] [4K Remaster].mp3", desc: "Ketika dunia terasa seperti ilusi, hanya cinta yang terasa nyata." },
            { name: "Backburner - NIKI", file: "music/NIKI -  Backburner (Official Lyric Video).mp3", desc: "Bisikan hati tentang menunggu di balik layar, berharap untuk dipilih." },
            { name: "Champagne Supernova - Oasis", file: "music/Oasis - Champagne Supernova (Official Video).mp3", desc: "Mimpi yang mengambang antara kenyataan dan khayalan, indah tanpa batas." },
            { name: "Kau Rumahku - Raissa Anggiani", file: "music/Raissa Anggiani (Rai) - Kau Rumahku (Official Audio).mp3", desc: "Tentang menemukan kedamaian di dalam pelukan seseorang yang paling berarti." },
            { name: "Back To December - Taylor Swift", file: "music/Taylor Swift - Back To December.mp3", desc: "Surat penyesalan yang terselip di antara salju Desember dan kerinduan." },
            { name: "Love Story - Taylor Swift", file: "music/Taylor Swift - Love Story.mp3", desc: "Dongeng cinta modern yang terinspirasi dari Romeo dan Juliet abadi." },
            { name: "Dan Bandung - The Panasdalam Bank", file: "music/The Panasdalam Bank - Dan Bandung (Feat. Danilla) (Official Lyric Video).mp3", desc: "Surat cinta untuk kota Bandung, penuh nostalgia dan kenangan terindah." },
            { name: "Cool Enough For You", file: "music/cool enough for you.mp3", desc: "Renungan lembut tentang keraguan diri dan harapan yang tersimpan diam." }
        ];

`;

html = html.substring(0, plStart) + newPlaylist + html.substring(plEnd);

fs.writeFileSync('shop.html', html, 'utf8');
console.log('Done! Elegant classic redesign applied.');
