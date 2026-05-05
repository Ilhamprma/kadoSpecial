import React, { useState } from 'react';
import './Slides.css';

const SlideHero: React.FC = () => {
    const [broken, setBroken] = useState(false);

    return (
        <div className="hero-split">
            {/* Left Panel — Light */}
            <div className={`hero-left ${broken ? 'broken' : ''}`}>
                <div className="hero-left-content">
                    <h2>Click to</h2>
                    <button className="break-btn" onClick={() => setBroken(!broken)}>
                        Break
                    </button>
                </div>
                {/* Decorative triangle */}
                <div className={`hero-triangle ${broken ? 'expanded' : ''}`}></div>
            </div>

            {/* Right Panel — Dark */}
            <div className="hero-right">
                {/* Ambient Background Orbs */}
                <div className="ambient-orb orb-1"></div>
                <div className="ambient-orb orb-2"></div>
                <div className="ambient-orb orb-3"></div>

                <h1>
                    <span className="highlight">the future</span><br />
                    is now.
                </h1>
                <p>
                    Build stunning interactive experiences without limits.
                    No code required, just pure creativity.
                </p>
            </div>
        </div>
    );
};

export default SlideHero;
