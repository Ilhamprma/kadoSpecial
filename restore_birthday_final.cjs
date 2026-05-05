const fs = require('fs');

const bdayPath = 'c:/Users/ILHAM/Documents/game/birthday.html';
let content = fs.readFileSync(bdayPath, 'utf8');

// 1. RESTORE CSS
const missingCSS = `
        /* ===== SURPRISE OVERLAY ===== */
        #surpriseOverlay {
            position: fixed; inset: 0; z-index: 10000; pointer-events: none; display: none;
        }
        #surpriseFlash {
            position: absolute; inset: 0; background: #fff; opacity: 0; z-index: 1;
        }
        #surpriseText {
            position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
            opacity: 0; z-index: 5;
        }
        @keyframes surpriseFlash { 0%{opacity:0} 10%{opacity:0.9} 30%{opacity:0} 100%{opacity:0} }
        @keyframes surpriseTextIn { 0%{opacity:0;transform:scale(0.3)} 40%{opacity:1;transform:scale(1.15)} 60%{opacity:1;transform:scale(0.95)} 80%{opacity:1;transform:scale(1.02)} 100%{opacity:1;transform:scale(1)} }
        @keyframes surpriseTextOut { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }

        /* ===== TUTORIAL OVERLAY ===== */
        #tutorialOverlay {
            position: fixed; inset: 0; z-index: 10001; display: none;
            background: rgba(5, 2, 20, 0.92); backdrop-filter: blur(8px);
        }
        .tut-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; }
        .tut-progress { width: 80%; max-width: 400px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 20px; overflow: hidden; }
        .tut-prog-bar { height: 100%; background: linear-gradient(90deg, #48dbfb, #feca57); border-radius: 2px; transition: width 0.5s ease; width: 0; }
        .tut-counter { font-family: 'Press Start 2P', monospace; font-size: 8px; color: #48dbfb; letter-spacing: 3px; margin-bottom: 25px; opacity: 0.6; }
        .tut-card { background: rgba(26, 10, 46, 0.95); border: 2px solid #48dbfb; border-radius: 12px; padding: 35px 30px; max-width: 420px; width: 95%; text-align: center; box-shadow: 0 0 30px rgba(72,219,251,0.15); }
        .tut-emoji { font-size: 60px; margin-bottom: 15px; }
        .tut-title { font-family: 'Press Start 2P', monospace; font-size: 14px; color: #feca57; margin-bottom: 18px; line-height: 1.6; }
        .tut-desc { font-family: 'VT323', monospace; font-size: 24px; color: #e8d5f5; line-height: 1.5; }
        .tut-nav { display: flex; gap: 15px; margin-top: 30px; }
        .tut-btn { font-family: 'Press Start 2P', monospace; font-size: 10px; padding: 12px 22px; border: none; border-radius: 6px; cursor: pointer; transition: 0.3s; }
        .tut-skip { background: transparent; color: #666; border: 1px solid #333; }
        .tut-next { background: linear-gradient(135deg, #e94560, #ff6b6b); color: #fff; }
        @keyframes tutCardIn { 0%{opacity:0;transform:translateY(30px) scale(0.95)} 100%{opacity:1;transform:translateY(0) scale(1)} }
`;

// Insert CSS if not already there
const styleEnd = content.indexOf('</style>');
if (styleEnd !== -1 && !content.includes('#surpriseOverlay')) {
    content = content.substring(0, styleEnd) + missingCSS + content.substring(styleEnd);
}

// 2. RESTORE HTML
const missingHTML = `
    <!-- SURPRISE OVERLAY -->
    <div id="surpriseOverlay">
        <div id="surpriseFlash"></div>
        <div id="surpriseText">
            <div style="background:rgba(10,5,32,0.92);border:3px solid #feca57;border-radius:16px;padding:40px 50px;text-align:center;box-shadow:0 0 40px rgba(254,202,87,0.3);">
                <div style="font-size:60px;margin-bottom:15px;">🎂</div>
                <div style="font-family:'Press Start 2P',monospace;font-size:22px;color:#feca57;line-height:1.8;">HAPPY<br>BIRTHDAY!</div>
                <div style="font-family:'Pacifico',cursive;font-size:28px;color:#ff9ff3;margin-top:15px;">Ms. hanawazain</div>
                <div style="font-family:'VT323',monospace;font-size:18px;color:#48dbfb;margin-top:20px;opacity:0.7;">🎉 21 April 2006 🎉</div>
            </div>
        </div>
        <canvas id="fireworkCanvas" style="position:absolute;inset:0;"></canvas>
    </div>

    <!-- TUTORIAL OVERLAY -->
    <div id="tutorialOverlay">
        <div class="tut-container">
            <div class="tut-progress"><div class="tut-prog-bar" id="tutProgBar"></div></div>
            <div class="tut-counter" id="tutCounter"></div>
            <div class="tut-card" id="tutCard">
                <div class="tut-emoji" id="tutEmoji"></div>
                <div class="tut-title" id="tutTitle"></div>
                <div class="tut-desc" id="tutDesc"></div>
            </div>
            <div class="tut-nav">
                <button class="tut-btn tut-skip" onclick="closeTutorial()">SKIP</button>
                <button class="tut-btn tut-next" id="tutNext" onclick="nextTutorial()">LANJUT ▸</button>
            </div>
        </div>
    </div>
`;

