import pgPromise from "pg-promise";

const connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl:process.env.NODE_ENV !== "development"?{
        rejectUnauthorized : false,
    }:undefined
}

const pgp = pgPromise();
const connection = pgp(connectionConfig);



export {connection};
