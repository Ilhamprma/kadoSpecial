import React from 'react';
import './Slides.css';

interface ProgressBarProps {
    total: number;
    current: number;
    onDotClick: (index: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, current, onDotClick }) => {
    const fillPercent = (current / (total - 1)) * 100;

    return (
        <div className="progress-bar">
            <div className="progress-line">
                <div className="progress-fill" style={{ width: `${fillPercent}%` }}></div>
            </div>
            {Array.from({ length: total }, (_, i) => (
                <div
                    key={i}
                    className={`progress-dot ${i === current ? 'active' : ''} ${i < current ? 'visited' : ''}`}
                    onClick={() => onDotClick(i)}
                />
            ))}
        </div>
    );
};

export default ProgressBar;
