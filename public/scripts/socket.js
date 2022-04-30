// @ts-ignore
import { io } from 'https://cdn.socket.io/4.5.0/socket.io.esm.min.js';
const socket = io();
socket.on("connect", () => {
    socket.id;
});
export { socket };
//# sourceMappingURL=socket.js.map