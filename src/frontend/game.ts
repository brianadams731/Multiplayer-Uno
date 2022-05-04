import { GameCards } from './GameCards.js';
import { IMessage, Messages } from './Messages.js';
import { socket } from './socket.js';

const gameId = localStorage.getItem("gameId");
if(!gameId){
    alert("ERROR: Invalid Id");
    window.location.href="/gamelist";
}

const card = new GameCards(gameId!);
const messageBox = new Messages(gameId!);

socket.emit("game-load",{gameId});

socket.on("failed-to-join",(msg:string)=>{
    alert(msg);
    location.href = "/login";
})

socket.on("game-init",(msg:any)=>{
    console.log(msg);
})

socket.on("player-joined",(msg: any)=>{
    console.log(msg);
})

socket.on("message",(msg: IMessage)=>{
    messageBox.appendMessage(msg);
})





