import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { GameCards } from '../models/GameCards';
import { GameState } from '../models/GameState';
import { GameUser } from '../models/GameUser';
import { getUserRoom } from '../utils/getUserRoom';
import { io } from '../utils/server';

const playCardRouter = express.Router();

playCardRouter.post("/playCard", requireWithUserAsync, async(req, res)=>{    
    if(!req.body.cardRefId || !req.body.gameId || !req.userId){
        return res.status(400).send();
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
    const gameTurnMod = await GameState.getCurrentTurnMod(gameId);
    
    
    const currentGameState = await GameState.getGameState(gameId);
    const lastCardPlayed = currentGameState.lastCardPlayed;

    
    if(lastCardPlayed != null){

        const [lastPlayedColor, lastPlayedValue] = lastCardPlayed.split('-');
        
        if(lastPlayedValue == "wildcard" || lastCardPlayed == ""){
            // pass if wildcard or wild draw four
        }else if(lastPlayedColor != refCard.color && lastPlayedValue != refCard.value){
            return res.status(500).send("ERROR: Invalid Turn");
        }
        
    }

    if(refCard.value === "reverse"){
        // change modifier if reverse card is played
        await GameState.updateModifier(gameTurnMod.modifier == "reverse" ? null : "", gameId);
    }

    await GameCards.playCard(userId, gameId, ref);


    /*
    const card = await GameCards.drawCardForPlayer(userId,gameId);
    io.to(getUserRoom(userId, gameId)).emit("draw-cards",{
        cards: card
    })
    */

    const nextUser = getNextTurn(gameUsers, gameTurnMod.currentTurn, gameTurnMod.modifier);
    await GameState.updateCurrentTurn(nextUser, gameId);

    
    const newGameState = await GameState.getGameState(gameId);

    
    // Win condition
    const countInUsersHand = await GameCards.getUserCardCount(userId, gameId);
    if(countInUsersHand === 0){
        io.to(gameId).emit("game-end",{
            userWhoPlayedCard: userId,
            state: newGameState
        })
    }else{
        io.to(gameId).emit("turn-end",{
            userWhoPlayedCard: userId,
            state: newGameState
        })
    }

    if(refCard.value == "skip"){    
        
        const gameTurnMod = await GameState.getCurrentTurnMod(gameId);
        const nextUser = getNextTurn(gameUsers, gameTurnMod.currentTurn, gameTurnMod.modifier);
        await GameState.updateCurrentTurn(nextUser, gameId);
        const newGameState = await GameState.getGameState(gameId);

        io.to(gameId).emit("turn-end",{
            userWhoPlayedCard: nextUser,
            state: newGameState
        })

    }else if(refCard.value == "drawtwo"){    

        const gameTurnMod = await GameState.getCurrentTurnMod(gameId);
        const nextUser = getNextTurn(gameUsers, gameTurnMod.currentTurn, gameTurnMod.modifier);
        
        const drawUser = gameUsers
        GameCards.drawNCardsForPlayer(nextUser,gameId,2);

        await GameState.updateCurrentTurn(nextUser, gameId);
        const newGameState = await GameState.getGameState(gameId);



        io.to(gameId).emit("turn-end",{
            userWhoPlayedCard: nextUser,
            state: newGameState
        })

    }else if(refCard.value == "drawfour"){    
        
        const gameTurnMod = await GameState.getCurrentTurnMod(gameId);
        const nextUser = getNextTurn(gameUsers, gameTurnMod.currentTurn, gameTurnMod.modifier);
        
        const drawUser = gameUsers
        GameCards.drawNCardsForPlayer(nextUser,gameId,4);
        
        await GameState.updateCurrentTurn(nextUser, gameId);
        const newGameState = await GameState.getGameState(gameId);

        io.to(gameId).emit("turn-end",{
            userWhoPlayedCard: nextUser,
            state: newGameState
        })
    }

    
    // console.log(countInUsersHand);
    //console.log(`USER ID: ${userId} | GAME ID: ${gameId} | REF: ${ref}`);
    //console.log(`Card in players hand: ${cardInUsersHand}`);
    //console.log(JSON.stringify(refCard, null, 2));
    return res.status(200).send();
})

interface IUsers{
    username: string;
    id: string|number;
}

function getNextTurn(users: IUsers[], currentTurn: string|number, modifier: string){
    const index = users.findIndex((user)=> user.id == currentTurn);
    if(index === -1){
        return -1;
    }

    let nextTurnIndex = index + (modifier === "reverse"? -1 : 1);
    if(nextTurnIndex < 0){
        nextTurnIndex = users.length - 1;
    }else if(nextTurnIndex >= users.length){
        nextTurnIndex = 0;
    }

    return users[nextTurnIndex].id;
}

export { playCardRouter };
