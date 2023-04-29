const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, 'is invalid name']
  },
  email:{
    type:String,
    required: [true,"can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    unique: [true, "email already taken"]
  },
  password:{
    type:String,
    required: [true, "can't be blank"]
  },
  news_preference:{
    type:[String],
    required: true,
    default: ["top-headlines"]
  }
},{timestamps: true})

module.exports = mongoose.model('User', UserSchema)