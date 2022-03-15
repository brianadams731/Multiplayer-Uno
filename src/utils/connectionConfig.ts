import dotenv from "dotenv";
if(process.env.NODE_ENV === 'development'){
    dotenv.config();
}

const connectionConfig = {
    type:"postgres",
    url: process.env.DATABASE_URL,
    logging: false,
    synchronize: true,
    ssl: process.env.NODE_ENV !== 'development',
    extra:process.env.NODE_ENV !== 'development'?{
        ssl:{
            rejectUnauthorized: false
        }
    }:undefined,
    entities:[
    ],
}

export { connectionConfig };