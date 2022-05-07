var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Messages } from './Messages.js';
import { socket } from './socket.js';
import { Users } from './Users.js';
import { Endpoints } from './utils/endpoints.js';
const gameState = {
    userId: -1,
    currentTurn: -1,
    gameId: localStorage.getItem('gameId'),
    gameBoard: document.querySelector('#lobby-wrapper'),
};
if (!gameState.gameId) {
    alert('Missing game id');
    window.location.href = '/gameLobby';
}
const usersBox = new Users(gameState);
const messageBox = new Messages(gameState);
socket.emit('lobby-joined', { gameId: gameState.gameId });
socket.on('init-lobby', (msg) => {
    gameState.userId = msg.playerId;
    messageBox.appendManyMessages(msg.messages);
    usersBox.addUsers(msg.users);
    if (msg.isOwner) {
        createStartBtn();
    }
    else {
        const waiting = document.createElement("h1");
        waiting.innerText = "Waiting for Game to Start...";
        gameState.gameBoard.appendChild(waiting);
    }
});
socket.on('player-joined-lobby', (msg) => {
    usersBox.addUser({
        username: msg.username,
        id: msg.id,
    });
});
socket.on('message', (msg) => {
    messageBox.appendMessage(msg);
});
socket.on('lobby-start', (msg) => {
    window.location.href = `/play/${msg.gameId}`;
});
socket.on('failed-to-join', (msg) => {
    alert(msg);
    window.location.href = '/login';
});
function createStartBtn() {
    const startBtn = document.createElement('button');
    startBtn.classList.add('start-btn');
    startBtn.innerText = 'Start Game';
    startBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        yield fetch(`${Endpoints.StartLobby}/${gameState.gameId}`);
    }));
    gameState.gameBoard.appendChild(startBtn);
}
;
//# sourceMappingURL=lobby.js.map