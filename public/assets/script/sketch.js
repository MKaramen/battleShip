const socket = io();
const p = document.getElementById('target');

// Create Board
const board = new Board(10, 0, 0);
const shoot = new Board(10, 390, 0);

// Keep track of all pieces - USELESS MNT :)  
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

//Boolean
let turn = false;
let valideMove = true;
let startGame = false;
let cleanShot = true;

function setup() {
    createCanvas(board.cell * board.size * 2 + 90, board.cell * board.size);

    // Create the boards
    board.createBoard();
    shoot.createBoard();

    // Create button 
    const button = document.createElement('button');
    button.setAttribute('id', 'button');
    button.innerHTML = 'Start the game';
    const body = document.querySelector('body');
    body.appendChild(button);

    // On click send data to the server and check if all pieces are placed 
    document.getElementById('button').addEventListener('click', async () => {
        if (sizePieces == 0 && !startGame) {
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
            console.log('done');
            startGame = true;
        } else if (sizePieces > 0) {
            p.innerHTML = "You have to place all boats"
            // console.log("need to place all pieces");
        } else {
            p.innerHTML = 'Game Started Already'
            console.log('Game started already');
        }
    });

}

function draw() {
    background(255);
    board.display();
    if ((mouseX > 0 && mouseX < 690) && (mouseY > 0 && mouseY < 300)) {
        mouseOver();
    }
    shoot.display();

}

// A mettre dans class piece 
function mousePressed() {
    const x = Math.floor(mouseX / board.cell);
    const y = Math.floor(mouseY / board.cell);
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
                p.innerHTML = "Invalid Move"
                // console.log("Invalid move");
            }

        }
    }

    // Check if in canvas RIGHT SIDE 
    // put it inside if turn = true 
    if (turn) {
        if ((x > 12 && x < 23) && (y > -1 && y < 10)) {
            cleanShot = true;
            allMissiles.forEach(missile => {
                if (missile.x == x && missile.y == y) {
                    p.innerHTML = 'You already shot there'
                    // console.log('You already shot there');
                    cleanShot = false;
                }
            })

            if (cleanShot) {
                allMissiles.push(new Missile(x, y, board.cell))
                shoot.board[y][x - 13] = 3;
                turn = false;
                socket.emit('turnOver', socket.id, x, y);
                p.innerHTML = "Opponent's turn"
                // console.log('My turn is over');
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
    p.innerHTML = "Other player is not ready"
    console.log('Other player is not ready');
})

socket.on('gameStarts', idPlayer => {
    if (idPlayer == socket.id) {
        p.innerHTML = 'You start to shoot'
        // console.log('You start to shoot');
        turn = true;
    } else {
        p.innerHTML = 'Bad Luck you are second';
        // console.log('Bad luck you are second');
    }
});

socket.on('turnStart', playerId => {
    if (socket.id != playerId) {
        turn = true;
        p.innerHTML = "It's your turn !"
        // console.log('turn starts');
    }
});

// Touch or miss
socket.on('touche', (playerId, x, y) => {
    p.innerHTML = 'Touche !'
    if (playerId == socket.id) {
        board.board[y][x] = 2
    }
    if (playerId != socket.id) {
        shoot.board[y][x] = 4;
    }
})

socket.on('missed', (playerId, x, y) => {
    p.innerHTML = "You missed the shot !"
    if (playerId == socket.id) {
        board.board[y][x] = 5;
    }
})

// Make the page reload when a user disconnect 
socket.on('userDisconnect', () => {
    window.location.reload();
})