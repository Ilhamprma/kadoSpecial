const fs = require('fs');

// Restoring birthday.html
let bday = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

// Restore tutSlides
bday = bday.replace(
    /const tutSlides=\[.*?\];/, 
    "const tutSlides=[{emoji:'🎉',title:'SELAMAT DATANG!',desc:'Ini adalah dunia virtualmu yang spesial! Di sini ada banyak hal seru. Yuk kenalan dengan fitur-fiturnya!'},{emoji:'🎰',title:'MESIN SLOT',desc:'Putar mesin slot dan coba keberuntunganmu! Dapatkan koin sebanyak-banyaknya. Siapa tahu kamu jackpot!'},{emoji:'🛍️',title:'TOKO HADIAH',desc:'Belanjakan koinmu di sini! Beli hadiah virtual yang lucu-lucu dan koleksinya muncul di rak kartu ucapanmu.'},{emoji:'📜',title:'HALAMAN SEJARAH',desc:'Pelajari peristiwa bersejarah di tanggal 21 April. Dari Titanic sampai kelahiran seseorang yang spesial!'},{emoji:'💌',title:'KARTU UCAPAN',desc:'Dan inilah kartu ucapan spesial untukmu! Baca pesan dari seseorang yang sangat menyayangimu.'}];"
);

// Restore tutCounter display
bday = bday.replace(
    /document\.getElementById\('tutCounter'\)\.style\.display = 'none';/,
    "document.getElementById('tutCounter').textContent=`[ ${tutIdx+1} / ${tutSlides.length} ]`;"
);

// Restore tutProgBar logic
bday = bday.replace(
    /document\.getElementById\('tutProgBar'\)\.parentElement\.style\.display = 'none';/,
    "document.getElementById('tutProgBar').style.width=((tutIdx+1)/tutSlides.length*100)+'%';"
);

// Restore tutNext button dynamic text
bday = bday.replace(
    /const btn=document\.getElementById\('tutNext'\); btn\.textContent='MULAI! ✨'; btn\.style\.background='linear-gradient\(135deg,#10ac84,#0abde3\)';/,
    "const btn=document.getElementById('tutNext');if(tutIdx===tutSlides.length-1){btn.textContent='MULAI! ✨';btn.style.background='linear-gradient(135deg,#10ac84,#0abde3)'}else{btn.textContent='LANJUT ▸';btn.style.background='linear-gradient(135deg,#e94560,#ff6b6b)'}"
);

// Restore skip button display
bday = bday.replace('.tut-skip { display:none; background:transparent;', '.tut-skip { background:transparent;');

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', bday, 'utf8');

// Remove snippet from slot, shop, history
function removeSnippet(path) {
    let content = fs.readFileSync(path, 'utf8');
    const startIdx = content.indexOf('<!-- PAGE INTRO OVERLAY -->');
    if (startIdx !== -1) {
        // Find the next </body> after the start index
        const bodyEnd = content.indexOf('</body>', startIdx);
        if (bodyEnd !== -1) {
            content = content.substring(0, startIdx) + '\n</body>' + content.substring(bodyEnd + 7);
            fs.writeFileSync(path, content, 'utf8');
        }
    }
}

removeSnippet('c:/Users/ILHAM/Documents/game/slot.html');
removeSnippet('c:/Users/ILHAM/Documents/game/shop.html');
removeSnippet('c:/Users/ILHAM/Documents/game/history.html');

console.log('Reverted all individual intros successfully!');
