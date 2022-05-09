import express from 'express';
import { pageReqAuth } from '../middleware/pageReqAuth';
import { GameState } from '../models/GameState';
import { GameUser } from '../models/GameUser';

const viewRoutes = express.Router();

viewRoutes.get('/play/:gameId', pageReqAuth, async (req,res) =>{
    if(!req.params.gameId || !req.userId){
        return res.redirect("/joinLobby");
    }
    try{
        const gameHasStarted = await GameState.gameHasStarted(req.params.gameId);
        const userAlreadyInGame = await GameUser.userAlreadyJoinedGame(req.params.gameId, req.userId);
        
        if(gameHasStarted && userAlreadyInGame){
            return res.render('uno',{
                layout: "game.handlebars"
            })
        }else if(!gameHasStarted && userAlreadyInGame){
            return res.redirect(`/gameLobby/${req.params.gameId}`);
        }else{
            return res.redirect(`/joinLobby`);
        }
    }catch(err){
        return res.redirect(`/joinLobby`);
    }
});

export { viewRoutes };
