import { Entity } from './Entity';
import { PROJECTILE_SPEED, PROJECTILE_SIZE } from '../Constants';

export class Projectile extends Entity {
    active: boolean = true;

    constructor(x: number, y: number) {
        super(x, y, PROJECTILE_SIZE, PROJECTILE_SIZE * 2);
    }

    update(_deltaTime: number) {
        this.y -= PROJECTILE_SPEED;
        if (this.y + this.height < 0) {
            this.active = false;
            this.markedForDeletion = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
