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
const cards = new GameCards(gameState);
const messageBox = new Messages(gameState);
const usersBox = new Users(gameState);
socket.emit("game-load", { gameId: gameState.gameId });
socket.on("init-game", (msg) => {
    var _a, _b;
    gameState.userId = msg.playerId;
    gameState.currentTurn = msg.state.currentTurn;
    messageBox.appendManyMessages(msg.messages);
    usersBox.addUsers(msg.users);
    if (msg.state.lastCardPlayed) {
        const cardColor = (_b = (_a = msg === null || msg === void 0 ? void 0 : msg.state) === null || _a === void 0 ? void 0 : _a.lastCardPlayed) === null || _b === void 0 ? void 0 : _b.split("-")[0];
        usersBox.setTurn(msg.state.currentTurn, cardColor);
    }
    else {
        usersBox.setTurn(msg.state.currentTurn);
    }
    cards.initDiscardPile(msg.state.lastCardPlayed);
    cards.animateInitialHand(msg.cards);
});
socket.on("player-joined", (msg) => {
    usersBox.addUser({
        username: msg.username,
        id: msg.id
    });
});
socket.on("draw-player-cards", (msg) => {
    msg.cards.forEach((card, index) => {
        setTimeout(() => {
            cards.drawPlayerCard(card.ref, card.value, false);
        }, index * 500);
    });
});
socket.on("draw-opponent-cards", (msg) => {
    msg.cards.forEach((item, index) => {
        setTimeout(() => {
            cards.drawOpponentCard();
        }, index * 500);
    });
});
socket.on("message", (msg) => {
    messageBox.appendMessage(msg);
});
socket.on("end-of-game", (msg) => {
    alert(`${msg.state.username} Won`);
});
socket.on("turn-end", (msg) => {
    var _a, _b;
    gameState.currentTurn = msg.state.currentTurn;
    if (msg.userWhoPlayedCard == gameState.userId) {
    }
    else {
        cards.discardOpponentCard(msg.state.lastCardId, msg.state.lastCardPlayed);
    }
    const cardColor = (_b = (_a = msg === null || msg === void 0 ? void 0 : msg.state) === null || _a === void 0 ? void 0 : _a.lastCardPlayed) === null || _b === void 0 ? void 0 : _b.split("-")[0];
    usersBox.setTurn(msg.state.uid, cardColor);
});
socket.on("failed-to-join", (msg) => {
    alert(msg);
    window.location.href = "/login";
});
//# sourceMappingURL=game.js.map