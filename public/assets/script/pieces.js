class Pieces {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.previewPieces = [];
    }

    display() {
        fill(0, 0, 255);
        rect(this.x * this.size, this.y * this.size, this.size, this.size);
    }






}