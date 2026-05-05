const fs = require('fs');
let html = fs.readFileSync('shop.html', 'utf8');

// Replace playlist with descriptions
const oldPlaylist = `        // ===== MUSIC BOX PLAYLIST =====
        const MUSIC_PLAYLIST = [`;
const playlistEnd = `        ];

        // ===== RETRO SFX SYNTH =====`;

const pStart = html.indexOf(oldPlaylist);
const pEnd = html.indexOf(playlistEnd, pStart);

if (pStart === -1 || pEnd === -1) {
    console.log('Playlist markers not found!', pStart, pEnd);
    process.exit(1);
}

const newPlaylist = `        // ===== MUSIC BOX PLAYLIST =====
        const MUSIC_PLAYLIST = [
            { name: "Always - Bon Jovi", file: "music/Bon Jovi - Always (Official Music Video).mp3", desc: "A timeless rock ballad about eternal devotion and undying love." },
            { name: "Fast Rap - Yuno Miles", file: "music/Fast Rap _Yuno Miles\\u201d Official video.mp3", desc: "High-energy rapid-fire bars that hit different every single time." },
            { name: "Iris - Goo Goo Dolls", file: "music/Goo Goo Dolls \\u2013 Iris [Official Music Video] [4K Remaster].mp3", desc: "When everything feels like a movie, you bleed just to know you're alive." },
            { name: "Backburner - NIKI", file: "music/NIKI -  Backburner (Official Lyric Video).mp3", desc: "A bittersweet confession about waiting and hoping to be chosen." },
            { name: "Champagne Supernova - Oasis", file: "music/Oasis - Champagne Supernova (Official Video).mp3", desc: "A dreamy Britpop anthem that floats between reality and fantasy." },
            { name: "Kau Rumahku - Raissa Anggiani", file: "music/Raissa Anggiani (Rai) - Kau Rumahku (Official Audio).mp3", desc: "Lagu tentang menemukan rumah di dalam diri seseorang yang kita cintai." },
            { name: "Back To December - Taylor Swift", file: "music/Taylor Swift - Back To December.mp3", desc: "A heartfelt apology wrapped in winter melancholy and regret." },
            { name: "Love Story - Taylor Swift", file: "music/Taylor Swift - Love Story.mp3", desc: "A modern-day fairy tale inspired by Romeo and Juliet's timeless love." },
            { name: "Dan Bandung - The Panasdalam Bank", file: "music/The Panasdalam Bank - Dan Bandung (Feat. Danilla) (Official Lyric Video).mp3", desc: "Surat cinta untuk kota Bandung dan semua kenangan di dalamnya." },
            { name: "Cool Enough For You", file: "music/cool enough for you.mp3", desc: "A chill, introspective track about self-doubt and quiet longing." }
        ];

        // ===== RETRO SFX SYNTH =====`;

html = html.substring(0, pStart) + newPlaylist + html.substring(pEnd + playlistEnd.length);

// Replace player JS functions
const oldPlayerJS = `        // ===== MUSIC BOX PLAYER LOGIC =====`;
const endOfFile = `    </script>
</body>
</html>`;

const jsStart = html.indexOf(oldPlayerJS);
const jsEnd = html.indexOf(endOfFile, jsStart);

if (jsStart === -1 || jsEnd === -1) {
    console.log('Player JS markers not found!', jsStart, jsEnd);
    process.exit(1);
}

const newPlayerJS = `        // ===== MUSIC BOX PLAYER LOGIC =====
        let currentTrackIdx = -1;
        const mbAudio = document.getElementById('musicBoxAudio');
        const mbOverlay = document.getElementById('musicBoxOverlay');

        function openMusicPlayer() {
            mbOverlay.style.display = 'flex';
            updateTrackList();
            sfxSelect();
        }

        function closeMusicPlayer() {
            mbOverlay.style.display = 'none';
            sfxCancel();
        }

        function getUnlockedSongs() {
            return JSON.parse(localStorage.getItem('unlockedSongs') || '[]');
        }

        function updateTrackList() {
            const unlocked = getUnlockedSongs();
            const list = document.getElementById('unlockedTrackList');
            list.innerHTML = '';

            // Show ALL 10 tracks, locked ones as ???
            MUSIC_PLAYLIST.forEach((track, idx) => {
                const isUnlocked = unlocked.includes(idx);
                const item = document.createElement('div');
                item.className = 'track-item' + (currentTrackIdx === idx ? ' active' : '') + (!isUnlocked ? ' locked' : '');

                if (isUnlocked) {
                    item.innerHTML = '<span class="track-num">' + String(idx + 1).padStart(2, '0') + '</span><span>' + track.name + '</span>';
                    item.onclick = () => playTrack(idx);
                } else {
                    item.innerHTML = '<span class="track-num">' + String(idx + 1).padStart(2, '0') + '</span><span class="track-lock">🔒 ? ? ?</span>';
                }

                list.appendChild(item);
            });

            // Update count
            const countEl = document.getElementById('tracklistCount');
            if (countEl) countEl.textContent = unlocked.length + '/10';
        }

        function playTrack(idx) {
            currentTrackIdx = idx;
            const track = MUSIC_PLAYLIST[idx];
            mbAudio.src = track.file;
            mbAudio.play();

            // Update vinyl
            document.getElementById('vinylDisc').classList.add('playing');
            document.getElementById('vinylArm').classList.add('playing');
            document.getElementById('musicBoxPlayPause').textContent = '\\u23F8';

            // Update song info
            document.getElementById('songTitleDisplay').textContent = track.name;
            document.getElementById('songDescDisplay').textContent = track.desc || '';

            updateTrackList();
        }

        function toggleMusicBox() {
            if (mbAudio.paused) {
                if (currentTrackIdx === -1) {
                    const unlocked = getUnlockedSongs();
                    if (unlocked.length > 0) playTrack(unlocked[0]);
                } else {
                    mbAudio.play();
                    document.getElementById('vinylDisc').classList.add('playing');
                    document.getElementById('vinylArm').classList.add('playing');
                    document.getElementById('musicBoxPlayPause').textContent = '\\u23F8';
                }
            } else {
                mbAudio.pause();
                document.getElementById('vinylDisc').classList.remove('playing');
                document.getElementById('vinylArm').classList.remove('playing');
                document.getElementById('musicBoxPlayPause').textContent = '\\u25B6';
            }
        }

        function prevTrack() {
            const unlocked = getUnlockedSongs();
            if (unlocked.length === 0) return;
            const curPos = unlocked.indexOf(currentTrackIdx);
            const prevPos = curPos <= 0 ? unlocked.length - 1 : curPos - 1;
            playTrack(unlocked[prevPos]);
        }

        function nextTrack() {
            const unlocked = getUnlockedSongs();
            if (unlocked.length === 0) return;
            const curPos = unlocked.indexOf(currentTrackIdx);
            const nextPos = curPos >= unlocked.length - 1 ? 0 : curPos + 1;
            playTrack(unlocked[nextPos]);
        }

        mbAudio.onended = () => {
            nextTrack();
        };
`;

html = html.substring(0, jsStart) + newPlayerJS + html.substring(jsEnd);

fs.writeFileSync('shop.html', html, 'utf8');
console.log('Done! Playlist + Player JS updated.');
