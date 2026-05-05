const fs = require('fs');

let hist = fs.readFileSync('c:/Users/ILHAM/Documents/game/history.html', 'utf8');

const newFactsHtml = `
        <div class="fact-card">
            <span class="fact-emoji">🏙️</span>
            <div class="fact-year">1960</div>
            <div class="fact-title">Kota Masa Depan "Brasília" Diresmikan!</div>
            <div class="fact-desc">
                Pemerintah Brasil secara resmi memindahkan ibu kotanya ke Brasília, sebuah kota yang dirancang dari nol dengan arsitektur super modern!
            </div>
            <div class="fact-fun">"Kota semegah ini dibangun dari nol. Seperti kita yang pelan-pelan bangun cerita dari awal."</div>
        </div>

        <div class="fact-card">
            <span class="fact-emoji">🪐</span>
            <div class="fact-year">1992</div>
            <div class="fact-title">Eksoplanet Pertama Ditemukan!</div>
            <div class="fact-desc">
                Para astronom menemukan sistem planet pertama di luar angkasa kita yang mengorbit sebuah bintang pulsar. Penemuan revolusioner bagi dunia astronomi!
            </div>
            <div class="fact-fun">"Galaksi luas aja bisa terungkap. Berarti isi hatimu nggak akan bisa selamanya sembunyi dari aku."</div>
        </div>

        <div class="fact-card">
            <span class="fact-emoji">🌐</span>
            <div class="fact-year">1993</div>
            <div class="fact-title">Browser Web "Mosaic" Dirilis!</div>
            <div class="fact-desc">
                Browser dengan tampilan grafis pertama (Mosaic) dirilis ke publik. Inilah tonggak sejarah yang membuat internet menjadi jauh lebih populer hingga hari ini!
            </div>
            <div class="fact-fun">"Pantes kamu suka bikin aku 'browsing' cara biar bisa deket sama kamu terus."</div>
        </div>

        <div class="fact-card">
            <span class="fact-emoji">🚀</span>
            <div class="fact-year">2021</div>
            <div class="fact-title">Produksi Oksigen di Mars!</div>
            <div class="fact-desc">
                Wahana penjelajah Perseverance milik NASA sukses membuat oksigen secara buatan dari atmosfer planet Mars untuk pertama kalinya!
            </div>
            <div class="fact-fun">"Manusia bisa bernapas di Mars. Tapi, aku cuma bisa bernapas lega kalau di dekatmu."</div>
        </div>

`;

hist = hist.replace('<!-- NEW: THE LEGEND BORN -->', newFactsHtml + '        <!-- NEW: THE LEGEND BORN -->');

fs.writeFileSync('c:/Users/ILHAM/Documents/game/history.html', hist, 'utf8');
console.log('Added new facts!');
