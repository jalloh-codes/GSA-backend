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
const AWS = require('aws-sdk');
const aws = require('./config/keys')
require('dotenv').config()
// must required the front id address Host Ip (localy or on a hosted server)
app.use(cors({origin: "*",  }));

//apply  Authanication to the Apiu route
app.use(auth);

app.get('/confirmation/:key', async (req, res) => {
  const s3 = new AWS.S3({
    accessKeyId: aws.accessKey,
    secretAccessKey: aws.secretKey,
    Bucket: aws.bucketPost,
    region: aws.region
});
  const getImageFromS3 =  async (key) =>{
    const params =  {
        Bucket: aws.bucketPost,
        Key: key
    }
    const img = await s3.getObject(params).createReadStream()
    // // const img = await s3.getObject(params).promise();
    console.log(img);
    return img
  }
  const re = await getImageFromS3(req.params.key);

  console.log(req.params.key);
  return res.json({
    status: 'hello'
  })
});



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