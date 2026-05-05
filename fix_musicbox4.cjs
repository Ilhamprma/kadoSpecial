const fs = require('fs');
let html = fs.readFileSync('shop.html', 'utf8');

// ===== 1. UPDATE PLAYLIST DESCRIPTIONS =====
const plStart = html.indexOf('        // ===== MUSIC BOX PLAYLIST =====');
const plEnd = html.indexOf('        // ===== RETRO SFX SYNTH =====');

if (plStart === -1 || plEnd === -1) {
    console.log('Playlist not found', plStart, plEnd);
    process.exit(1);
}

const newPlaylist = `        // ===== MUSIC BOX PLAYLIST =====
        const MUSIC_PLAYLIST = [
            { name: "Always - Bon Jovi", file: "music/Bon Jovi - Always (Official Music Video).mp3", desc: "Janji setia yang nggak bisa dipatahkan waktu. Cocok diputar sambil menatap langit malam." },
            { name: "Fast Rap - Yuno Miles", file: "music/Fast Rap _Yuno Miles\\u201d Official video.mp3", desc: "Kalau kamu butuh energi dadakan, putar ini. Dijamin langsung semangat!" },
            { name: "Iris - Goo Goo Dolls", file: "music/Goo Goo Dolls \\u2013 Iris [Official Music Video] [4K Remaster].mp3", desc: "Lagu buat saat-saat kamu pengen dunia berhenti sebentar dan cuma ada kamu sama dia." },
            { name: "Backburner - NIKI", file: "music/NIKI -  Backburner (Official Lyric Video).mp3", desc: "Pernah ngerasa jadi pilihan kedua? Lagu ini ngerti banget perasaan itu." },
            { name: "Champagne Supernova - Oasis", file: "music/Oasis - Champagne Supernova (Official Video).mp3", desc: "Buat kamu yang suka ngelamun sambil jalan kaki sore-sore. Vibes-nya beda." },
            { name: "Kau Rumahku - Raissa Anggiani", file: "music/Raissa Anggiani (Rai) - Kau Rumahku (Official Audio).mp3", desc: "Rumah itu bukan tempat, tapi orang. Dan lagu ini ngomong soal itu dengan indah banget." },
            { name: "Back To December - Taylor Swift", file: "music/Taylor Swift - Back To December.mp3", desc: "Kalau bisa balik ke Desember, apa yang bakal kamu ubah? Taylor tahu rasanya." },
            { name: "Love Story - Taylor Swift", file: "music/Taylor Swift - Love Story.mp3", desc: "Siapa sih yang nggak pernah ngebayangin jadi Juliet? Lagu ini bikin kamu percaya sama dongeng." },
            { name: "Dan Bandung - The Panasdalam Bank", file: "music/The Panasdalam Bank - Dan Bandung (Feat. Danilla) (Official Lyric Video).mp3", desc: "Kota, kenangan, dan orang-orang yang pernah singgah. Bandung dalam bentuk lagu." },
            { name: "Cool Enough For You", file: "music/cool enough for you.mp3", desc: "Lagu yang enak diputar pas lagi rebahan sambil mikirin, 'aku cukup nggak ya buat dia?'" }
        ];

`;

html = html.substring(0, plStart) + newPlaylist + html.substring(plEnd);

// ===== 2. UPDATE UNLOCK CLICK TO AUTO-PLAY =====
// Find the scene.onclick handler and pass newIdx
const oldOnclick = `                // Click to close and open player
                scene.onclick = () => {
                    clearInterval(noteInterval);
                    scene.classList.remove('active');
                    scene.onclick = null;
                    starsContainer.innerHTML = '';
                    scene.querySelectorAll('.unlock-note, .unlock-complete-badge').forEach(el => el.remove());
                    openMusicPlayer();
                };`;

const newOnclick = `                // Click to close and open player — auto-play the unlocked song
                const autoPlayIdx = newIdx;
                scene.onclick = () => {
                    clearInterval(noteInterval);
                    scene.classList.remove('active');
                    scene.onclick = null;
                    starsContainer.innerHTML = '';
                    scene.querySelectorAll('.unlock-note, .unlock-complete-badge').forEach(el => el.remove());
                    openMusicPlayer();
                    setTimeout(() => playTrack(autoPlayIdx), 300);
                };`;

if (html.includes(oldOnclick)) {
    html = html.replace(oldOnclick, newOnclick);
    console.log('Auto-play on unlock applied!');
} else {
    console.log('WARNING: onclick handler not found, trying alternate...');
    // Try without exact whitespace
    const alt = html.indexOf('openMusicPlayer();\n                };');
    if (alt !== -1) {
        html = html.substring(0, alt) + `openMusicPlayer();
                    setTimeout(() => playTrack(autoPlayIdx), 300);
                };` + html.substring(alt + 'openMusicPlayer();\n                };'.length);
        // Also add autoPlayIdx variable
        const sceneOnclick = html.indexOf('scene.onclick = () => {', html.indexOf('Click to close and open player'));
        if (sceneOnclick !== -1) {
            html = html.substring(0, sceneOnclick) + `const autoPlayIdx = newIdx;\n                ` + html.substring(sceneOnclick);
        }
        console.log('Alternate auto-play applied!');
    } else {
        console.log('ERROR: Could not find onclick handler!');
    }
}

fs.writeFileSync('shop.html', html, 'utf8');
console.log('Done!');
