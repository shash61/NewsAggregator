const jwt = require('jsonwebtoken')
const User = require('../models/User/UserSchema')

const verifyToken = (req,res,next)=>{
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]==="JWT"){
   jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET , (err, decode)=>{
    if(err){
      req.user = undefined
      res.status(500).send({message: err.message})
    }
    else{
      User.findOne({
        _id: decode.id
      }).then(user=>{
        req.user= user
        next()
      }).catch(err=>{
        res.status(500).send({
          error:err.message
        })
      })
    }

   })
  }
  else {
    res.status(500).send({message: "Authorization header not provided" })
  }
}

module.exports = verifyToken