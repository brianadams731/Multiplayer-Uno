import { ConnectionOptions } from "typeorm";
import dotenv from "dotenv";
import { Example } from "../models/Example";
if(process.env.NODE_ENV === 'development'){
    dotenv.config();
}

const connectionConfig:ConnectionOptions = {
    type:"postgres",
    url: process.env.DATABASE_URL,
    logging: false,
    synchronize: true,
    ssl: process.env.NODE_ENV !== 'development',
    extra:process.env.NODE_ENV !== 'development'?{
        ssl:{
            rejectUnauthorized: true
        }
    }:undefined,
    entities:[
        Example,
    ],
}

export { connectionConfig };