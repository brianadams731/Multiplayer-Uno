import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { connection } from '../utils/connection';
import { io } from '../utils/server';

const messageRouter = express.Router();

interface IMessage {
    channel: string;
    author: string;
    content: string;
}
enum Channels {
    PUBLIC = 'public',
    GAME = 'game',
}

messageRouter.post('/message', requireWithUserAsync, async (req, res) => {
    const msg = req.body as IMessage;
    const user = await connection.one(
        `
            SELECT u.username
            FROM "User" u
            WHERE uid=$1
        `,
        [req.userId]
    );
    if (!user || !msg.content || !msg.channel) {
        return res.status(400).send();
    }
    // TODO: ADD GAME ID COLUMN AND VALUE HERE, WILL HAVE GAME ID IF CHANNELS.GAME === TRUE
    await connection.any(
        `
            INSERT INTO "Message" (uid, content)
            VALUES ($1, $2);
        `,
        [req.userId, req.body.content]
    );

    if (msg.channel === Channels.PUBLIC) {
        io.emit('message', {
            ...msg,
            author: user.username,
        });
    } else {
        // TODO: ADD ROUTING TO ENSURE GAME MESSAGE GETS ROUTED TO THE CORRECT ROOM
        io.emit('message', {
            channel: Channels.GAME,
            author: user.username,
            content: msg.content,
        });
    }

    return res.status(200).send();
});

export { messageRouter };
