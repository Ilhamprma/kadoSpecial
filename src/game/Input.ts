export class InputHandler {
    keys: Set<string> = new Set();
    mouseX: number = 0;
    mouseY: number = 0;
    mouseDown: boolean = false;
    private canvas: HTMLCanvasElement | null = null;

    constructor(canvas?: HTMLCanvasElement) {
        if (canvas) this.canvas = canvas;
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    private handleKeyDown = (e: KeyboardEvent): void => {
        this.keys.add(e.code);
    };

    private handleKeyUp = (e: KeyboardEvent): void => {
        this.keys.delete(e.code);
    };

    private handleMouseMove = (e: MouseEvent): void => {
        if (this.canvas) {
            // Map viewport coords to canvas coords so the player follows
            // the cursor correctly even when the canvas is offset or scaled.
            const rect = this.canvas.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                this.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
                this.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
                return;
            }
        }
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    };

    private handleMouseDown = (): void => {
        this.mouseDown = true;
    };

    private handleMouseUp = (): void => {
        this.mouseDown = false;
    };

    isDown(code: string): boolean {
        return this.keys.has(code);
    }

    getMouseX(): number {
        return this.mouseX;
    }

    getMouseY(): number {
        return this.mouseY;
    }

    isMouseDown(): boolean {
        return this.mouseDown;
    }

    cleanup() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }
}
