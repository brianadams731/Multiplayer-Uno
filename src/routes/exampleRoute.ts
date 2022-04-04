import express from 'express';
import { connection } from '../utils/connection';

const exampleRoute = express.Router();

exampleRoute.get('/', async (req, res) => {
    try {
        connection.any(
            `INSERT INTO example ("testString") VALUES ('Hello at $1')`,
            [Date.now()]
        );

        const value = await connection.any(`
            SELECT "testString" 
            FROM example
        `);

        return res.status(200).json(value);
    } catch (e) {
        console.log(e);
        return res.status(500).send('Error');
    }
});

export { exampleRoute };
