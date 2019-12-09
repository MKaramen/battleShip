// Create Board
const board = new Board(10, 0, 0);
const shoot = new Board(10, 390, 0);

// Keep track of all pieces 
const pieces = [];

// Send pieces to class Boat 
let tempPiece = [];
let boat;

// Use for the preview 
let previewPieces = [];

// Use for the size of the boat 
let sizePieces = 5;
console.log(board);

let placing = true;
let over = true;
let valideMove = true;
let free = true;

function setup() {
    createCanvas(board.cell * board.size * 2 + 90, board.cell * board.size);

    board.createBoard();

    shoot.createBoard();


    // Create button 
    const button = document.createElement('button');
    button.setAttribute('id', 'button');
    button.innerHTML = 'Click Me';
    const body = document.querySelector('body');
    body.appendChild(button);

    document.getElementById('button').addEventListener('click', () => {
        console.log('clicked');
        if (sizePieces == 0) {
            placing = false;
            console.log('done');
        } else {
            console.log("need to place all pieces");
        }
    });

}

function draw() {
    background(0);
    board.display();
    shoot.display();
    // board.board[i][j] = new Pieces(i, j);
    pieces.forEach(piece => {
        piece.display();
    })

    if (mouseX < 0 || mouseX > 690 || mouseY < 0 || mouseY > 300) {

    } else {
        mouseOver();
    }


}

// A mettre dans class piece 
function mousePressed() {
    over = false;
    const x = Math.floor(mouseX / board.cell);
    const y = Math.floor(mouseY / board.cell);
    // Check if inside canvas
    if (mouseX < 0 || mouseX > 690 || mouseY < 0 || mouseY > 300) {

    } else {
        if (sizePieces > 0 && valideMove) {
            if (x < board.board.length && y < board.board.length && x > -1 && y > -1) {
                tempPiece = [];
                for (let i = 0; i < sizePieces; i++) {
                    pieces.push(new Pieces(x + i, y));
                    tempPiece.push(new Pieces(x + i, y))
                    board.board[y][x + i] = 1;
                }
                boat = new Boat(tempPiece)
                sizePieces--;

            } else {
                console.log("Invalid move");
            }

        }
    }


}

const mouseOver = () => {
    previewPieces = [];
    for (let i = 0; i < sizePieces; i++) {

        const x = Math.floor(mouseX / board.cell);
        const y = Math.floor(mouseY / board.cell);
        previewPieces[i] = {
            x: (x * board.cell + i * board.cell),
            y: (y * board.cell)
        };
    }
    valideMove = true;
    previewPieces.forEach((elem, i) => {
        fill(0, 0, 255, 90);
        // board.board[elem.y][elem.x] = 2;
        rect(elem.x, elem.y, board.cell, board.cell);


        const x = Math.floor(elem.x / board.cell);
        const y = Math.floor(elem.y / board.cell);

        console.log(x);
        if (x > board.size - 1 || x < 0 || board.board[y][x] == 1) {
            console.log('in');
            valideMove = false;
        }
    })
}