import { InputHandler } from './Input';
import { CANVAS_WIDTH, CANVAS_HEIGHT, ENEMY_SPAWN_RATE, ENEMY_SIZE } from './Constants';
import { Player } from './entities/Player';
import { Projectile } from './entities/Projectile';
import { Enemy } from './entities/Enemy';
import { Entity } from './entities/Entity';
import { Particle } from './entities/Particle';

function checkCollision(rect1: Entity, rect2: Entity) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

export class Engine {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    input: InputHandler;
    player: Player;
    projectiles: Projectile[] = [];
    enemies: Enemy[] = [];
    particles: Particle[] = [];
    enemyTimer: number = 0;

    score: number = 0;
    gameOver: boolean = false;

    isRunning: boolean = false;
    animationId: number = 0;
    lastTime: number = 0;

    onScoreChange: (score: number) => void;
    onGameOver: (gameOver: boolean) => void;

    constructor(
        canvas: HTMLCanvasElement,
        onScoreChange: (score: number) => void,
        onGameOver: (gameOver: boolean) => void
    ) {
        this.canvas = canvas;
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.onScoreChange = onScoreChange;
        this.onGameOver = onGameOver;

        const context = this.canvas.getContext('2d');
        if (!context) throw new Error("Could not get 2D context");
        this.ctx = context;

        this.input = new InputHandler();
        this.player = new Player(this.input);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.reset();
        this.onGameOver(false);
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    reset() {
        this.player = new Player(this.input);
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.gameOver = false;
        this.enemyTimer = 0;
        this.onScoreChange(0);
        this.onGameOver(false);
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        this.input.cleanup();
    }

    loop = (timestamp: number) => {
        if (!this.isRunning) return;

        const deltaTime = (timestamp - this.lastTime);
        this.lastTime = timestamp;

        if (!this.gameOver) {
            this.update(deltaTime, timestamp);
        } else {
            if (this.input.isDown('Enter')) {
                this.reset();
            }
        }
        this.draw();

        this.animationId = requestAnimationFrame(this.loop);
    }

    createExplosion(x: number, y: number, color: string, count: number) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    update(deltaTime: number, timestamp: number) {
        this.player.update(deltaTime);

        // Player shooting
        const projectile = this.player.shoot(timestamp);
        if (projectile) {
            this.projectiles.push(projectile);
        }

        // Projectiles
        this.projectiles.forEach(p => p.update(deltaTime));
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        // Enemies
        if (this.enemyTimer > ENEMY_SPAWN_RATE * 16) {
            this.enemies.push(new Enemy(Math.random() * (CANVAS_WIDTH - ENEMY_SIZE)));
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }

        this.enemies.forEach(e => e.update(deltaTime));
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // Particles
        this.particles.forEach(p => p.update(deltaTime));
        this.particles = this.particles.filter(p => !p.markedForDeletion);

        // Collision Detection
        this.projectiles.forEach(p => {
            this.enemies.forEach(e => {
                if (!p.markedForDeletion && !e.markedForDeletion && checkCollision(p, e)) {
                    p.markedForDeletion = true;
                    e.markedForDeletion = true;
                    this.score += 10;
                    this.onScoreChange(this.score);
                    this.createExplosion(e.x + e.width / 2, e.y + e.height / 2, '#f00', 10);
                }
            });
        });

        this.enemies.forEach(e => {
            if (!e.markedForDeletion && checkCollision(this.player, e)) {
                this.gameOver = true;
                this.onGameOver(true);
                this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#0ff', 30);
            }
        });
    }

    draw() {
        // Clear screen
        this.ctx.fillStyle = '#000010';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Starfield
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 20; i++) {
            // Using a simple pseudo-random based on time would flicker, needs persistent stars. 
            // For now just random static noise
            this.ctx.fillRect(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, 1, 1);
        }

        this.particles.forEach(p => p.draw(this.ctx));

        if (!this.gameOver) this.player.draw(this.ctx);

        this.projectiles.forEach(p => p.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
    }
}
