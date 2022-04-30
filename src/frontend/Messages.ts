import { Endpoints } from './utils/endpoints.js';
import { postDataAsync } from './utils/postDataAsync.js';

enum Channels {
    PUBLIC = 'public',
    GAME = 'game',
}

interface IMessage {
    channel: string;
    author: string;
    content: string;
}

class Messages {
    private messages: IMessage[];
    private input: string;
    private outChannel: Channels;

    private msgBox: HTMLDivElement;
    private form: HTMLFormElement;
    private msgFeed: HTMLDivElement;
    private msgInput: HTMLInputElement;

    public constructor() {
        [this.msgBox, this.form, this.msgInput, this.msgFeed] =
            this.createMessageBox();
        this.outChannel = Channels.PUBLIC;

        this.addFormEvents();
        this.addInputEvents();
        this.addDragEvent();
        this.setInputChannel();
        this.appendToDom();
    }

    private createMessageBox(): [
        messageWrapper: HTMLDivElement,
        form: HTMLFormElement,
        input: HTMLInputElement,
        output: HTMLDivElement
    ] {
        const messageWrapper = document.createElement('div') as HTMLDivElement;
        messageWrapper.draggable = true;
        messageWrapper.classList.add('messageBoxWrapper');
        messageWrapper.innerHTML = `
            <div class="messageFeed" id="messageFeed">
            </div>
            <form id="msg" class="messageForm">
                <textarea type="text" id="msgInput"></textarea>
                <button type="submit">Send</button>
            </form>
        ` as any;

        const form = messageWrapper.querySelector('#msg') as HTMLFormElement;
        const output = messageWrapper.querySelector(
            '#messageFeed'
        ) as HTMLDivElement;
        const input = messageWrapper.querySelector(
            '#msgInput'
        ) as HTMLInputElement;

        return [messageWrapper, form, input, output];
    }

    private setOutChannel(channel: Channels) {
        this.outChannel = channel;
        this.setInputChannel();
    }

    private setInputChannel() {
        this.msgInput.setAttribute('data-channel', this.outChannel);
    }

    private addFormEvents() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const res = await postDataAsync(Endpoints.Message, {
                channel: this.outChannel,
                content: this.msgInput.value,
                author: 'self',
            });

            if (res.ok) {
                this.msgInput.value = '';
                return;
            }
            alert('Error: Cannot send message');
        });
    }
    private addInputEvents() {
        this.msgInput.addEventListener('input', (e) => {
            const inputVal = (e.target as HTMLInputElement).value;
            const channelPrefix = inputVal.substring(0, 3).toLowerCase();

            if (channelPrefix == '/g ') {
                this.setOutChannel(Channels.GAME);
                this.msgInput.value = inputVal.substring(3);
            } else if (channelPrefix == '/p ') {
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

    private addDragEvent() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            return false;
        });
        this.msgBox.addEventListener('dragstart', (e) => {
            const style = window.getComputedStyle(this.msgBox, null);
            e.dataTransfer!.setData(
                'text/plain',
                parseInt(style.getPropertyValue('left'), 10) -
                    e.clientX +
                    ',' +
                    (parseInt(style.getPropertyValue('top'), 10) - e.clientY)
            );
        });
        document.addEventListener('drop', (e) => {
            const offset = e.dataTransfer!.getData('text/plain').split(',');
            this.msgBox.style.left = e.clientX + parseInt(offset[0], 10) + 'px';
            this.msgBox.style.top = e.clientY + parseInt(offset[1], 10) + 'px';
            e.preventDefault();
            return false;
        });
    }

    private appendToDom() {
        document.querySelector('#game-board')!.appendChild(this.msgBox);
    }

    public appendMessage(message: IMessage) {
        const msg = document.createElement('p');
        msg.setAttribute('data-channel', message.channel);
        msg.innerText = `[${message.author}]: ${message.content}`;
        this.msgFeed.appendChild(msg);
        this.msgFeed.scroll({
            top: this.msgFeed.scrollHeight,
            behavior: 'smooth',
        });
    }

    private appendManyMessages(messages: IMessage[]) {
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
export type { IMessage };
