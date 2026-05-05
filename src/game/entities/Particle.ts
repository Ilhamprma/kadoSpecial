import { Entity } from './Entity';

export class Particle extends Entity {
    vx: number;
    vy: number;
    life: number = 1.0;
    decay: number;
    color: string;

    constructor(x: number, y: number, color: string) {
        super(x, y, 2, 2);
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.decay = Math.random() * 0.05 + 0.02;
        this.color = color;
    }

    update(_deltaTime: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;

        if (this.life <= 0) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;
    }
}
