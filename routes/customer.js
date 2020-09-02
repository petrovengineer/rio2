const express = require('express');
const router = express.Router();
const {Customer} = require('../models');
const {authenticateToken, isAdmin, isSuper} = require('./auth');

router.get('/', authenticateToken, isAdmin, async (req, res)=>{
    try{
        res.send(await Customer.find(req.query));
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.put('/', authenticateToken, isAdmin, async (req, res)=>{
    const {_id} = req.body;
    const update = Object.assign({}, req.body);
    delete update._id;
    try{
        await Customer.findByIdAndUpdate(_id, update);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isSuper, async (req, res)=>{
    const {_id} = req.query;
    try{
        if(_id!=null){
            await Customer.findByIdAndDelete(_id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;