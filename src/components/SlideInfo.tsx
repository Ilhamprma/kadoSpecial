import React from 'react';
import './Slides.css';

const SlideInfo: React.FC = () => {
    const letters = "IMAGINE".split("");

    return (
        <div className="imagine-container">
            {/* Ambient Background Rings */}
            <div className="pulse-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
            </div>

            <div className="imagine-text">
                {letters.map((letter, i) => (
                    <span
                        key={i}
                        className="imagine-letter"
                        style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                    >
                        {letter}
                    </span>
                ))}
            </div>

            <div className="imagine-subtitle">
                a multilingual Webflow site,<br />
                without coding
            </div>
        </div>
    );
};

export default SlideInfo;
