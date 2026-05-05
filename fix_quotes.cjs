const fs = require('fs');
let text = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

text = text.replace(/const dilanQuotes = \[[\s\S]*?\];/, `const dilanQuotes = [
            "\\"Aku nggak jago masak, nggak bisa nyetir, tapi kalau disuruh sayang kamu... aku juara dunia.\\" 🏆💖",
            "\\"Umurmu nambah, tapi mukamu tetap kayak bakpao... bulat, lembut, bikin gemes.\\" 😍😘",
            "\\"Kalau kamu jadi lilin, aku nggak akan niup kamu. Aku bakal jaga biar apinya nyala terus.\\" 🕯️🔥",
            "\\"Kamu tuh kayak WiFi gratisan... bikin aku nggak bisa move on dari sini.\\" 💻📱💖",
            "\\"Selamat ulang tahun! Semoga rezekinya lancar, jodohnya deket... ya aku maksudnya.\\" 😜✨",
            "\\"Aku rela kok jadi kue ulang tahunmu. Biar kamu potong-potong hatiku... eh, kuenya.\\" 🎂❤️",
            "\\"Tambah tua gapapa, yang penting jangan tambah jauh dariku. Aku bisa nangis beneran.\\" 😤😢💖",
            "\\"Kamu nanya apa hadiahnya? Hadiahnya aku. Gratis. Tanpa ongkir. Nggak bisa diretur.\\" 🎁😜💍",
        ];`);

text = text.replace(/const INVENTORY_MAP = \{[\s\S]*?\};/, `const INVENTORY_MAP = {
            'virtual_rose': { emoji: '🌹', name: 'Mawar Virtual'},
            'love_letter': { emoji: '💌', name: 'Surat Cinta'},
            'teddy_bear': { emoji: '🧸', name: 'Teddy Bear' },
            'chocolate': { emoji: '🍫', name: 'Coklat Spesial' },
            'star_wish': { emoji: '⭐', name: 'Bintang Harapan' },
            'crown': { emoji: '👑', name: 'Mahkota Ratu' },
            'diamond_ring': { emoji: '💍', name: 'Cincin Berlian' },
            'music_box': { emoji: '🎵', name: 'Kotak Musik' },
            'lucky_clover': { emoji: '🍀', name: 'Semanggi Beruntung' },
            'perfume': { emoji: '🌸', name: 'Parfum Sakura' },
            'galaxy_ticket': { emoji: '🎫', name: 'Tiket ke Galaxy' },
            'eternal_heart': { emoji: '💖', name: 'Hati Abadi' }
        };`);

text = text.replace(/Beli di Shop yuk![^<]*?<\/div>/, 'Beli di Shop yuk! 🛍️</div>');
text = text.replace(/bgmIcon\.textContent = '[^']+'; bgmBtn\.classList\.remove\('playing'\);/, "bgmIcon.textContent = '🔇'; bgmBtn.classList.remove('playing');");
text = text.replace(/bgmIcon\.textContent = '[^']+'; bgmBtn\.classList\.add\('playing'\);/, "bgmIcon.textContent = '🔊'; bgmBtn.classList.add('playing');");

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', text, 'utf8');
console.log('Fixed quotes and inventory.');
