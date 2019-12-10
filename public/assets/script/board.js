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
        // for (let i = 0; i < this.board.length; i++) {
        //     for (let j = 0; j < this.board.length; j++) {
        //         noFill();
        //         stroke(255, 0, 0);
        //         rect(i * this.cell + this.x, j * this.cell + this.y, this.cell, this.cell);
        //     }
        // }

        this.board.forEach((array, i) => {
            array.forEach((number, j) => {
                switch (number) {
                    case 0:
                        noFill();
                        stroke(255, 0, 0);
                        rect(j * this.cell + this.x, i * this.cell + this.y, this.cell, this.cell);
                        break;
                    case 1:
                        fill(0, 0, 255);
                        rect(j * this.cell + this.x, i * this.cell + this.y, this.cell, this.cell);
                        break;
                    case 2:
                        fill(255, 0, 255);
                        rect(j * this.cell + this.x, i * this.cell + this.y, this.cell, this.cell);
                        break;
                    case 4:
                        fill(255, 0, 255);
                        rect(j * this.cell + this.x, i * this.cell + this.y, this.cell, this.cell);
                        break;
                }
            })
        })
    }

}