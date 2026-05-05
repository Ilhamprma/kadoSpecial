const fs = require('fs');

// 1. UPDATE intro.html
let intro = fs.readFileSync('c:/Users/ILHAM/Documents/game/intro.html', 'utf8');

intro = intro.replace(/14 April/g, '21 April');
intro = intro.replace(/14 APRIL/g, '21 APRIL');

intro = intro.replace(/const historyFacts=\[[\s\S]*?\];/, `const historyFacts=[
{year:"753 SM", emoji:"🏛️", title:"KOTA ROMA DIDIRIKAN", desc:"Menurut legenda kuno, kota Roma resmi didirikan oleh Romulus.", fun:"\\"Roma aja butuh waktu lama untuk dibangun, apalagi perasaanku ke kamu.\\""},
{year:1926, emoji:"👑", title:"KELAHIRAN RATU INGGRIS", desc:"Ratu Elizabeth II lahir ke dunia dan menjadi penguasa legendaris.", fun:"\\"Ratu aja lahir di tanggalmu. Nggak heran kamu punya aura bangsawan.\\""},
{year:1989, emoji:"🎮", title:"GAME BOY DIRILIS", desc:"Nintendo resmi merilis konsol fenomenal Game Boy pertama kali di Jepang!", fun:"\\"Konsol jadul lahir di tanggalmu, pantes kamu bikin aku mikirin kasino terus.\\""},
{year:2006, emoji:"✨", title:"THE LEGEND IS BORN", desc:"Sesosok bintang terang lahir dan membawa warna di bumi: Ms. hanawazain!", fun:"\\"Sejarah demi sejarah berlalu, tapi hari ini adalah mutlak milikmu.\\""}
];`);

fs.writeFileSync('c:/Users/ILHAM/Documents/game/intro.html', intro, 'utf8');


// 2. UPDATE history.html
let hist = fs.readFileSync('c:/Users/ILHAM/Documents/game/history.html', 'utf8');

hist = hist.replace(/14 April/g, '21 April');
hist = hist.replace(/14 APRIL/g, '21 APRIL');

// replace the timeline divs completely
const timelineHtml = `
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
            <div class="fact-fun">"Dunia heboh lihat dinosaurus. Sedang aku heboh waktu ngelihat matamu."</div>
        </div>

        <div class="fact-card">
            <span class="fact-emoji">✨</span>
            <div class="fact-year">2006</div>
            <div class="fact-title">THE LEGEND IS BORN!</div>
            <div class="fact-desc">
                Dunia bergetar. Sesosok bintang yang hangat, lucu, dan menggemaskan mendarat di bumi bernama Ms. hanawazain!
            </div>
            <div class="fact-fun">"Dari semua sejarah di atas, momen inilah yang paling penting bagiku. Selamat Ultaah!"</div>
        </div>

    </div>
`;
hist = hist.replace(/<div class="timeline">[\s\S]*?<\/div>\s*<\/div>/, timelineHtml + '\n    </div>');

fs.writeFileSync('c:/Users/ILHAM/Documents/game/history.html', hist, 'utf8');

console.log('Done dating to April 21st!');
