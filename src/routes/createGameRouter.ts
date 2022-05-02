import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { connection } from '../utils/connection';
import { generateHashedPasswordAsync } from '../utils/passwordHash';

const createGameRouter = express.Router();

createGameRouter.post('/createGame', requireWithUserAsync, async (req, res) => {
    if (!req.body.name || !req.userId) {
        return res.status(400).send();
    }

    let password: string|null = null;
    if(req.body.password){
        password = await generateHashedPasswordAsync(`${req.body.password}`);
    }

    const game = await connection.any(
        `
        INSERT INTO "Game"(name, password)
        VALUES ($1, $2)
        RETURNING id;
    `,
        [req.body.name, password]
    );

    if (game.length === 0) {
        return res.status(500).send();
    }

    await connection.any(
        `
        INSERT INTO "GameUser" (uid, gid)
        VALUES ($1, $2);
    `,
        [req.userId, game[0].id]
    );

    return res.status(200).json({
        gameId: game[0].id,
    });
});

export { createGameRouter };
