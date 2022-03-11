import express from "express";
import dotenv from "dotenv";
import { createConnection } from "typeorm";

import {connectionConfig} from "./utils/connectionConfig";
import { exampleRoute } from "./routes/exampleRoute";

if(process.env.NODE_ENV === 'development') {
    dotenv.config();
}
createConnection(connectionConfig);
const app = express();
app.use(express.json());
app.use("/test",exampleRoute);

app.get("/",(req,res)=>{
    return res.send("Landing Page");
})

app.listen(process.env.PORT||"8080",()=>{
    console.log(`Server running at http://localhost:${process.env.PORT||"8080"}/`);
})

