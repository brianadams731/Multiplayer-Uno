import dotenv from "dotenv";
if(process.env.NODE_ENV === 'development') {
    dotenv.config();
}
import express from "express";

import { exampleRoute } from "./routes/exampleRoute";

const app = express();
app.use(express.json());
app.use("/tests",exampleRoute);

app.get("/",(req,res)=>{
    return res.send("Landing Page");
})

app.listen(process.env.PORT||"8080",()=>{
    console.log(`Server running at http://localhost:${process.env.PORT||"8080"}/`);
})

