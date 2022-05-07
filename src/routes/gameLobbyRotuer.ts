import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { GameState } from '../models/GameState';
import { GameUser } from '../models/GameUser';
import { io } from '../utils/server';

const gameLobbyRouter = express.Router();

gameLobbyRouter.get("/startLobby/:gameId", requireWithUserAsync, async (req,res)=>{
    if(!req.userId || !req.params.gameId){
        return res.status(400).send();
    }
    const userId = req.userId;
    const gameId = req.params.gameId;
    const oldestPlayer = await GameUser.getOldestPlayer(gameId);
    if(oldestPlayer == userId){
        await GameState.start(gameId);
    }else{
        console.log("Not owner");
    }

    io.to(gameId).emit("lobby-start",{
        gameId
    });

    return res.status(200).send();
})

export { gameLobbyRouter };
