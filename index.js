const {authenticateToken} = require('./auth');
const express = require('express');
require('dotenv').config();
require('./mongo');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema');
var bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');

const app = express();
let port = 3100;

app.use(cors());

app.use(bodyParser.json());

app.use('/graphql', authenticateToken, 
    (req,res, next)=>{console.log("PHONE ",req.phone); next();},
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    }),
  );

app.use('/auth',require('./auth').router);
          

app.listen(port);
console.log('GraphQL API server running at localhost: ' + port);