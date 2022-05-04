import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { connection } from '../utils/connection';
import { checkHashedPasswordAsync } from '../utils/passwordHash';

const joinGameRouter = express.Router();

joinGameRouter.post('/joinGame', requireWithUserAsync, async (req, res) => {
    if (!req.body.gameId || !req.userId) {
        return res.status(400).send();
    }

    const game = await connection.one(
        `
        SELECT id, password
        FROM "Game"
        WHERE id=$1;
    `,
        [req.body.gameId]
    );

    if (!game) {
        return res.status(400).send();
    }

    if (game.password) {
        if (!req.body.password || !(await checkHashedPasswordAsync(req.body.password, game.password))) {
            return res.status(401).send();
        }
    }
    try{
        await connection.any(
            `
            INSERT INTO "GameUser" (uid, gid)
            VALUES ($1, $2);
        `,
            [req.userId, game.id]
        );
    }catch(err: any){
        if(err?.code != '23505'){
            // This means a duplicate key error from pg has not occurred
            console.log(err);
            return res.status(409).send();
        }
    }

    return res.status(200).json({
        gameId: game.id
    });
});

export { joinGameRouter };
