const  {PubSub, withFilter}  = require('graphql-subscriptions');


const pubsub = new PubSub();
const filter = new withFilter()

module.exports  = {pubsub}