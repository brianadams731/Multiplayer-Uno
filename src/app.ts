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
import { User } from './models/User';
import { GameUser } from './models/GameUser';

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

app.use('/public', express.static('public', { extensions: ['html'] }));

io.on('connection', (socket) => {
    socket.on("game-load", async (req)=>{
        const userId = (socket.request as any).session.userId
        const gameId = req.gameId;
        
        // TODO SWITCH TO GAME USER!
        const user = await GameUser.getGameUserByUidGid(userId, gameId);

        if(!user){
            socket.emit("failed-to-join","user-or-gameId-does-not-exist")
            return;
        }
        
        socket.join(gameId);

        socket.emit("init-game",{

        });
        
        io.to(gameId).emit("player-joined", {
            username: user.username
        })
    })
});

server.listen(process.env.PORT || '8080', () => {
    console.log(
        `Server running at http://localhost:${process.env.PORT || '8080'}/`
    );
});
