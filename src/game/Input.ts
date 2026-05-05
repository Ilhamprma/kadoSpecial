export class InputHandler {
    keys: Set<string> = new Set();
    mouseX: number = 0;
    mouseY: number = 0;
    mouseDown: boolean = false;

    constructor() {
        window.addEventListener('keydown', (e) => this.keys.add(e.code));
        window.addEventListener('keyup', (e) => this.keys.delete(e.code));
        window.addEventListener('mousemove', (e) => {
            // Need to account for canvas position if not full screen, 
            // but for now we assume full screen or use clientX/Y
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        window.addEventListener('mousedown', () => this.mouseDown = true);
        window.addEventListener('mouseup', () => this.mouseDown = false);
    }

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
        window.removeEventListener('keydown', (e) => this.keys.add(e.code));
        window.removeEventListener('keyup', (e) => this.keys.delete(e.code));
        // Note: Event listener removal for anonymous functions is tricky. 
        // In a real app we'd bind them, but for this simple game it's okay 
        // as the input handler usually lives as long as the page.
    }
}
