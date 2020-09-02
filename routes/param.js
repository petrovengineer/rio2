const express = require('express');
const router = express.Router();
const {Param} = require('../models');
const {authenticateToken, isAdmin} = require('./auth');

router.get('/', authenticateToken, async (req, res)=>{
    let filter = {};
    if(req.query.filter!=null){
        filter = JSON.parse(req.query.filter)
    }
    try{
        const foodTypes = await Param.find(filter);
        res.send(foodTypes);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.put('/', authenticateToken, isAdmin, async (req, res)=>{
    console.log("PUT PARAMS", req.body);
    const {_id} = req.body;
    const update = Object.assign({}, req.body);
    delete update._id;
    try{
        await Param.findByIdAndUpdate(_id, update);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/', authenticateToken, isAdmin, async (req, res)=>{
    try{
        const {name} = req.body;
        if(name!=null){
            await Param.create({name});
            res.sendStatus(200);
        }   
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isAdmin, async (req, res)=>{
    const {id} = req.query;
    try{
        if(id!=null){
            await Param.findByIdAndDelete(id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;