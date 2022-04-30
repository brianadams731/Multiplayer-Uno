import { log } from 'console';
import express from 'express';
import { connection } from '../utils/connection';
import { generateHashedPasswordAsync } from '../utils/passwordHash';

const registerRouter = express.Router();

registerRouter.post('/register', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if(!username && !password && !email){
        return res.status(400).send("Error: Malformed Request");
    }
    const hashedPass = await generateHashedPasswordAsync(password);
    try {
        const user = await connection.any(`
            INSERT INTO "User"(username, password, email)
            values($1, $2, $3)
            RETURNING uid;
        `,[username, hashedPass, email]);
        req.session.userId = user[0].uid;
        return res.status(200).send();
    } catch (error) {
        return res.status(409).send("Already Exists")
    }
});

export { registerRouter };
