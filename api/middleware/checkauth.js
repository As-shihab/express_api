

const jwt  = require('jsonwebtoken');

const auth_verify= (req , res ,next)=>{

    try{
        const token= req.headers['access_token'];
        const decoded = jwt.verify(token , JSON.stringify(process.env.AUTH_SECRET))
        const {email , userid, nickname , profile_path} = decoded; 
        req.email = email
        req.userid= userid
        req.nickname= nickname
        req.profile_path = profile_path
        
        next()
    }
    catch{
        next("auth error")
    }

}

module.exports = auth_verify