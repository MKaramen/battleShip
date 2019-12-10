const socket = io();
let turn = false;

// Create Board
const board = new Board(10, 0, 0);
const shoot = new Board(10, 390, 0);

// Keep track of all pieces 
let pieces = [];

// Send pieces to class Boat 
let tempPiece = [];
let allBoat = [];

// Send missiles
let allMissiles = [];
// Use for the preview 
let previewPieces = [];

// Use for the size of the boat 
let sizePieces = 5;
console.log(board);

let placing = true;
let over = true;
let valideMove = true;
let free = true;
let startGame = false;
let cleanShot = true;

function setup() {
    createCanvas(board.cell * board.size * 2 + 90, board.cell * board.size);
    board.createBoard();
    shoot.createBoard();

    // Create button 
    const button = document.createElement('button');
    button.setAttribute('id', 'button');
    button.innerHTML = 'Start the game';
    const body = document.querySelector('body');
    body.appendChild(button);

    document.getElementById('button').addEventListener('click', async () => {
        console.log('clicked');
        if (sizePieces == 0 && !startGame) {
            placing = false;
            // Execute socket.io and send all pieces  
            socket.emit('playerIsReady', socket.id);

            const data = {
                allPieces: pieces,
                idPlayer: socket.id
            }
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            const response = await fetch('/position', options);
            const object = await response.json();
            console.log(object);
            console.log('done');
            startGame = true;
        } else if (sizePieces > 0) {
            console.log("need to place all pieces");
        } else {
            console.log('Game started already');
        }
    });

}

function draw() {
    background(255);
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

    allMissiles.forEach(missiles => {
        missiles.display()
    })

}

// A mettre dans class piece 
function mousePressed() {
    over = false;
    const x = Math.floor(mouseX / board.cell);
    const y = Math.floor(mouseY / board.cell);
    console.log(x, y);
    // Check if inside canvas LEFT 
    if ((mouseX > 0 || mouseX < 690) && (mouseY > 0 || mouseY < 300)) {
        if (sizePieces > 0 && valideMove) {
            if (x < board.board.length && y < board.board.length && x > -1 && y > -1) {
                tempPiece = [];
                for (let i = 0; i < sizePieces; i++) {
                    pieces.push(new Pieces(x + i, y));
                    tempPiece.push(new Pieces(x + i, y))
                    board.board[y][x + i] = 1;
                }
                let boat = new Boat(tempPiece)
                allBoat.push(boat);
                sizePieces--;

            } else {
                console.log("Invalid move");
            }

        }
    }

    // Check if in canvas RIGHT SIDE 
    // put it inside if turn = true 
    if (turn) {
        if ((x > 12 && x < 23) && (y > -1 && y < 10)) {
            console.log("in1");
            cleanShot = true;
            allMissiles.forEach(missile => {
                if (missile.x == x && missile.y == y) {
                    console.log('You already shot there');
                    cleanShot = false;
                }
            })

            if (cleanShot) {
                allMissiles.push(new Missile(x, y, board.cell))
                turn = false;
                socket.emit('turnOver', socket.id, x, y);
                console.log('My turn is over');
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
        rect(elem.x, elem.y, board.cell, board.cell);

        const x = Math.floor(elem.x / board.cell);
        const y = Math.floor(elem.y / board.cell);

        if (x > board.size - 1 || x < 0 || board.board[y][x] == 1) {
            valideMove = false;
        }
    })
}

// Socket Events
socket.on('waitingOtherPlayer', () => {
    console.log('Other player is not ready');
})

socket.on('gameStarts', idPlayer => {
    if (idPlayer == socket.id) {
        console.log('You start to shoot');
        turn = true;
    } else {
        console.log('Bad luck you are second');
    }
});

socket.on('turnStart', playerId => {
    if (socket.id != playerId) {
        turn = true;
        console.log('turn starts');
    }
});

socket.on('touche', (playerId) => {
    if (playerId == socket.id) {
        console.log('se sui touze');
    }
})