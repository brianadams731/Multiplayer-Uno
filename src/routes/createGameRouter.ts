import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { Game } from '../models/Game';
import { GameCards } from '../models/GameCards';
import { GameState } from '../models/GameState';
import { GameUser } from '../models/GameUser';
import { generateHashedPasswordAsync } from '../utils/passwordHash';

const createGameRouter = express.Router();

createGameRouter.post('/createGame', requireWithUserAsync, async (req, res) => {    
    if (!req.body.name || !req.userId || !req.body.playerCap) {
        return res.status(400).send();
    }

    let password: string|null = null;
    if(req.body.password){
        password = await generateHashedPasswordAsync(`${req.body.password}`);
    }

    const game = await Game.insertIntoGame(req.body.name, password!, req.body.playerCap);
    if (!game) {
        return res.status(500).send();
    }

    await GameState.init(game.id);
    await GameCards.init(game.id);
    
    await GameUser.insertIntoGameUser(req.userId, game.id);
    await GameCards.drawNCardsForPlayer(req.userId, game.id, 5);

    // TODO: DETERMINE WHEN GAME SHOULD ACTUALLY START, REMOVE THIS
    await GameState.start(game.id);

    return res.status(200).json({
        gameId: game.id,
    });
});

export { createGameRouter };
