const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose =  require('mongoose');
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')
const db = require('./config/keys').mongoURI
const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());


app.use('/graphql', graphqlHttp({
   schema: graphqlSchema,
   rootValue: graphqlResolver,
   graphiql: true
}))

mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

// listen for requests
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});