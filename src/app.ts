import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}
import express from 'express';
import { app, server, io } from './utils/server';
import { engine } from 'express-handlebars';
import session from 'express-session';

import { loginRouter } from './routes/loginRoutes';
import { logoutRouter } from './routes/logoutRoutes';
import { registerRouter } from './routes/registerRoutes';
import { staticRoutes } from './routes/staticRoutes';
import { viewRoutes } from './routes/viewRoutes';
import { sessionConfig } from './utils/sessionConfig';

import { socketSession } from './middleware/socketMiddleWare';
import { messageRouter } from './routes/messageRouter';
import { createGameRouter } from './routes/createGameRouter';
import { joinGameRouter } from './routes/joinGameRouter';
import { gameFinderRouter } from './routes/gameFinderRouter';
import { gameRouter } from './routes/gameRouter';
import { GameUser } from './models/GameUser';
import { Message } from './models/Message';
import { GameCards } from './models/GameCards';
import { GameState } from './models/GameState';
import { playCardRouter } from './routes/playCardRouter';

import { getUserRoom } from './utils/getUserRoom';

app.use(session(sessionConfig));
app.use(express.json());
io.use(socketSession);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(staticRoutes);
app.use(viewRoutes);

app.use('/api', loginRouter);
app.use('/api', logoutRouter);
app.use('/api', registerRouter);
app.use('/api', messageRouter);
app.use('/api', createGameRouter);
app.use('/api', joinGameRouter);
app.use('/api', gameFinderRouter);
app.use('/api', gameRouter);
app.use("/api", playCardRouter);

app.use('/public', express.static('public', { extensions: ['html'] }));

io.on('connection', (socket) => {
    // This event fires when a user loads into the game board
    socket.on("game-load", async (req)=>{                
        const userId = (socket.request as any).session.userId
        const gameId = req.gameId;
        
        const user = await GameUser.getGameUserByUidGid(userId, gameId);
        
        if(!user){
            socket.emit("failed-to-join","user-or-gameId-does-not-exist")
            return;
        }
        
        socket.join(gameId);
        socket.join(getUserRoom(userId,gameId));
        
        const gameMessages = await Message.getAllGameMessages(gameId)
        const cardsInHand = await GameCards.getUserCards(userId, gameId);
        const state = await GameState.getGameState(gameId);
        const gameUsers = await GameUser.getAllUsersInGame(gameId);        
                
        socket.emit("init-game",{
            messages: gameMessages,
            cards: cardsInHand,
            users: gameUsers,
            state,
            playerId: userId
        });
        
        io.to(gameId).emit("player-joined", {
            username: user.username,
            id: userId
        })
    })
});

server.listen(process.env.PORT || '8080', () => {
    console.log(
        `Server running at http://localhost:${process.env.PORT || '8080'}/`
    );
});
