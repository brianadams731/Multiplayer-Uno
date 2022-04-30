var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Endpoints } from './utils/endpoints.js';
import { postDataAsync } from './utils/postDataAsync.js';
var Channels;
(function (Channels) {
    Channels["PUBLIC"] = "public";
    Channels["GAME"] = "game";
})(Channels || (Channels = {}));
class Messages {
    constructor() {
        [this.msgBox, this.form, this.msgInput, this.msgFeed] =
            this.createMessageBox();
        this.outChannel = Channels.PUBLIC;
        this.addFormEvents();
        this.addInputEvents();
        this.addDragEvent();
        this.setInputChannel();
        this.appendToDom();
    }
    createMessageBox() {
        const messageWrapper = document.createElement('div');
        messageWrapper.draggable = true;
        messageWrapper.classList.add('messageBoxWrapper');
        messageWrapper.innerHTML = `
            <div class="messageFeed" id="messageFeed">
            </div>
            <form id="msg" class="messageForm">
                <textarea type="text" id="msgInput"></textarea>
                <button type="submit">Send</button>
            </form>
        `;
        const form = messageWrapper.querySelector('#msg');
        const output = messageWrapper.querySelector('#messageFeed');
        const input = messageWrapper.querySelector('#msgInput');
        return [messageWrapper, form, input, output];
    }
    setOutChannel(channel) {
        this.outChannel = channel;
        this.setInputChannel();
    }
    setInputChannel() {
        this.msgInput.setAttribute('data-channel', this.outChannel);
    }
    addFormEvents() {
        this.form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const res = yield postDataAsync(Endpoints.Message, {
                channel: this.outChannel,
                content: this.msgInput.value,
                author: 'self',
            });
            if (res.ok) {
                this.msgInput.value = '';
                return;
            }
            alert('Error: Cannot send message');
        }));
    }
    addInputEvents() {
        this.msgInput.addEventListener('input', (e) => {
            const inputVal = e.target.value;
            const channelPrefix = inputVal.substring(0, 3).toLowerCase();
            if (channelPrefix == '/g ') {
                this.setOutChannel(Channels.GAME);
                this.msgInput.value = inputVal.substring(3);
            }
            else if (channelPrefix == '/p ') {
                this.setOutChannel(Channels.PUBLIC);
                this.msgInput.value = inputVal.substring(3);
            }
        });
        this.msgInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.form.requestSubmit();
            }
            return;
        });
    }
    addDragEvent() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            return false;
        });
        this.msgBox.addEventListener('dragstart', (e) => {
            const style = window.getComputedStyle(this.msgBox, null);
            e.dataTransfer.setData('text/plain', parseInt(style.getPropertyValue('left'), 10) -
                e.clientX +
                ',' +
                (parseInt(style.getPropertyValue('top'), 10) - e.clientY));
        });
        document.addEventListener('drop', (e) => {
            const offset = e.dataTransfer.getData('text/plain').split(',');
            this.msgBox.style.left = e.clientX + parseInt(offset[0], 10) + 'px';
            this.msgBox.style.top = e.clientY + parseInt(offset[1], 10) + 'px';
            e.preventDefault();
            return false;
        });
    }
    appendToDom() {
        document.querySelector('#game-board').appendChild(this.msgBox);
    }
    appendMessage(message) {
        const msg = document.createElement('p');
        msg.setAttribute('data-channel', message.channel);
        msg.innerText = `[${message.author}]: ${message.content}`;
        this.msgFeed.appendChild(msg);
        this.msgFeed.scroll({
            top: this.msgFeed.scrollHeight,
            behavior: 'smooth',
        });
    }
    appendManyMessages(messages) {
        const docFrag = document.createDocumentFragment();
        messages.forEach((message) => {
            const msg = document.createElement('p');
            msg.setAttribute('data-channel', message.channel);
            msg.innerText = `[${message.author}]: ${message.content}`;
            docFrag.appendChild(msg);
        });
        this.msgFeed.appendChild(docFrag);
        this.msgFeed.scroll({
            top: this.msgFeed.scrollHeight,
            behavior: 'smooth',
        });
    }
}
export { Messages };
//# sourceMappingURL=Messages.js.map