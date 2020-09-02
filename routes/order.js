const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Order, User, Change, Customer} = require('../models');
const {authenticateToken, isAdmin} = require('./auth');

router.get('/', authenticateToken, async (req, res)=>{
    let filter = {};
    if(req.query.filter!=null){
        filter = JSON.parse(req.query.filter)
    }
    try{
        Order.find(filter,{}, { sort: { 'created' : -1 }}).
        populate('cart.food').
        populate('customer').
        exec((err, docs)=>{
            console.log("DOCS ",docs);
            res.send(docs);
        })
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.post('/', authenticateToken, async (req, res)=>{
    try{
        const {cart, name, phone, email, address, apnumber, floor, comment} = req.body;
        if(cart.length>0){
            let user = null;
            if(req.email!=null){
                user = await User.findOne({email:req.email})
                .populate('customer');
            }else{
                var customer = await Customer.findOne({phone});
                if(customer==null){
                    customer = new Customer({_id: new mongoose.Types.ObjectId(), name, phone, address, apnumber, floor, email});
                    await customer.save();
                }else{
                    customer.name = name;
                    customer.email = email;
                    customer.address = address;
                    customer.apnumber = apnumber;
                    customer.floor = floor;
                    await customer.save();
                }
            }
            const last = await Order.findOne({},{}, { sort: { 'created' : -1 } })
            const newOrder = new Order({
                cart,
                customer: user!=null?user.customer._id:customer._id,
                comment,
                number: last==null?1:last.number+1
            });
            const saved = await newOrder.save();
            const order = await Order.findOne({_id:saved._id}).populate('cart.food');
            res.send(order);
        }   
        else{res.sendStatus(500)}
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.put('/', authenticateToken, isAdmin, async (req, res)=>{
    const {_id} = req.body;
    const update = Object.assign({}, req.body);
    delete update._id;
    try{
        await Food.findByIdAndUpdate(_id, update);
        res.sendStatus(200);
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isAdmin, async (req, res)=>{
    const {_id} = req.body;
    try{
        if(_id!=null){
            await Order.findByIdAndDelete(_id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;