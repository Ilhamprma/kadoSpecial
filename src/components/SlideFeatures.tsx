import React from 'react';
import './Slides.css';

const features = [
    {
        icon: '⚡',
        title: 'Lightning Fast',
        desc: 'Optimized for performance. Your site loads in milliseconds, not seconds.'
    },
    {
        icon: '🎨',
        title: 'Pixel Perfect',
        desc: 'Every detail matters. Craft designs that look stunning on every device.'
    },
    {
        icon: '🔒',
        title: 'Secure by Default',
        desc: 'Enterprise-grade security baked in from the ground up. Sleep easy.'
    },
    {
        icon: '🌍',
        title: 'Global Scale',
        desc: 'Deploy to 200+ edge locations. Your users get the fastest experience, anywhere.'
    },
    {
        icon: '🧩',
        title: 'Modular Design',
        desc: 'Mix and match components to build exactly what you need. No bloat.'
    },
    {
        icon: '📊',
        title: 'Analytics Built-in',
        desc: 'Understand your users with real-time insights and conversion tracking.'
    }
];

const SlideFeatures: React.FC = () => {
    return (
        <>
            {/* Ambient Moving Grid */}
            <div className="ambient-grid"></div>

            <div className="features-content">
                <h2>Everything you need</h2>
                <p>Powerful tools to build the next generation of web experiences.</p>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div className="feature-card" key={i}>
                            <div className="feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SlideFeatures;
