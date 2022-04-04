import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}
import express from 'express';
import path from 'path';

import { exampleRoute } from './routes/exampleRoute';

const app = express();
app.use("/public",express.static('public',{extensions:['html']}));

app.use(express.json());
app.use('/tests', exampleRoute);

app.get('/', (req, res) => {
    return res.sendFile("index.html", { root : path.join(__dirname, '../public/')});
});

app.listen(process.env.PORT || '8080', () => {
    console.log(
        `Server running at http://localhost:${process.env.PORT || '8080'}/`
    );
});
