import express from "express";
import { getRepository } from "typeorm";
import { Example } from "../models/Example";

const exampleRoute = express.Router();

exampleRoute.get("/", async (req,res)=>{
    const example = new Example();
    example.testString = `Hello at ${Date.now()}`
    try{
        await example.save();
        const retVal = await getRepository(Example).createQueryBuilder("example")
        .getMany();
        return res.status(201).json(retVal);
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }

})

export { exampleRoute };