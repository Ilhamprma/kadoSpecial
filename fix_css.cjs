const fs = require('fs');

let f = fs.readFileSync('c:/Users/ILHAM/Documents/game/history.html', 'utf8');

// fix .intro-text
f = f.replace(/\.intro-text\s*\{[\s\S]*?\}/, `.intro-text {
            font-size: 24px;
            color: #e8d5f5;
            max-width: 650px;
            margin: 20px auto 10px;
            line-height: 1.6;
            text-shadow: 0 0 8px rgba(233, 69, 96, 0.3);
            text-wrap: balance;
        }`);

// fix .fact-card
f = f.replace(/\.fact-card\s*\{[\s\S]*?\}/, `.fact-card {
            position: relative;
            margin: 0 auto 35px;
            padding: 25px 30px;
            background: rgba(26, 10, 46, 0.6);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(72, 219, 251, 0.3);
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            opacity: 0;
            transform: translateY(50px) scale(0.95);
        }`);

// fix .fact-card.legend-card
f = f.replace(/\.fact-card\.legend-card\s*\{[\s\S]*?\}/, `.fact-card.legend-card {
            width: 100%;
            max-width: 650px;
            background: linear-gradient(135deg, rgba(233, 69, 96, 0.3), rgba(255, 159, 243, 0.3));
            border: 3px solid #feca57;
            box-shadow: 0 0 30px rgba(254, 202, 87, 0.4);
            margin-top: 50px;
        }`);

// fix .fact-emoji
f = f.replace(/\.fact-emoji\s*\{[\s\S]*?\}/, `.fact-emoji {
            font-size: 32px;
            float: right;
            margin-left: 10px;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4));
        }`);

// fix .fact-desc
f = f.replace(/\.fact-desc\s*\{[\s\S]*?\}/, `.fact-desc {
            font-size: 20px;
            color: #c8b6d8;
            line-height: 1.5;
            text-wrap: balance;
        }`);

// fix .fact-fun
f = f.replace(/\.fact-fun\s*\{[\s\S]*?\}/, `.fact-fun {
            margin-top: 12px;
            font-size: 18px;
            color: #feca57;
            font-style: italic;
            opacity: 0.85;
            text-wrap: balance;
        }`);

// fix .footer-quote
f = f.replace(/\.footer-quote\s*\{[\s\S]*?\}/, `.footer-quote {
            text-align: center;
            padding: 40px 20px 25px;
            position: relative;
            z-index: 10;
        }`);

fs.writeFileSync('c:/Users/ILHAM/Documents/game/history.html', f, 'utf8');
console.log('CSS optimized!');
