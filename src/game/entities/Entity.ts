export abstract class Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    markedForDeletion: boolean = false;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    abstract update(deltaTime: number): void;
    abstract draw(ctx: CanvasRenderingContext2D): void;
}
