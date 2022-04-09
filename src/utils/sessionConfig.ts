import { MemoryStore, SessionOptions } from 'express-session';
import{ v4 as uuidv4} from "uuid";

const sessionConfig: SessionOptions = {
    secret: "test-secret", // TODO: Move to .env file
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore, // TODO: Set to save in db
    genid: function(req){
        return uuidv4();
    }
};

export { sessionConfig };
