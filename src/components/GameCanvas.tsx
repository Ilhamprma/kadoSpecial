import { useRef, useEffect, useState } from 'react';
import { Engine } from '../game/Engine';

const GameCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize Game Engine
        engineRef.current = new Engine(
            canvasRef.current,
            (newScore) => setScore(newScore),
            (isGameOver) => setGameOver(isGameOver)
        );
        engineRef.current.start();

        return () => {
            engineRef.current?.stop();
        };
    }, []);

    const handleRestart = () => {
        engineRef.current?.start();
        // The start method resets the game state internally and calls callbacks
    };

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                ref={canvasRef}
                style={{ border: '2px solid #333', boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' }}
            />

            {/* HUD */}
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'Courier New', fontSize: '24px', fontWeight: 'bold' }}>
                Score: {score}
            </div>

            {/* Game Over Screen */}
            {gameOver && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',
                    color: 'white', fontFamily: 'Courier New'
                }}>
                    <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', textShadow: '0 0 10px red' }}>GAME OVER</h1>
                    <p style={{ fontSize: '24px' }}>Final Score: {score}</p>
                    <button
                        onClick={handleRestart}
                        style={{
                            marginTop: '20px', padding: '10px 30px', fontSize: '20px',
                            cursor: 'pointer', background: 'transparent', color: '#0ff',
                            border: '2px solid #0ff', borderRadius: '5px'
                        }}
                    >
                        RESTART
                    </button>
                    <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.7 }}>or press Enter</p>
                </div>
            )}
        </div>
    );
};

export default GameCanvas;
