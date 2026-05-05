const fs = require('fs');

const bdayPath = 'c:/Users/ILHAM/Documents/game/birthday.html';
let content = fs.readFileSync(bdayPath, 'utf8');

// We want to replace everything between <script> and </script>
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>');

if (scriptStart === -1 || scriptEnd === -1) {
    console.error('Could not find script tags');
    process.exit(1);
}

const cleanScript = `
    <script>
    // SECURITY CHECK: Must finish intro first before seeing the card
    if (!localStorage.getItem('introDone')) {
        window.location.href = 'intro.html';
    }

    // ===== Quirky romantic quotes =====
    const dilanQuotes = [
        "\\"Aku nggak jago masak, nggak bisa nyetir, tapi kalau disuruh sayang kamu... aku juara dunia.\\" 🏆💖",
        "\\"Umurmu nambah, tapi mukamu tetap kayak bakpao... bulat, lembut, bikin gemes.\\" 😍😘",
        "\\"Kalau kamu jadi lilin, aku nggak akan niup kamu. Aku bakal jaga biar apinya nyala terus.\\" 🕯️🔥",
        "\\"Kamu tuh kayak WiFi gratisan... bikin aku nggak bisa move on dari sini.\\" 💻📱💖",
        "\\"Selamat ulang tahun! Semoga rezekinya lancar, jodohnya deket... ya aku maksudnya.\\" 😜✨",
        "\\"Aku rela kok jadi kue ulang tahunmu. Biar kamu potong-potong hatiku... eh, kuenya.\\" 🎂❤️",
        "\\"Tambah tua gapapa, yang penting jangan tambah jauh dariku. Aku bisa nangis beneran.\\" 😤😢💖",
        "\\"Kamu nanya apa hadiahnya? Hadiahnya aku. Gratis. Tanpa ongkir. Nggak bisa diretur.\\" 🎁😜💍"
    ];

    let currentQuote = 0;
    let typeTimer = null;

    function typeQuote(text, callback) {
        const el = document.getElementById('quoteText');
        if (!el) return;
        el.textContent = '';
        let i = 0;
        clearInterval(typeTimer);
        typeTimer = setInterval(() => {
            if (i < text.length) {
                el.textContent += text[i];
                i++;
            } else {
                clearInterval(typeTimer);
                if (callback) callback();
            }
        }, 55);
    }

    function updateDots() {
        const dotContainer = document.getElementById('dotIndicators');
        if (!dotContainer) return;
        const dots = dotContainer.querySelectorAll('.dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === currentQuote));
    }

    function goToQuote(index) {
        currentQuote = index;
        updateDots();
        typeQuote(dilanQuotes[currentQuote]);
        resetAutoPlay();
    }

    function changeQuote(dir) {
        currentQuote = (currentQuote + dir + dilanQuotes.length) % dilanQuotes.length;
        updateDots();
        typeQuote(dilanQuotes[currentQuote]);
        resetAutoPlay();
    }

    let autoPlayTimer = null;
    function startAutoPlay() {
        autoPlayTimer = setInterval(() => {
            currentQuote = (currentQuote + 1) % dilanQuotes.length;
            updateDots();
            typeQuote(dilanQuotes[currentQuote]);
        }, 20000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // Fireworks Logic
    function launchFireworks() {
        const canvas = document.getElementById('fireworkCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const particles = [];
        const colors = ['#feca57', '#e94560', '#ff9ff3', '#48dbfb', '#fff', '#10ac84', '#ff6b6b', '#0abde3'];
        
        function burst(x, y, count) {
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.3;
                const speed = 3 + Math.random() * 5;
                particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    decay: 0.012 + Math.random() * 0.008,
                    size: 2 + Math.random() * 3,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        }

        const W = canvas.width, H = canvas.height;
        setTimeout(() => burst(W * 0.5, H * 0.35, 60), 0);
        setTimeout(() => burst(W * 0.25, H * 0.3, 45), 300);
        setTimeout(() => burst(W * 0.75, H * 0.3, 45), 500);
        setTimeout(() => burst(W * 0.4, H * 0.5, 35), 700);
        setTimeout(() => burst(W * 0.6, H * 0.45, 35), 900);
        setTimeout(() => burst(W * 0.5, H * 0.25, 50), 1100);

        (function draw() {
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.fillRect(0, 0, W, H);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.99; p.life -= p.decay;
                if (p.life <= 0) { particles.splice(i, 1); continue; }
                ctx.save();
                ctx.globalAlpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.restore();
            }
            if (particles.length > 0) requestAnimationFrame(draw);
            else ctx.clearRect(0, 0, W, H);
        })();
    }

    // Tutorial Slideshow Logic
    const tutSlides = [
        { emoji: '🎉', title: 'SELAMAT DATANG!', desc: 'Ini adalah dunia virtualmu yang spesial! Di sini ada banyak hal seru. Yuk kenalan dengan fitur-fiturnya!' },
        { emoji: '🎰', title: 'MESIN SLOT', desc: 'Putar mesin slot dan coba keberuntunganmu! Dapatkan koin sebanyak-banyaknya. Siapa tahu kamu jackpot!' },
        { emoji: '🛍️', title: 'TOKO HADIAH', desc: 'Belanjakan koinmu di sini! Beli hadiah virtual yang lucu-lucu dan koleksinya muncul di rak kartu ucapanmu.' },
        { emoji: '📜', title: 'HALAMAN SEJARAH', desc: 'Pelajari peristiwa bersejarah di tanggal 21 April. Dari Titanic sampai kelahiran seseorang yang spesial!' },
        { emoji: '💌', title: 'KARTU UCAPAN', desc: 'Dan inilah kartu ucapan spesial untukmu! Baca pesan dari seseorang yang sangat menyayangimu.' }
    ];
    let tutIdx = 0;

    function startTutorial() {
        tutIdx = 0;
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.style.display = 'block';
        renderTutSlide();
    }

    function renderTutSlide() {
        const card = document.getElementById('tutCard');
        if (!card) return;
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'tutCardIn 0.5s ease-out';
        
        const s = tutSlides[tutIdx];
        document.getElementById('tutEmoji').textContent = s.emoji;
        document.getElementById('tutTitle').textContent = s.title;
        document.getElementById('tutDesc').textContent = s.desc;
        document.getElementById('tutCounter').textContent = \`[ \${tutIdx + 1} / \${tutSlides.length} ]\`;
        document.getElementById('tutProgBar').style.width = ((tutIdx + 1) / tutSlides.length * 100) + '%';
        
        const btn = document.getElementById('tutNext');
        if (tutIdx === tutSlides.length - 1) {
            btn.textContent = 'MULAI! ✨';
            btn.style.background = 'linear-gradient(135deg,#10ac84,#0abde3)';
        } else {
            btn.textContent = 'LANJUT ▸';
            btn.style.background = 'linear-gradient(135deg,#e94560,#ff6b6b)';
        }
    }

    function nextTutorial() {
        tutIdx++;
        if (tutIdx < tutSlides.length) renderTutSlide();
        else closeTutorial();
    }

    function closeTutorial() {
        const o = document.getElementById('tutorialOverlay');
        if (o) {
            o.style.transition = 'opacity 0.5s ease';
            o.style.opacity = '0';
            setTimeout(() => {
                o.style.display = 'none';
                localStorage.setItem('tutorialDone', 'true');
                const wrapper = document.querySelector('.card-container');
                if (wrapper) {
                    wrapper.style.display = 'flex';
                    wrapper.style.opacity = '0';
                    setTimeout(() => wrapper.style.opacity = '1', 50);
                }
            }, 500);
        }
    }

    function renderShelf() {
        const grid = document.getElementById('shelfGrid');
        if (!grid) return;
        const INVENTORY_MAP = {
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
        };
        const savedItems = JSON.parse(localStorage.getItem('shopInventory')) || [];
        grid.innerHTML = '';
        if (savedItems.length === 0) {
            grid.innerHTML = '<div class="shelf-empty">Rak masih kosong...<br><br>Beli di Shop yuk! 🛍️</div>';
        } else {
            savedItems.forEach(id => {
                const itemData = INVENTORY_MAP[id];
                if (itemData) {
                    const el = document.createElement('div');
                    el.className = 'shelf-item';
                    el.innerHTML = \`<span class="shelf-emoji">\${itemData.emoji}</span><span class="shelf-name">\${itemData.name}</span>\`;
                    grid.appendChild(el);
                }
            });
        }
    }

    function updateNavCoins() {
        let savedCoins = localStorage.getItem('slotCoins');
        let coinAmt = savedCoins !== null ? parseInt(savedCoins, 10) : 999;
        const display = document.getElementById('navCoinDisplay');
        if (display) display.textContent = isNaN(coinAmt) ? 999 : coinAmt;
    }

    // MAIN DOM LOAD
    window.addEventListener('DOMContentLoaded', () => {
        // Initial setup
        updateNavCoins();
        renderShelf();
        typeQuote(dilanQuotes[0]);
        startAutoPlay();

        // Dots for quotes
        const dotContainer = document.getElementById('dotIndicators');
        if (dotContainer) {
            dilanQuotes.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.onclick = () => goToQuote(i);
                dotContainer.appendChild(dot);
            });
        }

        // Stars & Confetti
        const starsContainer = document.getElementById('stars');
        if (starsContainer) {
            for (let i = 0; i < 70; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 55 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(star);
            }
        }
        const confettiContainer = document.getElementById('confetti');
        if (confettiContainer) {
            const colors = ['#e94560', '#feca57', '#ff9ff3', '#48dbfb'];
            for (let i = 0; i < 35; i++) {
                const c = document.createElement('div');
                c.className = 'confetti';
                c.textContent = ['■', '●', '▲', '♦', '★'][Math.floor(Math.random() * 5)];
                c.style.left = Math.random() * 100 + '%';
                c.style.color = colors[Math.floor(Math.random() * colors.length)];
                c.style.animationDuration = (4 + Math.random() * 6) + 's';
                confettiContainer.appendChild(c);
            }
        }

        // Pixel borders
        const createPixelBorder = (id) => {
            const container = document.getElementById(id);
            if (!container) return;
            for (let i = 0; i < 28; i++) {
                const b = document.createElement('div');
                b.className = 'pixel-block';
                b.style.backgroundColor = ['#e94560', '#feca57', '#ff9ff3', '#48dbfb'][i % 4];
                b.style.animationDelay = (i * 0.08) + 's';
                container.appendChild(b);
            }
        };
        createPixelBorder('pixelTop');
        createPixelBorder('pixelBottom');

        // BGM Logic
        const bgm = document.getElementById('bgm');
        const bgmBtn = document.getElementById('bgmToggle');
        if (bgm && bgmBtn) {
            bgm.volume = 0.4;
            let isMuted = localStorage.getItem('bgmMuted') === 'true';
            bgm.muted = isMuted;
            const updateBgmIcon = () => {
                document.getElementById('bgmIcon').textContent = (bgm.muted || bgm.paused) ? '🔇' : '🔊';
            };
            bgmBtn.onclick = () => {
                bgm.muted = !bgm.muted;
                if (!bgm.muted && bgm.paused) bgm.play();
                localStorage.setItem('bgmMuted', bgm.muted);
                updateBgmIcon();
            };
            bgm.play().then(updateBgmIcon).catch(() => {
                document.body.addEventListener('click', () => bgm.play().then(updateBgmIcon), { once: true });
            });
        }

        // SURPRISE FLOW
        if (localStorage.getItem('triggerSurprise') === 'true') {
            localStorage.removeItem('triggerSurprise');
            const wrapper = document.querySelector('.card-container');
            if (wrapper) wrapper.style.display = 'none';
            const surprise = document.getElementById('surpriseOverlay');
            if (surprise) {
                surprise.style.display = 'block';
                launchFireworks();
                setTimeout(() => {
                    const st = document.getElementById('surpriseText');
                    if (st) st.style.animation = 'surpriseTextIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards';
                }, 400);
                setTimeout(() => {
                    const st = document.getElementById('surpriseText');
                    if (st) st.style.animation = 'surpriseTextOut 0.6s ease-in forwards';
                }, 3500);
                setTimeout(() => {
                    surprise.style.display = 'none';
                    if (!localStorage.getItem('tutorialDone')) startTutorial();
                    else if (wrapper) {
                        wrapper.style.display = 'flex';
                        wrapper.style.opacity = '1';
                    }
                }, 4200);
            }
        } else if (!localStorage.getItem('tutorialDone')) {
            const wrapper = document.querySelector('.card-container');
            if (wrapper) wrapper.style.display = 'none';
            startTutorial();
        }
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'slotCoins') updateNavCoins();
        if (e.key === 'shopInventory') renderShelf();
    });
    </script>
`;

content = content.substring(0, scriptStart) + cleanScript + content.substring(scriptEnd + 9);

fs.writeFileSync(bdayPath, content, 'utf8');
console.log('Birthday.html fully reconstructed and cleaned.');
