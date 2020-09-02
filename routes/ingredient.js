const express = require('express');
const router = express.Router();
const {Ingredient} = require('../models');
const {authenticateToken, isAdmin} = require('./auth');

router.get('/', async (req, res)=>{
    console.log("INGS")
    let filter = {};
    if(req.query.filter!=null){
        filter = JSON.parse(req.query.filter)
    }
    try{
        const ingredients = await Ingredient.find(filter);
        res.send(ingredients);
    }
    catch(err){res.sendStatus(500)}
})

router.post('/', authenticateToken, isAdmin, async (req, res)=>{
    try{
        const {name, exist = false, visible = false} = req.body;
        if(name!=null){
            await Ingredient.create({name, exist, visible});
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
        await Ingredient.findByIdAndUpdate(_id, update);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isAdmin, async (req, res)=>{
    const {id} = req.query;
    try{
        if(id!=null){
            await Ingredient.findByIdAndDelete(id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;