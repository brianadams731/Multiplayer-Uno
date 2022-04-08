import express from 'express';

const viewRoutes = express.Router();



viewRoutes.get('/hbtest',(req,res)=>{
    return res.render(`test`,{
        test:"From Router"
    })
})

export { viewRoutes };
