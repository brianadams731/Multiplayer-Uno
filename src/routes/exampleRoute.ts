import express from "express";
import { Example } from "../models/Example";

const exampleRoute = express.Router();

exampleRoute.get("/", async (req,res)=>{
    const example = new Example();
    example.testString = `Hello at ${Date.now()}`
    try{
        await example.save();
        return res.status(201).json(example);
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }

})

export { exampleRoute };