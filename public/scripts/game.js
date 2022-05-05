import { GameCards } from './GameCards.js';
import { Messages } from './Messages.js';
import { socket } from './socket.js';
const gameId = localStorage.getItem("gameId");
if (!gameId) {
    alert("ERROR: Invalid Id");
    window.location.href = "/gamelist";
}
const cards = new GameCards(gameId);
const messageBox = new Messages(gameId);
socket.emit("game-load", { gameId });
socket.on("failed-to-join", (msg) => {
    alert(msg);
    location.href = "/login";
});
socket.on("init-game", (msg) => {
    messageBox.appendManyMessages(msg.messages);
    msg.cards.forEach((card, index) => {
        setTimeout(() => {
            cards.drawPlayerCard(card.ref, card.value);
        }, index * 1250);
        console.log(card);
    });
    msg.cards.forEach((card, index) => {
        setTimeout(() => {
            cards.drawOpponentCard();
        }, (index * 1250) + 625);
        console.log(card);
    });
});
socket.on("player-joined", (msg) => {
    console.log(msg);
});
socket.on("message", (msg) => {
    messageBox.appendMessage(msg);
});
//# sourceMappingURL=game.js.map