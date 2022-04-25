import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}
import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';

import { loginRouter } from './routes/loginRoutes';
import { logoutRouter } from './routes/logoutRoutes';
import { registerRouter } from './routes/registerRoutes';
import { staticRoutes } from './routes/staticRoutes';
import { viewRoutes } from './routes/viewRoutes';
import { sessionConfig } from './utils/sessionConfig';

import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketSession } from './middleware/socketMiddleWare';

const app = express();
const server = createServer(app);
const io = new Server(server);

const { message } = require('./socketRoutes/message')(io);

app.use(session(sessionConfig));
app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(staticRoutes);
app.use(viewRoutes);

app.use('/api', loginRouter);
app.use('/api', logoutRouter);
app.use('/api', registerRouter);

app.use('/public', express.static('public', { extensions: ['html'] }));

io.use(socketSession);

io.on('connection', (socket) => {
    socket.on('message', message);
});

server.listen(process.env.PORT || '8080', () => {
    console.log(
        `Server running at http://localhost:${process.env.PORT || '8080'}/`
    );
});
