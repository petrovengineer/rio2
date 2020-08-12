const {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLBoolean
} = require('graphql');
const {User, Customer, FoodType, Order, Food, Ingredient, IngType} = require('./models');

const UserType = new GraphQLObjectType({
    name:'UserType',
    fields:()=>({
        _id: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: GraphQLString},
        customer: {
            type: CustomerType,
            resolve: async (user)=>{
                return await Customer.findOne({_id: user.customer})
            }
        },
    })
})

const CustomerType = new GraphQLObjectType({
    name: 'CustomerType',
    fields:()=>({
        _id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString},
        phone: {type: GraphQLString},
        email: {type: GraphQLString},
        address: {type: GraphQLString},
        apnumber: {type: GraphQLString},
        floor: {type: GraphQLString},
    })
})

const FoodTypeType = new GraphQLObjectType({
    name: 'FoodTypeType',
    fields: ()=>({
        _id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString}
    })
})

const OrderType = new GraphQLObjectType({
    name: 'OrderType',
    fields: ()=>({
        _id: {type: new GraphQLNonNull(GraphQLString)},
        number: {type: GraphQLInt},
        created: {type: GraphQLString,
            resolve:(order)=>{
                return order.created.toISOString();
            }
        },
        done: {type: GraphQLString,
            resolve:(order)=>{
                return order.done?order.done.toISOString():null;
            }
        },
        status: {type: GraphQLInt},
        cart: {type: new GraphQLList(CartType)},
        customer: {type: CustomerType},
        address: {type: GraphQLString},
        apnumber: {type: GraphQLString},
        floor: {type: GraphQLString},
        pay: {type: GraphQLString},
        comment: {type: GraphQLString}
    })
})

const CartType = new GraphQLObjectType({
    name:'CartType',
    fields: ()=>({
        food: {type: FoodTypeGQ,
            resolve:(cart)=>{
                return Food.findOne({_id: cart.food})
            }
        },
        count: {type: GraphQLInt},
        ingredients: {type: new GraphQLList(IngredientType),
            resolve:(cart)=>{
                return Ingredient.find({_id: cart.ingredients})
            }
        }
    })
})

const IngredientType = new GraphQLObjectType({
    name: 'IngredientType',
    fields: ()=>({
        name: {type: GraphQLString},
        exist: {type: GraphQLBoolean},
        visible: {type: GraphQLBoolean},
        type: {type: IngredientTypeType,
        resolve:(ingredient)=>{
            return IngType.findOne({_id: ingredient.type})
        }}
    })
})

const IngredientTypeType = new GraphQLObjectType({
    name: 'IngredientTypeType',
    fields:()=>({
        name: {type: GraphQLString},
    })
})

const FoodTypeGQ = new GraphQLObjectType({
    name: 'FoodTypeGQ',
    fields:()=>({
        name: {type: GraphQLString},
        ingredients: {type: new GraphQLList(IngredientType),
            resolve:(food)=>{
                return Ingredient.find({_id: food.ingredients})
            }
        },
        avIngTypes: {type: new GraphQLList(IngredientTypeType),
            resolve:(food)=>{
                return IngType.find({_id: food.avIngTypes})
            }
        },
        foodTypes: {type: new GraphQLList(FoodTypeType),
            resolve:(food)=>{
                return FoodType.find({_id: food.foodTypes})
            }    
        },
        img: {type: ImgType},
        coast: {type: GraphQLInt}
    })
})

const ImgType = new GraphQLObjectType({
    name: 'ImgType',
    fields:()=>({
        data: {type: GraphQLString,
        resolve:(img)=>{
            return img.data.toString()
        }},
        contentType: {type: GraphQLString}
    })
})

const QueryRootType = new GraphQLObjectType({
    name:'QueryRootType',
    fields: ()=>({
        users:{
            type: new GraphQLList(UserType),
            resolve:async ()=>{
                return await User.find({});
            }
        },
        customers:{
            type: new GraphQLList(CustomerType),
            resolve:async ()=>{
                return await Customer.find({});
            }
        },
        foodtypes:{
            type: new GraphQLList(FoodTypeType),
            resolve: async ()=>{
                return await FoodType.find({})
            }
        },
        orders:{
            type: new GraphQLList(OrderType),
            resolve: async ()=>{
                return await Order.find({})
            }
        },
        food:{
            type: new GraphQLList(FoodTypeGQ),
            resolve: async ()=>{
                return await Food.find({})
            }
        },
        ingredients:{
            type: new GraphQLList(IngredientType),
            resolve: async ()=>{
                return await Ingredient.find({})
            }
        },
        ingtypes:{
            type: new GraphQLList(IngredientTypeType),
            resolve: async ()=>{
                return await IngType.find({})
            }
        },
    })
})

const MainSchema = new GraphQLSchema({
    query: QueryRootType
})

module.exports = MainSchema;