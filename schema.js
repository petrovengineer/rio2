const {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLBoolean,
    GraphQLInputObjectType
} = require('graphql');
const {User, Customer, FoodType, Order, Food, Ingredient, IngType, Param, ParamListItem} = require('./models');

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
        food: {type: CartFoodType},
        count: {type: GraphQLInt},
        coast: {type: GraphQLInt},
        ingredients: {type: new GraphQLList(CartIngType)},
        selected: {type: new GraphQLList(CartSelType)}
    })
})

const CartFoodType = new GraphQLObjectType({
    name:'CartFoodType',
    fields: ()=>({
        name: {type: GraphQLString}, 
        composition: {type: GraphQLString}, 
        coast: {type: GraphQLInt}
    })
})

const CartIngType = new GraphQLObjectType({
    name:'CartIngType',
    fields: ()=>({
        name: {type: GraphQLString}, 
        coast: {type: GraphQLInt}
    })
})

const CartSelType = new GraphQLObjectType({
    name:'CartSelType',
    fields: ()=>({
        name: {type: GraphQLString}, 
        pname: {type: GraphQLString}, 
        coast: {type: GraphQLInt}
    })
})

const IngredientType = new GraphQLObjectType({
    name: 'IngredientType',
    fields: ()=>({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        exist: {type: GraphQLBoolean},
        visible: {type: GraphQLBoolean},
        coast: {type: GraphQLInt},
        type: {type: IngredientTypeType,
        resolve:(ingredient)=>{
            return IngType.findOne({_id: ingredient.type})
        }}
    })
})

const IngredientTypeType = new GraphQLObjectType({
    name: 'IngredientTypeType',
    fields:()=>({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
    })
})

const FoodTypeGQ = new GraphQLObjectType({
    name: 'FoodTypeGQ',
    fields:(args)=>({
        _id: {type: GraphQLString},
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
        composition:{type: GraphQLString},
        weight: {type: GraphQLString},
        img: {type: ImgType},
        coast: {type: GraphQLInt},
        params:{type: GraphQLList(ParamType),
            resolve:(food)=>{
                return Param.find({_id: food.params});
            }
        }
    })
})
const ParamType = new GraphQLObjectType({
    name: 'ParamType',
    fields:()=>({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        list: {type: new GraphQLList(ParamListType)}
    })
})

const ParamListType = new GraphQLObjectType({
    name: 'ParamListType',
    fields:()=>({
        name: {type: GraphQLString},
        coast: {type: GraphQLInt},
    })
})

const ImgType = new GraphQLObjectType({
    name: 'ImgType',
    fields:()=>({
        data: {type: GraphQLString,
        resolve:(img)=>{
            return Buffer(img.data, 'binary').toString('base64')
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
            resolve: async (root, args, req )=>{
                const customer = await Customer.findOne({phone:req.phone})
                return await Order.find({customer:customer._id}, {}, { sort: { 'created' : -1 }})
            }
        },
        food:{
            type: new GraphQLList(FoodTypeGQ),
            args:{
                _id: {type: GraphQLString}
            },
            resolve: async (parent, args)=>{
                return await Food.find({foodTypes:args._id})
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

const OrderInputType = new GraphQLInputObjectType({
    name:'OrderInputType',
    fields: ()=>({
        number:{type: GraphQLString},
        name: {type: GraphQLString},
        phone: {type: GraphQLString},
        cart: {type: new GraphQLList(CartInputType)},
        address:{type: GraphQLString},
        apnumber:{type: GraphQLString},
        floor:{type: GraphQLString},
        pay:{type: GraphQLString},
        comment:{type: GraphQLString}
    })
})

const CartInputType = new GraphQLInputObjectType({
    name:'CartInputType',
    fields: ()=>({
        food: {type: GraphQLString},
        count: {type: GraphQLInt},
        coast: {type: GraphQLInt},
        ingredients: {type: new GraphQLList(GraphQLString)},
        selected: {type: new GraphQLList(SelectedInputType)}
    })
})

const SelectedInputType = new GraphQLInputObjectType({
    name: 'SelectedInputType',
    fields: ()=>({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        pname: {type: GraphQLString}
    })
})

const IngredientInputType = new GraphQLInputObjectType({
    name: 'IngredientInputType',
    fields: ()=>({
        _id: {type: GraphQLString}
    })
})
// const SelectedInputType = new GraphQLInputObjectType({
//     name: 'SelectedInputType',
//     fields: ()=>({
//         name: {type: GraphQLString},
//         pname: {type: GraphQLString}
//     })
// })

// const IngredientInputType = new GraphQLInputObjectType({
//     name: 'IngredientInputType',
//     fields: ()=>({
//         name: {type: GraphQLString}
//     })
// })

const MutationRootType = new GraphQLObjectType({
    name: 'MutationRootType',
    fields:()=>({
        makeOrder:{
            type: OrderType,
            args:{
                input:{type: OrderInputType}
            },
            resolve: async (root, {input}, req)=>{
                try{
                    console.log("MUTATION");
                    const last = await Order.findOne({},{}, { sort: { 'created' : -1 }});
                    const customer = await Customer.findOne({phone:req.phone});
                    let cId = null;
                    if(customer!=null){cId = customer._id;}
                    const newCart = [];
                    console.log("INPUT CART", input.cart);
                    for(let i=0; i<input.cart.length; i++){
                        let good = input.cart[i];
                        const food = await Food.findOne({_id: good.food});
                        const ings = await Ingredient.find({_id:good.ingredients});
                        const params = await Param.find({_id:good.selected.map(p=>p._id)});
                        const prms = good.selected.map(
                            p=>{
                                const param = params.find(param=>param.name===p.pname);
                                const coast = param.list.find(pl=>pl.name===p.name).coast;
                                return {name:p.name, pname: p.pname, coast: coast}
                            }
                        )
                        const ingsCoast = ings.map(i=>i.coast).reduce((akk, cur)=>(akk+cur),0);
                        const selCoast = prms.map(p=>p.coast).reduce((akk, cur)=>(akk+cur),0);
                        const coast = (food.coast+ingsCoast+selCoast)*good.count;
                        newCart.push({
                            food:{name:food.name, composition: food.composition, coast: food.coast},
                            count: good.count,
                            coast: coast,
                            ingredients: ings.map(i=>({name: i.name, coast:i.coast, weight: i.weight})),
                            selected: prms
                        });
                    }
                    console.log("NEWCART", newCart);
                    const order = new Order({
                        customer: cId,
                        number: last==null?1:last.number+1,
                        cart: newCart,
                        address:input.address,
                        apnumber:input.apnumber,
                        floor:input.floor,
                        pay:input.pay,
                        comment:input.comment
                    });
                    const newOrder = await order.save();
                    return newOrder;
                }
                catch(err){
                    console.log(err);
                }
            }
        }
    })
})

const MainSchema = new GraphQLSchema({
    query: QueryRootType,
    mutation: MutationRootType
})

module.exports = MainSchema;