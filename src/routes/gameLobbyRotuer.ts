import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';

const gameLobbyRouter = express.Router();

gameLobbyRouter.get("/joinLobby/:gameId", requireWithUserAsync, (req,res)=>{
    if(!req.userId || !req.params.gameId){        
        return res.status(400).send();
    }
    const gameId = req.params.gameId;
    const userId = req.userId;

    

})

export { gameLobbyRouter };
