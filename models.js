const mongoose = require('mongoose');
const {Schema} = require('mongoose');

module.exports.User = mongoose.model('User', 
    { 
        email: {type: String, default: null},
        password: String,
        refreshToken: String,
        customer: {type: Schema.Types.ObjectId, ref: 'Customer'},
        code: String,
        admin: {type: Boolean, default: false},
        active: {type: Boolean, default: false},
        created:  {type: Date, default: Date.now}
    });

module.exports.Customer = mongoose.model('Customer',
    {
        name: String,
        cart:[{type: Schema.Types.ObjectId, ref:'Food'}],
        phone: {type: String, required: true},
        email: String,
        address: String,
        apnumber: String,
        floor: String,
        changes:[{type: Schema.Types.ObjectId, ref:'Change'}],
        watched:[{type: Schema.Types.ObjectId, ref:'Food'}],
        wishlist:[{type: Schema.Types.ObjectId, ref:'Food'}]
    }
)

module.exports.Order = mongoose.model('Order',
    {
        number:{type: Number, default: 1},
        created: {type: Date, default: Date.now},
        done: {type: Date, default: null},
        status: {type: Number, min: 0, max:3, default: 0},
        cart:[{food: {type: Schema.Types.ObjectId, ref:'Food'}, 
            count: Number, ingredients:  [{type: Schema.Types.ObjectId, ref:'Ingredients'}]}],
        customer:{type: Schema.Types.ObjectId, ref:'Customer'},
        address:{type: String},
        apnumber:{type: String},
        floor:{type: String},
        pay:{type: String},
        comment:String
    }
)

module.exports.Food = mongoose.model('Food',
    {
        name: String,
        composition: String,
        ingredients: [{type: Schema.Types.ObjectId, ref: 'Ingredient'}],
        avIngTypes: [{type: Schema.Types.ObjectId, ref: 'IngType'}],
        foodTypes: [{type: Schema.Types.ObjectId, ref: 'FoodType'}],
        img: {data: Buffer, contentType: String},
        coast: {type: Number, default: null},
        params: [{type: Schema.Types.ObjectId, ref: 'Param'}],
        weight: {type: Number, default: 0}
    }
)
module.exports.Ingredient = mongoose.model('Ingredient',
    {
        name: String,
        exist: {type: Boolean, default: false},
        visible: {type: Boolean, default: false},
        type: {type: Schema.Types.ObjectId, ref: 'IngType'},
        coast: {type: Number, default: null},
        weight: {type: Number, default: 0}
    }
)
module.exports.IngType = mongoose.model('IngType',
    {
        name: String,
    }
)
module.exports.FoodType = mongoose.model('FoodType',
    {
        name: String,
    }
)
module.exports.Param = mongoose.model('Param',
    {
        name: String,
        list: [{name: String, coast: {type: Number, default: 0}}],
    }
)