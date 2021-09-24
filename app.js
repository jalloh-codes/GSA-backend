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
const User = require('./model/User');
const bcrypt =  require('bcryptjs');


// must required the front id address Host Ip (localy or on a hosted server)
app.use(cors({origin: "*",  }));

//apply  Authanication to the Apiu route
app.use(auth);

// app.get('/confirmation/', async (req, res) => {
//   // const compare = await bcrypt.compareSync(args.input.password, accountExist.password)

//   // console.log('convirmed');
//   return res.redirect('http://localhost:8080/verified');
//   // return({
//   //   html: `<b>Hello user?</b>
//   //           <div> 
//   //               <p> Pleace verify your email addredd</p>
//   //           </div>`
//   // })
// });



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
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});