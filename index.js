const express = require('express');
require('dotenv').config();
require('./mongo');
const { buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema');

const app = express();
let port = 3100;

app.use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    }),
  );
          

app.listen(port);
console.log('GraphQL API server running at localhost: ' + port);