const express = require('express');
const router = express.Router();
const {User} = require('../models');
const {authenticateToken, isAdmin, isSuper} = require('./auth');

router.get('/', authenticateToken, isAdmin, async (req, res)=>{
    console.log(req.query);
    User.find(req.query, {password:0}).
    populate('customer').
    exec((err, users)=>{
        res.send(users);
    })
})

router.delete('/', authenticateToken, isSuper, async (req, res)=>{
    try{
        if(req.body.id!=null){
            User.findByIdAndDelete(req.body.id).
            exec((err, result)=>{
                if(err){res.sendStatus(500)}
                else{res.sendStatus(200)}
            })
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
    
})

module.exports = router;