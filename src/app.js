const express = require('express')
const app = express()
const mongoose = require('mongoose');
const db = mongoose.connection;
const userRouter = require('./routes/userRouter/user')
const newsRouter = require('./routes/newsRouter/news');
const verifyToken = require('./middlewares/authJWT');
require('dotenv').config();
const PORT =  process.env.PORT || 5055

app.get('/',(req,res)=>{
  console.log('request generated at root route')
})


app.use(express.json())
app.use('/api/auth', userRouter)
app.use('/api/news', verifyToken, newsRouter)

mongoose.connect('mongodb://127.0.0.1:27017/playingaround',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.listen(PORT, ()=>{
  console.log(`server started on ${PORT}`)
})
