import { IGameState } from "./interfaces/IGameState";
import { IMessage, Messages } from "./Messages.js";
import { socket } from "./socket.js";
import { Users } from "./Users.js";
import { Endpoints } from "./utils/endpoints.js";

const gameState: IGameState = {
    userId: -1,
    currentTurn: -1,
    gameId: localStorage.getItem("gameId")!,
    gameBoard: document.querySelector("#lobby-wrapper")!
}
if(!gameState.gameId){
    alert("ERROR: Invalid Id");
    window.location.href="/login";
}



const usersBox = new Users(gameState);
const messageBox = new Messages(gameState);


// TODO: WRITE LOGIC TO ONLY SHOW TO OWNER
const startBtn = document.createElement("button");
startBtn.classList.add("start-btn");
startBtn.innerText = "Start Game";
startBtn.addEventListener("click", async ()=>{
    await fetch(`${Endpoints.StartLobby}/${gameState.gameId}`)
})
gameState.gameBoard.appendChild(startBtn);


socket.emit("lobby-joined",{gameId: gameState.gameId});

socket.on("init-lobby",(msg:any)=>{
    gameState.userId = msg.playerId;
    messageBox.appendManyMessages(msg.messages);
    usersBox.addUsers(msg.users);
})
socket.on("player-joined-lobby",(msg: any)=>{
    usersBox.addUser({
        username: msg.username,
        id: msg.id
    })
})
socket.on("message",(msg: IMessage)=>{
    messageBox.appendMessage(msg);
})
socket.on("lobby-start", (msg:any)=>{
    window.location.href=`/play/${msg.gameId}`
})
socket.on("failed-to-join",(msg:string)=>{
    alert(msg);
    window.location.href = "/login";
})