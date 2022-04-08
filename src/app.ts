import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}
import express from 'express';
import { engine } from 'express-handlebars';

import { exampleRoute } from './routes/exampleRoute';
import { staticRoutes } from './routes/staticRoutes';
import { viewRoutes } from './routes/viewRoutes';

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());

app.use(staticRoutes);
app.use(viewRoutes);
app.use('/tests', exampleRoute);
app.use('/public', express.static('public', { extensions: ['html'] }));

app.listen(process.env.PORT || '8080', () => {
    console.log(
        `Server running at http://localhost:${process.env.PORT || '8080'}/`
    );
});
