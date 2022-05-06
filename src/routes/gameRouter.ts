import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { GameCards } from '../models/GameCards';
import { GameState } from '../models/GameState';

const gameRouter = express.Router();

/*gameRouter.get("/game/init/:gameId", requireWithUserAsync, async(req, res)=>{
    if(!req.params.gameId || !req.userId || !Number.isInteger(Number(req.params.gameId))){
        return res.status(400).send();
    }
    const gameId = parseInt(req.params.gameId);
    await GameState.init(gameId);
    await GameCards.init(gameId);

    return res.status(200).send();
})*/



export { gameRouter };
