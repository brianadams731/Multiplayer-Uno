import { Messages } from './Messages.js';
import { GameCards } from './GameCards.js';
import { Users } from './Users.js';
import { socket } from './socket.js';
const gameState = {
    userId: -1,
    currentTurn: -1,
    gameId: localStorage.getItem("gameId"),
    gameBoard: document.querySelector("#game-board")
};
if (!gameState.gameId) {
    alert("ERROR: Invalid Id");
    window.location.href = "/login";
}
socket.on("failed-to-join", (msg) => {
    alert(msg);
    window.location.href = "/login";
});
const cards = new GameCards(gameState);
const messageBox = new Messages(gameState);
const usersBox = new Users(gameState);
socket.emit("game-load", { gameId: gameState.gameId });
socket.on("init-game", (msg) => {
    gameState.userId = msg.playerId;
    gameState.currentTurn = msg.state.currentTurn;
    messageBox.appendManyMessages(msg.messages);
    usersBox.addUsers(msg.users);
    usersBox.setTurn(msg.state.currentTurn);
    cards.initDiscardPile(msg.state.lastCardPlayed);
    cards.animateInitialHand(msg.cards);
});
socket.on("player-joined", (msg) => {
    usersBox.addUser({
        username: msg.username,
        id: msg.id
    });
});
socket.on("draw-cards", (msg) => {
    msg.cards.forEach((card) => {
        cards.drawPlayerCard(card.ref, card.value);
    });
});
socket.on("message", (msg) => {
    messageBox.appendMessage(msg);
});
socket.on("turn-end", (msg) => {
    gameState.currentTurn = msg.state.currentTurn;
    if (msg.userWhoPlayedCard == gameState.userId) {
        console.log("here");
    }
    else {
        cards.discardOpponentCard(msg.state.lastCardPlayed, msg.state.lastCardPlayed);
        setTimeout(() => {
            cards.drawOpponentCard();
        }, 400);
    }
    usersBox.setTurn(msg.state.uid);
});
//# sourceMappingURL=game.js.map