// Insert HTML before script tag
const scriptStart = content.indexOf('<script>');
if (scriptStart !== -1 && !content.includes('id="surpriseOverlay"')) {
    content = content.substring(0, scriptStart) + missingHTML + content.substring(scriptStart);
}

// 3. CLEAN SCRIPT
const scriptContent = `
    <script>
    if (!localStorage.getItem('introDone')) {
        window.location.href = 'intro.html';
    }

    const dilanQuotes = [
        "\\\\\\"alhamdulilah masih dikasih umur s.\\\\\\" 🏆💖",
        "\\\\\\"Umurmu nambah, tapi mukamu tetap kayak bakpao... bulat, lembut, bikin gemes.\\\\\\" 😍😘",
        "\\\\\\"Kalau kamu jadi lilin, aku nggak akan niup kamu. Aku bakal jaga biar apinya nyala terus.\\\\\\" 🕯️🔥",
        "\\\\\\"Kamu tuh kayak WiFi gratisan... bikin aku nggak bisa move on dari sini.\\\\\\" 💻📱💖",
        "\\\\\\"Selamat ulang tahun! Semoga rezekinya lancar, jodohnya deket... ya aku maksudnya.\\\\\\" 😜✨",
        "\\\\\\"Aku rela kok jadi kue ulang tahunmu. Biar kamu potong-potong hatiku... eh, kuenya.\\\\\\" 🎂❤️",
        "\\\\\\"Tambah tua gapapa, yang penting jangan tambah jauh dariku. Aku bisa nangis beneran.\\\\\\" 😤😢💖",
        "\\\\\\"Kamu nanya apa hadiahnya? Hadiahnya aku. Gratis. Tanpa ongkir. Nggak bisa diretur.\\\\\\" 🎁😜💍"
    ];

    let currentQuote = 0;
    let typeTimer = null;

    function typeQuote(text, callback) {
        const el = document.getElementById('quoteText'); if (!el) return;
        el.textContent = ''; let i = 0; clearInterval(typeTimer);
        typeTimer = setInterval(() => {
            if (i < text.length) { el.textContent += text[i]; i++; }
            else { clearInterval(typeTimer); if (callback) callback(); }
        }, 55);
    }

    function updateDots() {
        const dotContainer = document.getElementById('dotIndicators'); if (!dotContainer) return;
        const dots = dotContainer.querySelectorAll('.dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === currentQuote));
    }

    function goToQuote(index) {
        currentQuote = index; updateDots(); typeQuote(dilanQuotes[currentQuote]); resetAutoPlay();
    }

    function changeQuote(dir) {
        currentQuote = (currentQuote + dir + dilanQuotes.length) % dilanQuotes.length;
        updateDots(); typeQuote(dilanQuotes[currentQuote]); resetAutoPlay();
    }

    let autoPlayTimer = null;
    function startAutoPlay() { autoPlayTimer = setInterval(() => { currentQuote = (currentQuote + 1) % dilanQuotes.length; updateDots(); typeQuote(dilanQuotes[currentQuote]); }, 20000); }
    function resetAutoPlay() { clearInterval(autoPlayTimer); startAutoPlay(); }

    function launchFireworks(){
        const canvas=document.getElementById('fireworkCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;
        const particles=[],colors=['#feca57','#e94560','#ff9ff3','#48dbfb','#fff','#10ac84','#ff6b6b','#0abde3'];
        function burst(x,y,count){for(let i=0;i<count;i++){const angle=(Math.PI*2/count)*i+(Math.random()-0.5)*0.3,speed=3+Math.random()*5;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,decay:0.012+Math.random()*0.008,size:2+Math.random()*3,color:colors[Math.floor(Math.random()*colors.length)]})}}
        const W=canvas.width,H=canvas.height;
        setTimeout(()=>burst(W*0.5,H*0.35,60),0);setTimeout(()=>burst(W*0.25,H*0.3,45),300);setTimeout(()=>burst(W*0.75,H*0.3,45),500);
        setTimeout(()=>burst(W*0.4,H*0.5,35),700);setTimeout(()=>burst(W*0.6,H*0.45,35),900);setTimeout(()=>burst(W*0.5,H*0.25,50),1100);
        (function draw(){ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(0,0,W,H);for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.06;p.vx*=0.99;p.life-=p.decay;if(p.life<=0){particles.splice(i,1);continue}ctx.save();ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fillStyle=p.color;ctx.shadowBlur=12;ctx.shadowColor=p.color;ctx.fill();ctx.restore()}if(particles.length>0)requestAnimationFrame(draw);else ctx.clearRect(0,0,W,H)})();
    }

    const tutSlides=[
        {emoji:'🎉',title:'SELAMAT DATANG!',desc:'Ini adalah dunia virtualmu yang spesial! Di sini ada banyak hal seru. Yuk kenalan dengan fitur-fiturnya!'},
        {emoji:'🎰',title:'MESIN SLOT',desc:'Putar mesin slot dan coba keberuntunganmu! Dapatkan koin sebanyak-banyaknya. Siapa tahu kamu jackpot!'},
        {emoji:'🛍️',title:'TOKO HADIAH',desc:'Belanjakan koinmu di sini! Beli hadiah virtual yang lucu-lucu dan koleksinya muncul di rak kartu ucapanmu.'},
        {emoji:'📜',title:'HALAMAN SEJARAH',desc:'Pelajari peristiwa bersejarah di tanggal 21 April. Dari Titanic sampai kelahiran seseorang yang spesial!'},
        {emoji:'💌',title:'KARTU UCAPAN',desc:'Dan inilah kartu ucapan spesial untukmu! Baca pesan dari seseorang yang sangat menyayangimu.'}
    ];
    let tutIdx=0;
    function startTutorial(){tutIdx=0;document.getElementById('tutorialOverlay').style.display='block';renderTutSlide();}
    function renderTutSlide(){
        const card=document.getElementById('tutCard');card.style.animation='none';void card.offsetWidth;card.style.animation='tutCardIn 0.5s ease-out';
        const s=tutSlides[tutIdx];document.getElementById('tutEmoji').textContent=s.emoji;document.getElementById('tutTitle').textContent=s.title;document.getElementById('tutDesc').textContent=s.desc;
        document.getElementById('tutCounter').textContent='[ ' + (tutIdx+1) + ' / ' + tutSlides.length + ' ]';document.getElementById('tutProgBar').style.width=((tutIdx+1)/tutSlides.length*100)+'%';
        const btn=document.getElementById('tutNext');if(tutIdx===tutSlides.length-1){btn.textContent='MULAI! ✨';btn.style.background='linear-gradient(135deg,#10ac84,#0abde3)'}else{btn.textContent='LANJUT ▸';btn.style.background='linear-gradient(135deg,#e94560,#ff6b6b)'}
    }
    function nextTutorial(){tutIdx++;if(tutIdx<tutSlides.length)renderTutSlide();else closeTutorial();}
    function closeTutorial(){
        const o=document.getElementById('tutorialOverlay');o.style.transition='opacity 0.5s ease';o.style.opacity='0';
        setTimeout(()=>{
            o.style.display='none'; localStorage.setItem('tutorialDone','true');
            const wrapper=document.querySelector('.card-container');
            if(wrapper){ wrapper.style.display='flex'; wrapper.style.opacity='0'; setTimeout(()=>wrapper.style.opacity='1',50); }
        },500);
    }

    function updateNavCoins() {
        let savedCoins = localStorage.getItem('slotCoins');
        let coinAmt = savedCoins !== null ? parseInt(savedCoins, 10) : 999;
        const display = document.getElementById('navCoinDisplay');
        if (display) display.textContent = isNaN(coinAmt) ? 999 : coinAmt;
    }

    function renderShelf() {
        const grid = document.getElementById('shelfGrid'); if (!grid) return;
        const INV_MAP = {
            'virtual_rose': { emoji: '🌹', name: 'Mawar Virtual'}, 'love_letter': { emoji: '💌', name: 'Surat Cinta'},
            'teddy_bear': { emoji: '🧸', name: 'Teddy Bear' }, 'chocolate': { emoji: '🍫', name: 'Coklat Spesial' },
            'star_wish': { emoji: '⭐', name: 'Bintang Harapan' }, 'crown': { emoji: '👑', name: 'Mahkota Ratu' },
            'diamond_ring': { emoji: '💍', name: 'Cincin Berlian' }, 'music_box': { emoji: '🎵', name: 'Kotak Musik' },
            'lucky_clover': { emoji: '🍀', name: 'Semanggi Beruntung' }, 'perfume': { emoji: '🌸', name: 'Parfum Sakura' },
            'galaxy_ticket': { emoji: '🎫', name: 'Tiket ke Galaxy' }, 'eternal_heart': { emoji: '💖', name: 'Hati Abadi' }
        };
        const savedItems = JSON.parse(localStorage.getItem('shopInventory')) || [];
        grid.innerHTML = '';
        if (savedItems.length === 0) { grid.innerHTML = '<div class="shelf-empty">Rak masih kosong...</div>'; }
        else {
            savedItems.forEach(id => {
                const item = INV_MAP[id];
                if (item) {
                    const el = document.createElement('div'); el.className = 'shelf-item';
                    el.innerHTML = '<span class="shelf-emoji">' + item.emoji + '</span><span class="shelf-name">' + item.name + '</span>';
                    grid.appendChild(el);
                }
            });
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        updateNavCoins(); renderShelf(); typeQuote(dilanQuotes[0]); startAutoPlay();
        const dotContainer = document.getElementById('dotIndicators');
        if(dotContainer){ dilanQuotes.forEach((_, i) => { const dot = document.createElement('div'); dot.className = 'dot' + (i === 0 ? ' active' : ''); dot.onclick = () => goToQuote(i); dotContainer.appendChild(dot); }); }
        const starsContainer = document.getElementById('stars');
        if(starsContainer){ for (let i = 0; i < 70; i++) { const s = document.createElement('div'); s.className = 'star'; s.style.left = Math.random() * 100 + '%'; s.style.top = Math.random() * 55 + '%'; s.style.animationDelay = Math.random() * 3 + 's'; starsContainer.appendChild(s); } }
        const createPixelBorder = (id) => {
            const container = document.getElementById(id); if (!container) return;
            for (let i = 0; i < 28; i++) { const b = document.createElement('div'); b.className = 'pixel-block'; b.style.backgroundColor = ['#e94560','#feca57','#ff9ff3','#48dbfb'][i%4]; b.style.animationDelay = (i * 0.08) + 's'; container.appendChild(b); }
        };
        createPixelBorder('pixelTop'); createPixelBorder('pixelBottom');
        const bgm = document.getElementById('bgm'); const bgmBtn = document.getElementById('bgmToggle');
        if (bgm && bgmBtn) {
            bgm.volume = 0.4; let isMuted = localStorage.getItem('bgmMuted') === 'true'; bgm.muted = isMuted;
            const updateIcon = () => { document.getElementById('bgmIcon').textContent = (bgm.muted || bgm.paused) ? '🔇' : '🔊'; };
            bgmBtn.onclick = () => { bgm.muted = !bgm.muted; if(!bgm.muted && bgm.paused) bgm.play(); localStorage.setItem('bgmMuted', bgm.muted); updateIcon(); };
            bgm.play().then(updateIcon).catch(() => { document.body.addEventListener('click', () => bgm.play().then(updateIcon), { once: true }); });
        }
        if (localStorage.getItem('triggerSurprise') === 'true') {
            localStorage.removeItem('triggerSurprise'); const wrapper = document.querySelector('.card-container'); if (wrapper) wrapper.style.display = 'none';
            const surprise = document.getElementById('surpriseOverlay');
            if (surprise) {
                surprise.style.display = 'block'; const sf = document.getElementById('surpriseFlash'); if(sf) sf.style.animation='surpriseFlash 0.8s ease-out forwards';
                launchFireworks();
                setTimeout(() => { const st = document.getElementById('surpriseText'); if (st) st.style.animation = 'surpriseTextIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards'; }, 400);
                setTimeout(() => { const st = document.getElementById('surpriseText'); if (st) st.style.animation = 'surpriseTextOut 0.6s ease-in forwards'; }, 3500);
                setTimeout(() => { surprise.style.display = 'none'; if (!localStorage.getItem('tutorialDone')) startTutorial(); else if (wrapper) { wrapper.style.display = 'flex'; wrapper.style.opacity = '1'; } }, 4200);
            }
        } else if (!localStorage.getItem('tutorialDone')) { const wrapper = document.querySelector('.card-container'); if (wrapper) wrapper.style.display = 'none'; startTutorial(); }
    });
    window.addEventListener('storage', (e) => { if (e.key === 'slotCoins') updateNavCoins(); if (e.key === 'shopInventory') renderShelf(); });
    </script>
`;

// REPLACE ENTIRE SCRIPT SECTION
const existingScriptStart = content.lastIndexOf('<script>');
const existingScriptEnd = content.lastIndexOf('</script>');
if(existingScriptStart !== -1 && existingScriptEnd !== -1){
    content = content.substring(0, existingScriptStart) + scriptContent + content.substring(existingScriptEnd + 9);
}

fs.writeFileSync(bdayPath, content, 'utf8');
console.log('Birthday.html fully restored and cleaned.');
