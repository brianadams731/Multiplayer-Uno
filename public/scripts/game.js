import { GameCards } from './GameCards.js';
import { Messages } from './Messages.js';
import { socket } from './socket.js';
const gameId = localStorage.getItem("gameId");
if (!gameId) {
    alert("ERROR: Invalid Id");
    window.location.href = "/gamelist";
}
const card = new GameCards(gameId);
const messageBox = new Messages(gameId);
socket.emit("game-load", { gameId });
socket.on("failed-to-join", (msg) => {
    alert(msg);
    location.href = "/login";
});
socket.on("game-init", (msg) => {
    console.log(msg);
});
socket.on("player-joined", (msg) => {
    console.log(msg);
});
socket.on("message", (msg) => {
    messageBox.appendMessage(msg);
});
//# sourceMappingURL=game.js.map