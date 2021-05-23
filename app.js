const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose =  require('mongoose');
mongoose.set('useCreateIndex', true);
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')
const db = require('./config/keys').mongoURI;
const port = process.env.PORT || 8080;
const cors = require('cors')
const auth =  require('./middleware/auth');
const app = express();
//import { PubSub } from 'graphql-subscriptions';
//app.use(bodyParser.json());

// const corsOptions = {
//   origin: 'http://127.0.0.1:19006',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }


app.use(cors({origin: 'http://127.0.0.1:19000'}));

app.use(auth);

app.use('/graphql',  graphqlHttp({
   schema: graphqlSchema,
   rootValue: graphqlResolver,
   graphiql: true
}))

mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
  .then((res) => {
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