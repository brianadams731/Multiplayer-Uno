import express from 'express';

const viewRoutes = express.Router();

viewRoutes.get('/hbtest', (req, res) => {
    return res.render(`test`, {
        test: 'From Router',
    });
});

viewRoutes.get('/play', (req,res) =>{
    return res.render('uno',{
        layout: "game.handlebars"
    })
});

export { viewRoutes };
