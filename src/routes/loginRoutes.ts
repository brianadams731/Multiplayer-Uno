import express from 'express';
import { connect } from 'http2';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { connection } from '../utils/connection';
import { checkHashedPasswordAsync } from '../utils/passwordHash';

const loginRouter = express.Router();

loginRouter.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username && !password) {
        return res.status(400).send('Error: Malformed Request');
    }
    let user: any[] = [];
    try {
        user = await connection.any(
            `
            SELECT uid, password
            FROM "User"
            WHERE username = $1
        `,
            [username]
        );
    } catch (error) {
        console.log(error);
    }
    if (user.length === 0) {
        return res.status(404).send('Error: User not found');
    }
    const passMatch = await checkHashedPasswordAsync(password, user[0].password);
    if(passMatch){
        req.session.userId = user[0].uid;
        return res.status(200).send('Success: Logged in');
    }
    return res.status(401).send("Error: Invalid Credentials");
});

loginRouter.get('/loginTest', requireWithUserAsync, async (req, res) => {
    try {
        const user = await connection.any(
            `
            SELECT username
            FROM "User"
            WHERE uid = $1
        `,
            [req.userId]
        );
        console.log(user);
        return res.status(200).send(user[0].username);
    } catch (err) {
        return res.status(500).send('Error');
    }
});

export { loginRouter };
