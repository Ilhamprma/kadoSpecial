import { Entity } from './Entity';
import { CANVAS_HEIGHT, ENEMY_SPEED, ENEMY_SIZE } from '../Constants';

export class Enemy extends Entity {
    active: boolean = true;

    constructor(x: number) {
        super(x, -ENEMY_SIZE, ENEMY_SIZE, ENEMY_SIZE);
    }

    update(_deltaTime: number) {
        this.y += ENEMY_SPEED;

        if (this.y > CANVAS_HEIGHT) {
            this.active = false;
            this.markedForDeletion = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#f00'; // Red
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Inner core
        ctx.fillStyle = '#600';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 3, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}
