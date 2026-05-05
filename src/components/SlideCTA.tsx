import React from 'react';
import './Slides.css';

const SlideCTA: React.FC = () => {
    return (
        <>
            {/* Ambient Glowing Bokeh */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>

            <div className="cta-content">
                <h2>
                    Ready to build<br />
                    something <span className="text-coral">incredible</span>?
                </h2>
                <p>
                    Join thousands of creators who are already pushing the boundaries
                    of what's possible on the web.
                </p>
                <button className="btn-cta-big">Get Started — It's Free</button>
            </div>
        </>
    );
};

export default SlideCTA;
