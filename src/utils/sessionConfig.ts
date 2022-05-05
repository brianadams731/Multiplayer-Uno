import session, { SessionOptions } from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import { connection } from './connection';

const sessionConfig: SessionOptions = {
    secret: 'test-secret', // TODO: Move to .env file
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 100 * 24 * 3600000
    },
    store: new (require('connect-pg-simple')(session))({
        pgPromise: connection,
        createTableIfMissing: true,
    }),
    genid: function (req) {
        return uuidv4();
    },
};

export { sessionConfig };
