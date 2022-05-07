import express from 'express';
import path from 'path';
import { pageReqAuth } from '../middleware/pageReqAuth';
import { GameState } from '../models/GameState';

const staticRoutes = express.Router();

staticRoutes.get('/', (req, res) => {
    return res.sendFile('index.html', {
        root: path.join(__dirname, '../../public/'),
    });
});
staticRoutes.get('/login', (req, res) => {
    return res.sendFile('login.html', {
        root: path.join(__dirname, '../../public/'),
    });
});
staticRoutes.get('/register', (req, res) => {
    return res.sendFile('register.html', {
        root: path.join(__dirname, '../../public/'),
    });
});
staticRoutes.get('/about', (req, res) => {
    return res.sendFile('index.html', {
        root: path.join(__dirname, '../../public/'),
    });
});

staticRoutes.get('/joinLobby', pageReqAuth, (req, res) => {
    return res.sendFile('joinLobby.html', {
        root: path.join(__dirname, '../../public/'),
    });
});
staticRoutes.get('/createLobby', pageReqAuth, (req, res) => {
    return res.sendFile('createLobby.html', {
        root: path.join(__dirname, '../../public/'),
    });
});
staticRoutes.get('/dashboard', pageReqAuth, (req, res) => {
    return res.sendFile('dashboard.html', {
        root: path.join(__dirname, '../../public/'),
    });
});

staticRoutes.get('/gameLobby/:gameId', pageReqAuth, async (req, res) => {
    if (!req.params.gameId) {        
        return res.redirect('/joinLobby');
    }
    try {
        const hasStarted = await GameState.gameHasStarted(req.params.gameId);
        if (hasStarted) {
            return res.redirect(`/play/${req.params.gameId}`);
        }
    } catch (error) {
        console.log(error);
        return res.redirect('/joinLobby');
    }
    return res.sendFile('gameLobby.html', {
        root: path.join(__dirname, '../../public/'),
    });
});

export { staticRoutes };
