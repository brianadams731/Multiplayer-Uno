import { GameCards } from './GameCards.js';
import { IMessage, Messages } from './Messages.js';
import { socket } from './socket.js';

const card = new GameCards();
const messageBox = new Messages();

socket.on("message",(msg: IMessage)=>{
    messageBox.appendMessage(msg);
})





