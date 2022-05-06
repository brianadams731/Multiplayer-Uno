import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { GameCards } from '../models/GameCards';
import { GameState } from '../models/GameState';
import { GameUser } from '../models/GameUser';
import { io } from '../utils/server';

const playCardRouter = express.Router();

playCardRouter.post("/playCard", requireWithUserAsync, async(req, res)=>{    
    if(!req.body.cardRefId || !req.body.gameId || !req.userId){
        return res.status(500).send();
    }

    const userId = req.userId;
    const gameId = req.body.gameId;
    const ref = req.body.cardRefId;

    const cardInUsersHand = await GameCards.userHasCardInHand(userId, gameId, ref);
    const isUsersTurn = await GameState.isUsersTurn(userId, gameId);

    if(!cardInUsersHand || !isUsersTurn){
        return res.status(500).send("ERROR: Invalid Turn");
    }
    
    const refCard = await GameCards.getLookUpCardByRef(req.body.cardRefId);  
    const gameUsers = await GameUser.getAllUsersInGame(gameId);
    const gameState = await GameState.getCurrentTurnMod(gameId);
    

    //await GameCards.playCard(userId, gameId, ref);

    //console.log(`USER ID: ${userId} | GAME ID: ${gameId} | REF: ${ref}`);
    //console.log(`Card in players hand: ${cardInUsersHand}`);
    //console.log(JSON.stringify(refCard, null, 2));
    
    io.to(gameId).emit("turn-end",{
        test:"test"
    })
    return res.status(200).send();
})

export { playCardRouter };
