import { IGameState } from './interfaces/IGameState.js';
import { IMessage, Messages } from './Messages.js';
import { GameCards } from './GameCards.js';
import { Users } from './Users.js';

import { socket } from './socket.js';


const gameState: IGameState = {
    userId: -1,
    currentTurn: -1,
    gameId: localStorage.getItem("gameId")!,
    gameBoard: document.querySelector("#game-board")!
}

if(!gameState.gameId){
    alert("ERROR: Invalid Id");
    window.location.href="/login";
}

socket.on("failed-to-join",(msg:string)=>{
    alert(msg);
    window.location.href = "/login";
})

const cards = new GameCards(gameState);
const messageBox = new Messages(gameState);
const usersBox = new Users(gameState);

socket.emit("game-load",{gameId: gameState.gameId});

socket.on("init-game",(msg:any)=>{
    gameState.userId = msg.playerId;
    gameState.currentTurn = msg.state.currentTurn;
    
    messageBox.appendManyMessages(msg.messages);

    usersBox.addUsers(msg.users);
    usersBox.setTurn(msg.state.currentTurn);

    cards.initDiscardPile(msg.state.lastCardPlayed);
    cards.animateInitialHand(msg.cards);
})

socket.on("player-joined",(msg: any)=>{
    usersBox.addUser({
        username: msg.username,
        id: msg.id
    })
})

socket.on("draw-player-cards",(msg: any)=>{    
    msg.cards.forEach((card: any)=>{
        cards.drawPlayerCard(card.ref, card.value);
    })
})

socket.on("draw-opponent-cards",(msg: any)=>{   
    cards.drawOpponentCard();
})

socket.on("message",(msg: IMessage)=>{
    messageBox.appendMessage(msg);
})

socket.on("turn-end",(msg:any)=>{
    gameState.currentTurn = msg.state.currentTurn;

    if(msg.userWhoPlayedCard == gameState.userId){

    }else{
        cards.discardOpponentCard(msg.state.lastCardPlayed, msg.state.lastCardPlayed);
    }
    
    usersBox.setTurn(msg.state.uid);
})




