import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { Game } from '../models/Game';
import { GameCards } from '../models/GameCards';
import { GameUser } from '../models/GameUser';
import { checkHashedPasswordAsync } from '../utils/passwordHash';

const joinGameRouter = express.Router();

joinGameRouter.post('/joinGame', requireWithUserAsync, async (req, res) => {
    if (!req.body.gameId || !req.userId) {
        return res.status(400).send("Malformed Request");
    }

    const game = await Game.getGameById(req.body.gameId);
    const playerCount = await GameUser.getPlayerCount(req.body.gameId);

    if (!game) {
        console.log("Game not found");
        return res.status(400).send();
    }  
    
    if(playerCount >= game.playerCap){
        return res.status(400).send("The game is full")
    }

    if (game.password) {
        if (!req.body.password || !(await checkHashedPasswordAsync(req.body.password, game.password))) {
            return res.status(401).send();
        }
    }
    try{
        await GameUser.insertIntoGameUser(req.userId, game.id);
        await GameCards.drawNCardsForPlayer(req.userId, game.id, 5);
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
