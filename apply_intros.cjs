const fs = require('fs');

const pageIntroSnippet = `
<!-- PAGE INTRO OVERLAY -->
<style>
    @keyframes pageIntroIn { 0%{opacity:0;transform:translateY(30px) scale(0.95)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    .pi-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(16,172,132,0.5); }
</style>
<div id="pageIntroOverlay" style="position:fixed;inset:0;z-index:10001;display:none;background:rgba(5,2,20,0.92);backdrop-filter:blur(6px);">
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:30px 20px;">
        <div style="background:rgba(26,10,46,0.95);border:2px solid #48dbfb;border-radius:12px;padding:35px 30px;max-width:420px;width:90%;text-align:center;box-shadow:0 0 30px rgba(72,219,251,0.15),0 20px 60px rgba(0,0,0,0.4);animation:pageIntroIn 0.5s ease-out;">
            <div style="font-size:56px;margin-bottom:15px;animation:emojiPop 0.5s ease-out;" id="piEmoji"></div>
            <div style="font-family:'Press Start 2P',monospace;font-size:14px;color:#feca57;margin-bottom:18px;line-height:1.6;text-shadow:0 0 10px rgba(254,202,87,0.4);" id="piTitle"></div>
            <div style="font-family:'VT323',monospace;font-size:22px;color:#e8d5f5;line-height:1.5;text-wrap:balance;" id="piDesc"></div>
            <button class="pi-btn" onclick="closePageIntro()" style="margin-top:30px;font-family:'Press Start 2P',monospace;font-size:10px;padding:12px 22px;border:none;border-radius:6px;cursor:pointer;background:linear-gradient(135deg,#10ac84,#0abde3);color:#fff;box-shadow:0 4px 15px rgba(16,172,132,0.3);transition:all 0.3s ease;">MULAI! ✨</button>
        </div>
    </div>
</div>
<script>
function showPageIntro(emoji, title, desc, storageKey) {
    if(localStorage.getItem(storageKey)) return;
    document.getElementById('piEmoji').textContent = emoji;
    document.getElementById('piTitle').textContent = title;
    document.getElementById('piDesc').textContent = desc;
    
    // Add logic to hide/fade main nav to avoid weird overlap issues if needed
    document.getElementById('pageIntroOverlay').style.display = 'block';
    window._piStorageKey = storageKey;
}
function closePageIntro() {
    const o = document.getElementById('pageIntroOverlay');
    o.style.transition = 'opacity 0.4s ease';
    o.style.opacity = '0';
    setTimeout(()=>{
        o.style.display = 'none';
        if(window._piStorageKey) localStorage.setItem(window._piStorageKey, 'true');
    }, 400);
}
</script>
`;

// 1. birthday.html
let bday = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

// Modify tutSlides
bday = bday.replace(
    /const tutSlides=\[.*?\];/, 
    "const tutSlides=[{emoji:'🎉',title:'SELAMAT DATANG!',desc:'Ini adalah dunia virtualmu yang spesial! Klik tombol menu di atas untuk mengunjungi Halaman Sejarah, Toko Hadiah, atau Mesin Slot kapan saja!'}];"
);

// We want to hide the counter, progress bar, and SKIP button for birthday.html since it only has 1 slide
bday = bday.replace(
    /document\.getElementById\('tutCounter'\)\.textContent=.*?tutSlides\.length\ \]\`;/,
    "document.getElementById('tutCounter').style.display = 'none';"
);
bday = bday.replace(
    /document\.getElementById\('tutProgBar'\)\.style\.width=.*?%'\;/,
    "document.getElementById('tutProgBar').parentElement.style.display = 'none';"
);
// Remove skip button (we can just replace <button class="tut-btn tut-skip" ...>SKIP</button> and tut-next inside birthday HTML)
// Actually it's easier: just let renderTutSlide() force "MULAI! ✨" regardless
bday = bday.replace(
    /const btn=document\.getElementById\('tutNext'\);if\(tutIdx.*?else\{.*?\}/,
    "const btn=document.getElementById('tutNext'); btn.textContent='MULAI! ✨'; btn.style.background='linear-gradient(135deg,#10ac84,#0abde3)';"
);

// also hide the skip button by hiding the .tut-skip class
bday = bday.replace('.tut-skip { background:transparent;', '.tut-skip { display:none; background:transparent;');

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', bday, 'utf8');


// 2. slot.html
let slot = fs.readFileSync('c:/Users/ILHAM/Documents/game/slot.html', 'utf8');
if (!slot.includes('pageIntroOverlay')) {
    slot = slot.replace('</body>', pageIntroSnippet + `\n<script>\nwindow.addEventListener('DOMContentLoaded', ()=>{\n    showPageIntro('🎰', 'MESIN SLOT', 'Putar mesin slot dan coba keberuntunganmu! Dapatkan koin di sini untuk belanja hadiah lucumu.', 'tut_slot');\n});\n</script>\n</body>`);
    fs.writeFileSync('c:/Users/ILHAM/Documents/game/slot.html', slot, 'utf8');
}


// 3. shop.html
let shop = fs.readFileSync('c:/Users/ILHAM/Documents/game/shop.html', 'utf8');
if (!shop.includes('pageIntroOverlay')) {
    shop = shop.replace('</body>', pageIntroSnippet + `\n<script>\nwindow.addEventListener('DOMContentLoaded', ()=>{\n    showPageIntro('🛍️', 'TOKO HADIAH', 'Belanjakan koinmu di sini! Barang koleksi yang kamu beli akan dipajang rapi di rak kartu ucapanmu. Silakan pilih!', 'tut_shop');\n});\n</script>\n</body>`);
    fs.writeFileSync('c:/Users/ILHAM/Documents/game/shop.html', shop, 'utf8');
}


// 4. history.html
let history = fs.readFileSync('c:/Users/ILHAM/Documents/game/history.html', 'utf8');
if (!history.includes('pageIntroOverlay')) {
    history = history.replace('</body>', pageIntroSnippet + `\n<script>\nwindow.addEventListener('DOMContentLoaded', ()=>{\n    showPageIntro('📜', 'HALAMAN SEJARAH', 'Jelajahi kembali fakta dunia yang unik khusus di tanggal 21 April! Setiap momen membawa ceritanya sendiri.', 'tut_hist');\n});\n</script>\n</body>`);
    fs.writeFileSync('c:/Users/ILHAM/Documents/game/history.html', history, 'utf8');
}

console.log('All individual intros injected successfully!');
