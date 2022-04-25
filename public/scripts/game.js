import { GameCards } from './GameCards.js';
import { Messages } from './Messages.js';
import { socket } from './socket.js';
const card = new GameCards();
const messageBox = new Messages();
socket.on("message", (msg) => {
    messageBox.appendMessage(msg);
});
//# sourceMappingURL=game.js.map