class Board {
    constructor(size, x, y) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.cell = 30;
        this.board = [];
    }

    createBoard() {
        for (let i = 0; i < this.size; i++) {
            this.board.push([])
            for (let j = 0; j < this.size; j++) {
                this.board[i].push(0);
            }
        }
    }

    display() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                noFill();
                stroke(255, 0, 0);
                rect(i * this.cell + this.x, j * this.cell + this.y, this.cell, this.cell);
            }
        }
    }
}