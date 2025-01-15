const {Server} = require("socket.io");

let rooms = {};

function setupWebSocket(server) {
    const allowedOrigins = [
        "http://localhost:3000",
        "https://quizz-app-lilac-zeta.vercel.app"
    ]
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);

        //Handle joining a room
        socket.on("joinRoom", ({username, roomCode}) => {
            if (!rooms[roomCode]) {
                rooms[roomCode] = {players: [], picks: [], host: null, gameStarted: false};
            }
            rooms[roomCode].players.push({id: socket.id, username, score: 0, madePicj: false});
            console.log(`${username} joined room ${roomCode}`);
            socket.join(roomCode);

            io.to(roomCode).emit("roomUpdate", rooms[roomCode]);
        });

        //Let players make picks
        socket.on("makePick", ({ roomCode, category, timeLimit, questionCount}) => {
            const room = rooms[roomCode];
            if (!room) return;

            const player = room.players.find((p) => p.id === socket.id);
            if (player) {
                player.madePick = true;
                room.picks.push({ id: socket.id, category, timeLimit, questionCount});
            }

            const allPicked = room.players.every((p) => p.madePick);
            if (allPicked) {
                io.to(roomCode).emit("AllPlayersPicked", room.picks);
            } else {
                io.to(roomCode).emit("roomUpdate", room);
            }
        });

        //Let host start game
        socket.on("startGame", ({ roomCode, settings}) => {
            const room = rooms[roomCode];
            if (room) {
                room.gameStarted = true;
                room.settings = settings;
                io.to(roomCode).emit("gameStarted", settings);
            }
        });

        //For when players get disconnected
        socket.on("disconnect", () => {
            for (const roomCode in rooms) {
                const room = rooms[roomCode];
                const playerIndex = room.players.findIndex((p) => p.id === socket.id);
                if (playerIndex != -1) {
                    room.players.splice(playerIndex, 1);
                    if (room.players.length === 0) delete rooms[roomCode];
                    else io.to(roomCode).emit("roomUpdate", room);
                    break;
                }
            }
            console.log("User " + socket.id + " disconnected");
        });
    });
}

module.exports = {setupWebSocket};