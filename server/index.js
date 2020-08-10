const express = require('express');
const { buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');

const app = express();
let port = 3100;

let schema = buildSchema(`
  type Query {
    postTitle: String,
    blogTitle: String
  }
`);

let root = {
    postTitle: () => {
      return 'Build a Simple GraphQL Server With Express and NodeJS';
    },
    blogTitle: () => {
      return 'scotch.io';
    }
  };  

app.use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    }),
  );
          

app.listen(port);
console.log('GraphQL API server running at localhost: ' + port);