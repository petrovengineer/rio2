const express = require('express');
const router = express.Router();
const {Food} = require('../models');
const {authenticateToken, isAdmin} = require('./auth');
var multer = require('multer');
var upload = multer({ dest: './public/', limits: {
    fileSize: 10 * 1024 * 1024,
  }});
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

router.get('/', authenticateToken, async (req, res)=>{
    let filter = {};
    if(req.query.filter!=null){
        filter = JSON.parse(req.query.filter)
    }
    try{
        let food = await Food.find(filter, {},  { sort: { 'created' : -1 }});
        res.send(
            food.map((f)=>{
                return {
                    _id: f._id,
                    name: f.name,
                    ingredients: f.ingredients,
                    avIngTypes: f.avIngTypes,
                    foodTypes: f.foodTypes,
                    img: f.img.data!=null?{data: Buffer(f.img.data, 'binary').toString('base64'), contentType: String}:null,
                    coast: f.coast,
                    params: f.params
                };
            })
        );
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/', authenticateToken, isAdmin, async (req, res)=>{
    try{
        const {name, foodTypes=[]} = req.body;
        if(name!=null){
            const newFood = new Food({name});
            newFood.foodTypes.push(...foodTypes);
            await newFood.save();
            res.sendStatus(200);
        }   
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.post('/upload', upload.single('file'), async (req, res)=>{
    try{
    const {_id} = req.query;
    await sharp(fs.readFileSync(req.file.path))
      .resize(300, 300, {
        fit: sharp.fit.cover,
        // withoutEnlargement: true
      })
      .toFile(path.resolve(__dirname, '../public/temp'));
    await Food.findByIdAndUpdate(_id, {
        img: {data: fs.readFileSync(path.resolve(__dirname, '../public/temp')), contentType : req.file.mimetype}
    });
    res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.put('/', authenticateToken, isAdmin, async (req, res)=>{
    const {_id} = req.body;
    console.log(req.body);
    const update = Object.assign({}, req.body);
    delete update._id;
    try{
        const food = await Food.findByIdAndUpdate(_id, update);
        console.log("FOOD", food);
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
            await Food.findByIdAndDelete(id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;