import session from 'express-session';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { sessionConfig } from '../utils/sessionConfig';

const socketSession = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    next: (err?: ExtendedError | undefined) => void
) => {
    try {
        session(sessionConfig)(socket?.request as any, {} as any, next as any);
    } catch (err) {
        console.log(err);
    }
};

//((socket.request as any).session.userId);

export { socketSession };
