const User = require("../../models/User/UserSchema")


const getDefaultPreferencedNews = async(req,res)=>{
  console.log('getting default preferenced news' ,req.user)
  try{

    const preferences = req.user.news_preference
    let promises = []
    for(const preference of preferences){
      promises.push(await fetch(`https://newsapi.org/v2/everything?q=${preference}&apiKey=${process.env.API_KEY}`))
    }
    // console.log(promises,' promises')
    const finalData = await Promise.all(promises.map(promise=>promise.json()))
    res.status(200).send({data: finalData})

  }catch(err){
    res.status(500).send({err:err.message})
  }

  // for(const )

}

const getUserPreferences = async(req,res)=>{
  console.log('getting preferences of user',req.user)
  try{
    const preferences = req.user.news_preference
    if(preferences) {
      res.status(200).send({data: preferences})
    }
  }catch(err){
    res.status(500).send({err:err.message})
  }
}
const updateUserPreferences = async(req,res)=>{
  console.log('updatingn preferenced news',req.body.preferences)
  try{
    if(req.body.preferences?.length > 0){
      const userPreferences = req.body.preferences
      const user = await User.findOne({email: req.user.email})
      const modifiedPreferences = [...new Set([...user.news_preference,...userPreferences])]
      user.news_preference = modifiedPreferences
      user.save()
      res.status(200).send({data: user.news_preference})
    }else {
      res.status(402).send({err: 'malformed request'})
    }
  }catch(err){
    res.status(500).send({err:err.message})
  }
}

module.exports ={
  getUserPreferences,
  updateUserPreferences,
  getDefaultPreferencedNews
}
