import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}
import express from 'express';
import path from 'path';

import { exampleRoute } from './routes/exampleRoute';
import { staticRoutes } from './routes/staticRoutes';

const app = express();
app.use(express.json());

app.use(staticRoutes);
app.use('/tests', exampleRoute);
app.use('/public', express.static('public', { extensions: ['html'] }));

app.listen(process.env.PORT || '8080', () => {
    console.log(
        `Server running at http://localhost:${process.env.PORT || '8080'}/`
    );
});
