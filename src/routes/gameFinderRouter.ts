import express from 'express';
import { GameList } from '../models/GameList';

const gameFinderRouter = express.Router();

gameFinderRouter.get('/findGame/all', async(req,res)=>{
    const games = await GameList.getAll();
    return res.status(200).json(games);
})

gameFinderRouter.get('/findGame/byName/:name', async(req,res)=>{
    if(!req.params.name){
        return res.status(400).send();
    }

    const games = await GameList.getByName(req.params.name);
    return res.status(200).json(games);
})

gameFinderRouter.get('/findGame/byId/:id', async(req,res)=>{
    if(!req.params.id || !Number.isInteger(Number(req.params.id))){        
        return res.status(400).send();
    }

    const gameId = parseInt(req.params.id);
    const games = await GameList.getById(gameId);
    return res.status(200).json(games);
})


export { gameFinderRouter };
