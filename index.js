const express = require("express");
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(express.static("public"));

server.listen(3000, () => {
    console.log("Listening 3000");
});

app.post("/position", (req, res) => {
    const data = req.body;
    positionsBoat.push(data)
    res.json({
        dat: data
    });
});

let players = [];
let positionsBoat = [];
let hitted = false;

io.on("connection", socket => {
    console.log("a user is connected");
    // When player is ready get the socket id of the player 
    socket.on('playerIsReady', (playerId) => {
        players.push(playerId);
        if (players.length == 2) {
            console.log('Both connected');
            const rand = Math.floor(Math.random());
            io.emit('gameStarts', players[rand]);
        } else {
            socket.emit('waitingOtherPlayer');
        }
    })

    socket.on('turnOver', (playerId, x, y) => {
        hitted = false;
        positionsBoat.forEach(obj => {
            if (obj.idPlayer != playerId) {
                obj.allPieces.forEach(coord => {
                    if (coord.x == x - 13 && coord.y == y) {
                        console.log('touche');
                        if (obj.idPlayer != playerId) {
                            hitted = true;
                            io.emit('touche', obj.idPlayer, x - 13, y);
                        }
                    }
                    if (!hitted) {
                        io.emit('missed', obj.idPlayer, x - 13, y);
                    }
                })
            }
        })
        io.emit('turnStart', playerId);
    });

    // when disconnect empy the array so we know one of the player left 
    socket.on('disconnect', socket => {
        players = [];
        positionsBoat = [];
        io.emit('userDisconnect')
    })


});