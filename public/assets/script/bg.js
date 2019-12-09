class Bg {
    constructor(x, y, cell) {
        this.size = cell;
        this.x = x;
        this.y = y;
    }

    display() {
        fill(0);
        stroke(255, 0, 0);
        rect(this.x * this.size, this.y * this.size, this.size, this.size);
    }
}