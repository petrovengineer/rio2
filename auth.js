const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User, Customer} = require('./models');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GLOGIN,
      pass: process.env.GPASS
    }
  });

router.post('/login', async (req, res)=>{
        try{
            if(req.body.email==null || req.body.password==null){res.sendStatus(500)}
            const email = req.body.email;
            const user = await User.findOne({email}).populate('customer');
            if(user==null || user.active == false){
                return res.sendStatus(400);
            }
            if(await bcrypt.compare(req.body.password, user.password)){
                console.log("OK")
                const accessToken = generateAccessToken({email, admin: user.admin});
                const refreshToken = jwt.sign(email, process.env.REFRESH_TOKEN_SECRET);
                user.refreshToken = refreshToken;
                await user.save();
                res.send({accessToken, refreshToken, customer:user.customer});
            }else{
                res.sendStatus(401);
            }
        }
        catch{
            res.sendStatus(500);
        } 
})

function generateAccessToken({email, admin}){
    return jwt.sign({email, admin}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '365d'});
}

router.post('/refresh', (req, res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({email: user.email});
        res.send({accessToken});
    })
})

router.delete('/logout', (req, res)=>{
    refreshTokens = refreshTokens.filter((token)=>token!=req.body.token);
    res.sendStatus(204);
})

router.post('/reg', async (req, res)=>{
    console.log(req.body);
    try{
        const {email, password, name = 'Новый пользователь', phone = 'не указан', address = 'не указан'} = req.body;
        const exist = await User.findOne({email});
        if(email != null && password != null && exist == null){
            const hashedPassword = await bcrypt.hash(password, 10);
            let code = Math.random().toString(36).substring(7);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email, 
                password: hashedPassword, 
                code
            });
            const customer = new Customer({
                _id: new mongoose.Types.ObjectId(),
                name, phone, address,
            });
            user.customer = customer._id;
            await transporter.sendMail({
                from: 'riopizza777@gmail.com',
                to: email,
                subject: "Подтверждение почты",
                html: `<h3>Перейдите по ссылке для подтверждения: <a href="
                ${process.env.API}/auth/activate?id=${user._id}&code=${code}">ПОДТВЕРДИТЬ</a></h3>`,
              });
            await user.save();
            await customer.save();
            res.sendStatus(200);
        }
        else res.sendStatus(500);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.get('/activate', async (req, res)=>{
    const {code, id} = req.query;
    const user = await User.findById({_id:id}, {password:0});
    if(user!=null && user.code === code){
        user.active = true;
        await user.save();
        res.redirect(process.env.HOST+'/?a=ok');
    }else {
        res.sendStatus(500);
    }
})

router.get('/makeadmin', authenticateToken, async (req, res)=>{
    try{
        const {id} = req.query;
        if(req.email === 'petrovengineer@gmail.com'){
            const user = await User.findById({_id:id}, {password:0});
            if(user!=null){
                user.admin = true;
                await user.save();
                res.sendStatus(200);
            }else {
                res.sendStatus(500);
            }
        }
        else {
            res.sendStatus(500);
        }
    }
    catch(err){
        res.sendStatus(500);
    }
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null){
        next();
        // res.sendStatus(401)
    }else{
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(user!=null){
            req.email = user.email; 
            req.admin=user.admin;
        }
        next();
    })}
}

module.exports.isAdmin = (req, res, next)=>{
    if(req.admin === true){
        next();
    }
    else{
        res.sendStatus(402);
    }
}

module.exports.isSuper = (req, res, next)=>{
    if(req.email=='petrovengineer@gmail.com'){
        next();
    }
    else{
        res.sendStatus(402);
    }
}

module.exports.authenticateToken = authenticateToken;
module.exports.router = router;