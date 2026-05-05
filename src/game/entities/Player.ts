import { Entity } from './Entity';
import { InputHandler } from '../Input';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SPEED, PLAYER_SIZE } from '../Constants';
import { Projectile } from './Projectile';

export class Player extends Entity {
    input: InputHandler;
    lastShot: number = 0;
    shotInterval: number = 200; // ms

    constructor(input: InputHandler) {
        super(CANVAS_WIDTH / 2 - PLAYER_SIZE / 2, CANVAS_HEIGHT - PLAYER_SIZE * 2, PLAYER_SIZE, PLAYER_SIZE);
        this.input = input;
    }

    update(_deltaTime: number) {
        // Keyboard Movement
        if (this.input.isDown('ArrowUp') || this.input.isDown('KeyW')) {
            this.y -= PLAYER_SPEED;
        }
        if (this.input.isDown('ArrowDown') || this.input.isDown('KeyS')) {
            this.y += PLAYER_SPEED;
        }
        if (this.input.isDown('ArrowLeft') || this.input.isDown('KeyA')) {
            this.x -= PLAYER_SPEED;
        }
        if (this.input.isDown('ArrowRight') || this.input.isDown('KeyD')) {
            this.x += PLAYER_SPEED;
        }

        // Mouse Movement (Horizontal only for stability, or both?)
        // Let's allow horizontal mouse following, centering player on mouse X
        // We check if mouse has moved or is within canvas
        if (this.input.getMouseX() > 0 && this.input.getMouseX() < CANVAS_WIDTH) {
            // Smoothly lerp towards mouseX or just set it? 
            // Direct setting is more responsive for mouse.
            // Center player on mouse
            this.x = this.input.getMouseX() - this.width / 2;

            // Optional: Mouse Y movement
            this.y = this.input.getMouseY() - this.height / 2;
        }


        // Boundary checks
        if (this.x < 0) this.x = 0;
        if (this.x > CANVAS_WIDTH - this.width) this.x = CANVAS_WIDTH - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > CANVAS_HEIGHT - this.height) this.y = CANVAS_HEIGHT - this.height;
    }

    shoot(timestamp: number): Projectile | null {
        const isShooting =
            this.input.isDown('Space') ||
            this.input.isDown('Enter') ||
            this.input.isMouseDown();

        if (isShooting && timestamp - this.lastShot > this.shotInterval) {
            this.lastShot = timestamp;
            return new Projectile(this.x + this.width / 2 - 4, this.y);
        }
        return null;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#0ff'; // Cyan
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height - 10);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Engine glow
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height - 5, 5 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
