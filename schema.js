const {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema
} = require('graphql');
const {User, Customer, FoodType} = require('./models');

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
    })
})

const FoodTypeType = new GraphQLObjectType({
    name: 'FoodType',
    fields: ()=>({
        _id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString}
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
        }
    })
})

const MainSchema = new GraphQLSchema({
    query: QueryRootType
})

module.exports = MainSchema;