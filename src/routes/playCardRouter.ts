import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { GameCards } from '../models/GameCards';
import { GameState } from '../models/GameState';
import { GameUser } from '../models/GameUser';
import { getUserRoom } from '../utils/getUserRoom';
import { io } from '../utils/server';

const playCardRouter = express.Router();

playCardRouter.post('/playCard', requireWithUserAsync, async (req, res) => {
    if (!req.body.cardRefId || !req.body.gameId || !req.userId) {
        return res.status(400).send();
    }

    const userId = req.userId;
    const gameId = req.body.gameId;
    let ref = req.body.cardRefId;

    const cardInUsersHand = await GameCards.userHasCardInHand(userId, gameId, ref);
    const isUsersTurn = await GameState.isUsersTurn(userId, gameId);

    if (!cardInUsersHand || !isUsersTurn) {
        return res.status(500).send('ERROR: Invalid Turn');
    }

    const currentCard = await GameCards.getLookUpCardByRef(req.body.cardRefId);
    const prevCard = await GameState.getLastCardPlayed(gameId);

    // This determines an illegal turn
    if (prevCard &&                                 // if this is not the first turn
        !currentCard.value.includes("wild") &&         // and the current card is not a wild card
        prevCard.color !== currentCard.color &&     // and the color of the current and prev cards don't match
        prevCard?.value !== currentCard.value) {    // and the values of the current and prev cards don't match                            
        return res.status(400).send();              // then the turn is illegal
    }

    // GAME MODS
    if(currentCard.value === 'reverse'){
        await GameState.toggleReverse(gameId);
    }

    let gameUsers = await GameUser.getAllUsersInGame(gameId);
    let gameState = await GameState.getCurrentTurnMod(gameId);
    let nextUser = getNextTurn(gameUsers,gameState.currentTurn,gameState.modifier);

    if(currentCard.value === "wildcard"){
        const wildCards = await GameCards.getWildCardRef();
        const mappedWildCard = wildCards.find(item => item.color == req.body.colorChoice)!;
        await GameCards.playWildCard(userId, gameId, ref, mappedWildCard.cardId);
        ref = mappedWildCard.cardId;

    }else if(currentCard.value === "wilddrawfour"){
        const wildCards = await GameCards.getWildDrawFourCardRef();        
        const mappedWildCard = wildCards.find(item => item.color == req.body.colorChoice)!;
        await drawCards(Number(nextUser), gameId, 4);
        await GameCards.playWildCard(userId, gameId, ref, mappedWildCard.cardId);
        ref = mappedWildCard.cardId;

    }else if(currentCard.value === 'skip'){
        nextUser = nextUser = getNextTurn(gameUsers, nextUser, gameState.modifier);
    }else if(currentCard.value === 'drawtwo'){
        await drawCards(Number(nextUser), gameId, 2);
    }
    // END GAME MODS
    if(!currentCard.value.includes("wild")){
        await GameCards.playCard(userId, gameId, ref);
    }
    await GameState.updateCurrentTurn(nextUser, gameId);

    const newGameState = await GameState.getGameState(gameId);
    const countInUsersHand = await GameCards.getUserCardCount(userId, gameId);

    if (countInUsersHand === 0) {
        // Win condition
        io.to(gameId).emit('game-end', {
            userWhoPlayedCard: userId,
            state: newGameState,
        });
    } else {
        io.to(gameId).emit('turn-end', {
            userWhoPlayedCard: userId,
            state: newGameState,
        });
    }
    //console.log(`USER ID: ${userId} | GAME ID: ${gameId} | REF: ${ref}`);
    //console.log(`Card in players hand: ${cardInUsersHand}`);
    //console.log(JSON.stringify(refCard, null, 2));
    return res.status(200).send();
});

interface IUsers {
    username: string;
    id: string | number;
}

function getNextTurn(
    users: IUsers[],
    currentTurn: string | number,
    modifier: string
) {
    const index = users.findIndex((user) => user.id == currentTurn);
    if (index === -1) {
        return -1;
    }

    let nextTurnIndex = index + (modifier === 'reverse' ? -1 : 1);
    if (nextTurnIndex < 0) {
        nextTurnIndex = users.length - 1;
    } else if (nextTurnIndex >= users.length) {
        nextTurnIndex = 0;
    }

    return users[nextTurnIndex].id;
}

async function drawCards(uid: number, gid: number, cardCount: number){
    const cards = await GameCards.drawNCardsForPlayer(uid, gid, cardCount);
    io.to(getUserRoom(uid, gid)).emit('draw-player-cards', {
        cards: cards,
    });
    io.to(`${gid}`).except(getUserRoom(uid, gid)).emit('draw-opponent-cards', {
        cards: cards.map(_=>"card")
    });
}

export { playCardRouter };


