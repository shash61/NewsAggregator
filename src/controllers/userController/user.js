const User = require("../../models/User/UserSchema")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const signUp = async (req,res)=>{
 console.log('signinup started')
 try{
   const user = await new User({
     name: req.body.name,
     email: req.body.email,
     password: bcrypt.hashSync(req.body.password, 10)
    }).save()
    if(user){
      res.status(200).send({message: 'user registered successfully'})
    }
  }
  catch(err){
   console.log(err)
   res.status(500).send({err:err.message || err})
  }

}

const signIn = async (req,res)=>{
  console.log('sign in ')
  try{
    const user = await User.findOne({email: req.body.email})
    if(!user){
      return res.status(404).send({message:'user not found'})
    }
    const isValidPass = bcrypt.compareSync(req.body.password, user.password)
    if(!isValidPass){
      return res.status(401).send({message:'invalid pass'})
    }
    console.log(user.id,'userid')
    let token = jwt.sign({
      id: user._id
    },'shhhhh',{
      expiresIn: '1h'
    })
    res.status(200).send({
      user: user,
      message:"Logined successfully",
      accessToken: token
    })
  }catch(err){
    res.status(500).send({err: err.message})
  }
}

module.exports = {
  signUp,
  signIn
}