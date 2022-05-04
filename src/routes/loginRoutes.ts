import express from 'express';
import { requireWithUserAsync } from '../middleware/requiresWithUserAsync';
import { User } from '../models/User';
import { connection } from '../utils/connection';
import { checkHashedPasswordAsync } from '../utils/passwordHash';

const loginRouter = express.Router();

loginRouter.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username && !password) {
        return res.status(400).send('Error: Malformed Request');
    }
    const user = await User.getUserByUsername(username);

    if(!user){
        return res.status(404).send('Error: User not found');
    }
    
    const passMatch = await checkHashedPasswordAsync(password, user.password);
    if(passMatch){
        req.session.userId = user.id;
        return res.status(200).send();
    }
    
    return res.status(401).send("Error: Invalid Credentials");
});

loginRouter.get('/loginTest', requireWithUserAsync, async (req, res) => {
    const user = await User.getUserById(req.userId!);
    if(!user){
        return res.status(500).send('Error');
    }
    return res.status(200).send(user.username);
});

export { loginRouter };
