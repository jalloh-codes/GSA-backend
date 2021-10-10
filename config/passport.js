const jwtStrategy = require('passport-jwt').Strategy
const ExtractJWt = require('passport-jwt').ExtractJWt

const mongoose = require('mongoose');
const passport = require('passport');
const Account  = mongoose.model('Account');
const Keys = require('./keys');

const options = {}

options.jwtFromRequest = ExtractJWt.fromAuthHeaderAsBearerToken();
options.secretOrKey = Keys.secretOrKey;

module.exports =  passport =>{
    passport.use(new jwtStrategy(options, (jwt_payload, done)=>{
        Account.findById(jwt_payload.id)
            .then(account =>{
                if(account){
                    done(null, account)
                }
                done(null, false)
            }).catch(error =>{
                return error
            })

    }))
}
