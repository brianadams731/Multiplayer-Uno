import express from 'express';

const logoutRouter = express.Router();

logoutRouter.get('/logout', async (req, res) => {
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send("Error: Cannot Log out");
        }
        return res.redirect("/");
    });
});

export { logoutRouter };
