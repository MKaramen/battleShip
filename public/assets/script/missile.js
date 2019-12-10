class Missile {
    constructor(x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
    }

    display() {
        fill(0, 255, 0)
        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize)
    }

    touched() {
        fill(255, 0, 0);
        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize)
    }
}