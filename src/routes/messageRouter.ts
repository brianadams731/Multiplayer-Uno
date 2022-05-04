import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { Message } from '../models/Message';
import { User } from '../models/User';
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
    const user = await User.getUserById(req.userId!);

    if (!user || !msg.content || !msg.channel || !req.userId) {
        return res.status(400).send();
    }

    if (msg.channel === Channels.PUBLIC) {
        await Message.insertPublicMessage(req.userId, req.body.content);
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

    await Message.insertGameMessage(req.userId, req.body.gameId, req.body.content)

    io.to(req.body.gameId).emit('message', {
        ...msg,
        author: user.username,
    });

    return res.status(200).send();
});

export { messageRouter };
