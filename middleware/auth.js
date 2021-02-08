const jwt  = require('jsonwebtoken');
const keys = require("../config/keys");

module.exports = (req, res, next) =>{
    const authHeader = req.get("authorization");
    if(!authHeader){
      
        req.isAuth =  false;
        return next()
    }
    const bear = authHeader.split(' ')[0]
    const token = authHeader.split(' ')[1];
    if(!token || token === '' || !bear ||  bear != 'Bearer'){
        req.isAuth =  false
        return next();
    }
    let decodeToken
    try {
       decodeToken =  jwt.verify(token, keys.secretOrKey);
    
    } catch (error) {
        req.isAuth =  false
        return next();
    }
    if(!decodeToken){
        req.isAuth =  false
        return next();
    }

    req.isAuth = true;
    req.userID  = decodeToken.id;
    return next()
    

}