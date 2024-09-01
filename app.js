const express = require('express')
const cors = require("cors");

const User=require('./entity/users')

const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(
    cors({
      origin: "*",
      methods: ["GET", "PUT", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
      credentials: true,
    })
  );

app.get('/',async(req,res)=>{
    return res.send("Server Started")
})

app.post('/save',async(req,res)=>{
    var username=req.body.username;
    console.log(username)
    var data=await User.findOne({username:username})
      if(!data)
      {
        const user = new User({username});
        data = await user.save()
      } 
    console.log(data)
    return res.json(data)
})

app.post('/update',async(req,res)=>{
  var old_user=req.body.user;
  console.log(old_user);

  try{
    var user=await User.updateOne({_id:old_user._id},{$set:{max_streak:old_user.max_streak,current_streak:old_user.current_streak,solved:old_user.solved}})
    return res.json({success:"true",token:"",message:"Update Successfull"})
}
catch(e){
    return res.json({success:"false",token:"",message:"Update Unsuccessfull"})
}
})

app.listen(5000,()=>{
    console.log('Server Started Listening ...')
})