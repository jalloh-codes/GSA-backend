const express = require('express');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose =  require('mongoose');
// mongoose.set('useCreateIndex', true);
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const db = require('./config/keys').mongoURI;
const port = process.env.PORT || 8080;
const cors = require('cors')
const auth =  require('./middleware/auth'); 
const app = express();
const  user = require('./model/User')
const http = require('http')
const socketio = require('socket.io')

require('dotenv').config()


const server = http.createServer(app)
// must required the front id address Host Ip (localy or on a hosted server)
//app.use(cors({origin: "*",  }));

const io = socketio(server, {
  
  cors:{
    origin: '*'
  }
})
// origin: 'http://localhost:8080'

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   // console.log(socket);
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// })
// const pubsub = new PubSub();

//apply  Authanication to the Api route
app.use(auth);

app.use('/graphql',  graphqlHttp({
   schema: typeDefs,
   rootValue: resolvers,
   graphiql: true
}))


// database connection
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
  .then((res) => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

app.get('/msg', (req, res) =>{
  console.log('HELLO');
  return res.json({name: "GSA"})
})

require('./middleware/socket')(app, io, user)

// listen for requests
server.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});