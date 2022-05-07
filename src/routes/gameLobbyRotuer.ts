import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { GameState } from '../models/GameState';
import { io } from '../utils/server';

const gameLobbyRouter = express.Router();

gameLobbyRouter.get("/startLobby/:gameId", requireWithUserAsync, async (req,res)=>{
    if(!req.userId || !req.params.gameId){
        return res.status(400).send();
    }

    // TODO: Check if user is the owner of the lobby
    const gameId = req.params.gameId;
    await GameState.start(req.params.gameId);

    io.to(gameId).emit("lobby-start",{
        gameId
    });
})

export { gameLobbyRouter };
