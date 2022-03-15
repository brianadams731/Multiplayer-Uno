import pgPromise from "pg-promise";

const pgp = pgPromise();
const connection = pgp(process.env.DATABASE_URL as string);



export {connection};
