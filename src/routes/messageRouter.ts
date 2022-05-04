import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { connection } from '../utils/connection';
import { io } from '../utils/server';

const messageRouter = express.Router();

interface IMessage {
    channel: string;
    author: string;
    content: string;
    gameId: string;
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

    if (msg.channel === Channels.PUBLIC) {
        await connection.any(
            `
                INSERT INTO "Message" (uid, content)
                VALUES ($1, $2);
            `,
            [req.userId, req.body.content]
        );
        io.emit('message', {
            ...msg,
            author: user.username,
        });
        return res.status(200).send();
    }

    if (!req.body.gameId) {
        console.log('Error: Game message send while user not in room');
        return res.status(500).send();
    }

    await connection.any(
        `
                INSERT INTO "Message" (uid, content, gid)
                VALUES ($1, $2, $3);
            `,
        [req.userId, req.body.content, req.body.gameId]
    );

    io.to(req.body.gameId).emit('message', {
        ...msg,
        author: user.username,
    });

    return res.status(200).send();
});

export { messageRouter };
