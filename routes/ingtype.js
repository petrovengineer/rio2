const express = require('express');
const router = express.Router();
const {IngType} = require('../models');
const {authenticateToken, isAdmin} = require('./auth');

router.get('/', authenticateToken, async (req, res)=>{
    try{res.send(await IngType.find(req.query))}
    catch(err){res.sendStatus(500)}
})

router.post('/', authenticateToken, isAdmin, async (req, res)=>{
    try{
        const {name} = req.body;
        if(name!=null){
            await IngType.create({name});
            res.sendStatus(200);
        }   
        else{res.sendStatus(500)}
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
        await IngType.findByIdAndUpdate(_id, update);
        res.sendStatus(200);
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isAdmin, async (req, res)=>{
    const {id} = req.query;
    try{
        if(id!=null){
            await IngType.findByIdAndDelete(id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;