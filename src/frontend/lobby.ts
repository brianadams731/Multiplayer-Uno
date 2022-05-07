import { IGameState } from './interfaces/IGameState';
import { IMessage, Messages } from './Messages.js';
import { socket } from './socket.js';
import { Users } from './Users.js';
import { Endpoints } from './utils/endpoints.js';

const gameState: IGameState = {
    userId: -1,
    currentTurn: -1,
    gameId: localStorage.getItem('gameId')!,
    gameBoard: document.querySelector('#lobby-wrapper')!,
};

if (!gameState.gameId) {
    alert('Missing game id');
    window.location.href = '/gameLobby';
}

const usersBox = new Users(gameState);
const messageBox = new Messages(gameState);

socket.emit('lobby-joined', { gameId: gameState.gameId });

socket.on('init-lobby', (msg: any) => {
    gameState.userId = msg.playerId;
    messageBox.appendManyMessages(msg.messages);
    usersBox.addUsers(msg.users);
    
    if(msg.isOwner){
        createStartBtn();
    }else{
        const waiting = document.createElement("h1");
        waiting.innerText = "Waiting for Game to Start..."
        gameState.gameBoard.appendChild(waiting);
    }
});
socket.on('player-joined-lobby', (msg: any) => {
    usersBox.addUser({
        username: msg.username,
        id: msg.id,
    });
});
socket.on('message', (msg: IMessage) => {
    messageBox.appendMessage(msg);
});
socket.on('lobby-start', (msg: any) => {
    window.location.href = `/play/${msg.gameId}`;
});
socket.on('failed-to-join', (msg: string) => {
    alert(msg);
    window.location.href = '/login';
});

function createStartBtn(): void {
    const startBtn = document.createElement('button');
    startBtn.classList.add('start-btn');
    startBtn.innerText = 'Start Game';
    startBtn.addEventListener('click', async () => {
        await fetch(`${Endpoints.StartLobby}/${gameState.gameId}`);
    });
    gameState.gameBoard.appendChild(startBtn);
};
