import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { GameCards } from '../models/GameCards';
import { GameState } from '../models/GameState';
import { getUserRoom } from '../utils/getUserRoom';
import { io } from '../utils/server';

const drawCardRouter = express.Router();

drawCardRouter.post('/drawCard', requireWithUserAsync, async (req, res) => {
    if(!req.userId || !req.body.gameId){
        return res.status(400).send();
    }

    const userId = req.userId;
    const gameId = req.body.gameId;

    const isUsersTurn = await GameState.isUsersTurn(userId, gameId);
    if(!isUsersTurn){
        return res.status(500).send();
    }
    
    // start draw logic
    const card = await GameCards.drawCardForPlayer(userId, gameId);
    io.to(getUserRoom(userId, gameId)).emit('draw-cards', {
        cards: card,
    });
    // end draw logic

    return res.status(200).send();
});

export { drawCardRouter };
