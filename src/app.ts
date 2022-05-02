import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}
import express from 'express';
import {app, server, io} from "./utils/server";
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

app.use('/public', express.static('public', { extensions: ['html'] }));

io.on('connection', (socket) => {
    //socket.on('message', message);
});

server.listen(process.env.PORT || '8080', () => {
    console.log(
        `Server running at http://localhost:${process.env.PORT || '8080'}/`
    );
});
