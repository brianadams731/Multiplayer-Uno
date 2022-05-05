import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { GameCards } from '../models/GameCards';

const playCardRouter = express.Router();

playCardRouter.post("/playCard", requireWithUserAsync, async(req, res)=>{    
    if(!req.body.cardRefId || !req.body.gameId || !req.userId){
        return res.status(500).send();
    }

    const userId = req.userId;
    const gameId = req.body.gameId;
    const ref = req.body.cardRefId;

    const refCard = await GameCards.getLookUpCardByRef(req.body.cardRefId);
    const cardInUsersHand = await GameCards.userHasCardInHand(userId, gameId, ref);
    
    if(!cardInUsersHand){
        return res.status(500).send("ERROR: User does not own card");
    }

    //await GameCards.playCard(userId, gameId, ref);

    //console.log(`USER ID: ${userId} | GAME ID: ${gameId} | REF: ${ref}`);
    //console.log(`Card in players hand: ${cardInUsersHand}`);
    //console.log(JSON.stringify(refCard, null, 2));
    
    return res.status(200).send();
})

export { playCardRouter };
