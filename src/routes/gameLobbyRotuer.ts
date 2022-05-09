import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { Game } from '../models/Game';
import { GameState } from '../models/GameState';
import { GameUser } from '../models/GameUser';
import { getUserRoom } from '../utils/getUserRoom';
import { io } from '../utils/server';

const gameLobbyRouter = express.Router();

gameLobbyRouter.get("/startLobby/:gameId", requireWithUserAsync, async (req,res)=>{
    if(!req.userId || !req.params.gameId){
        return res.status(400).send();
    }
    const userId = req.userId;
    const gameId = req.params.gameId;
    const oldestPlayer = await GameUser.getOldestPlayer(gameId);
    if(oldestPlayer != userId){
        return res.status(403).send();
    }
    await GameState.start(gameId);
    io.to(gameId).emit("lobby-start",{
        gameId
    });

    return res.status(200).send();
})

gameLobbyRouter.get("/deleteLobby/:gameId", requireWithUserAsync, async(req, res)=>{
    if(!req.userId || !req.params.gameId){
        return res.status(400).send();
    }
    const userId = req.userId;
    const gameId = req.params.gameId;
    const oldestPlayer = await GameUser.getOldestPlayer(gameId);
    if(oldestPlayer != userId){
        return res.status(403).send();
    }

    const allUsers = await GameUser.getAllUsersInGame(gameId);
    await Game.deleteGame(gameId);

    io.to(gameId).emit("lobby-deleted");
    allUsers.forEach((user)=>{
        io.in(getUserRoom(user.id, gameId)).disconnectSockets();
    })
    
    return res.status(200).send();
})

export { gameLobbyRouter };
