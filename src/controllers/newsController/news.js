const client = require("../../cacheManager")
const User = require("../../models/User/UserSchema")


const getDefaultPreferencedNews = async(req,res)=>{
  console.log('getting default preferenced news' ,req.user)
  try{
    const preferences = req.user.news_preference
    let cachedPreferences = await client.get("user_preferences")
    console.log(cachedPreferences,'data from cache')
    if(cachedPreferences) {res.status(200).send({data:JSON.parse(cachedPreferences)})
  return}

      let promises = []
      for(const preference of preferences){
        promises.push(await fetch(`https://newsapi.org/v2/everything?q=${preference}&apiKey=${process.env.API_KEY}`))
      }
      // console.log(promises,' promises')
       cachedPreferences= await Promise.all(promises.map(promise=>promise.json()))
      let cacheResp = await client.set("user_preferences",JSON.stringify(cachedPreferences))
      console.log(cacheResp,'cache stored')
    res.status(200).send({data: JSON.parse(cachedPreferences)})

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
      // saving modified preferences data in cache 
      let promises = []
      for(const preference of modifiedPreferences){
        promises.push(await fetch(`https://newsapi.org/v2/everything?q=${preference}&apiKey=${process.env.API_KEY}`))
      }
      // console.log(promises,' promises')
       let cachedPreferences= await Promise.all(promises.map(promise=>promise.json()))
       let cacheResp = await client.set("user_preferences",JSON.stringify(cachedPreferences))
      console.log(cacheResp,'cache stored')
      user.save()
      // saving updated data 
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
