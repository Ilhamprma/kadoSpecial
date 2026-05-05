const fs = require('fs');

let hist = fs.readFileSync('c:/Users/ILHAM/Documents/game/history.html', 'utf8');

// The marker strings to cut everything in between
const startMarker = '<!-- Timeline Facts -->';
const endMarker = '<!-- Footer -->';

const startIndex = hist.indexOf(startMarker);
const endIndex = hist.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const beforeStr = hist.substring(0, startIndex + startMarker.length);
    const afterStr = hist.substring(endIndex);
    
    const newTimeline = `
    <div class="timeline">

        <div class="fact-card">
            <span class="fact-emoji">🏛️</span>
            <div class="fact-year">753 SM</div>
            <div class="fact-title">Kota Roma Didirikan!</div>
            <div class="fact-desc">
                Menurut mitologi Romawi kuno, si kembar Romulus dan Remus mendirikan kota terbesar di peradaban kuno, yaitu Roma. Awal dari kerajaan legendaris!
            </div>
            <div class="fact-fun">"Roma dibangun perlahan menjadi kuat. Persis kaya ikatan cinta kita ya kan?"</div>
        </div>

        <div class="fact-card">
            <span class="fact-emoji">👑</span>
            <div class="fact-year">1926</div>
            <div class="fact-title">Kelahiran Ratu Elizabeth II!</div>
            <div class="fact-desc">
                Ratu paling ikonik di Inggris, Ratu Elizabeth II lahir ke dunia. Ia menjadi penguasa monarki Inggris terlama dalam sejarah kerajaan.
            </div>
            <div class="fact-fun">"Pantes kamu punya sifat ratu, ternyata nyambung zodiak dan tanggalnya..."</div>
        </div>

        <div class="fact-card">
            <span class="fact-emoji">🎮</span>
            <div class="fact-year">1989</div>
            <div class="fact-title">Nintendo Rilis Game Boy!</div>
            <div class="fact-desc">
                Nintendo merilis konsol genggam pertama mereka yang fenomenal "Game Boy" di Jepang! Membawa game legendaris Tetris dan Super Mario ke sakumu.
            </div>
            <div class="fact-fun">"Konsol game dirilis pas hari lahirmu. Nggak heran kamu bikin pengen nge-game terus."</div>
        </div>

        <div class="fact-card">
            <span class="fact-emoji">📻</span>
            <div class="fact-year">1934</div>
            <div class="fact-title">"Surgeon's Photograph" Loch Ness!</div>
            <div class="fact-desc">
                Foto monster Loch Ness paling terkenal di dunia dipublikasikan di koran Daily Mail. Foto misterius ini bikin geger dunia sains selama puluhan tahun.
            </div>
            <div class="fact-fun">"Dunia heboh lihat monster. Sedang aku heboh waktu ngelihat matamu."</div>
        </div>

        <!-- NEW: THE LEGEND BORN -->
        <div class="fact-card legend-card">
            <span class="fact-emoji">👑</span>
            <div class="fact-year" style="color:#ff9ff3">2006</div>
            <div class="fact-title">THE LEGEND IS BORN!</div>
            <div class="fact-desc" style="color:#fff; font-size:24px;">
                Dunia bergetar. Sesosok bintang yang hangat, lucu, dan menggemaskan mendarat di bumi bernama Ms. hanawazain!
            </div>
            <div class="fact-fun" style="font-size:22px; color:#48dbfb; opacity:1">
                "Dari semua sejarah di atas, momen inilah yang paling penting bagiku. Selamat Ultaah!"
            </div>
        </div>

    </div>

    `;
    
    fs.writeFileSync('c:/Users/ILHAM/Documents/game/history.html', beforeStr + '\n' + newTimeline + '\n    ' + afterStr, 'utf8');
    console.log('Fixed timeline structure successfully!');
} else {
    console.log('Markers not found!');
}
