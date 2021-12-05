const express = require('express');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose =  require('mongoose');
// mongoose.set('useCreateIndex', true);
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')
const db = require('./config/keys').mongoURI;
const port = process.env.PORT || 8080;
const cors = require('cors')
const auth =  require('./middleware/auth'); 
const app = express();
const http = require('http')
const socketio = require('socket.io')

require('dotenv').config()

const server = http.createServer(app)
const io = socketio(server)
// must required the front id address Host Ip (localy or on a hosted server)
app.use(cors({origin: "*",  }));

io.on("connection", socket =>{
  //console.log("a user connected :D");
  console.log(socket.id);
  socket.on('chat', msg =>{
    console.log(msg);
    io.emit(msg);
    // socket.on('disconnect', () => {
    //   console.log('user disconnected');
    // });
  })
})

//apply  Authanication to the Api route
app.use(auth);

app.use('/graphql',  graphqlHttp({
   schema: graphqlSchema,
   rootValue: graphqlResolver,
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

// listen for requests
server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});