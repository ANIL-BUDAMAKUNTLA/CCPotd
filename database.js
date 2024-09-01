const Mongoose = require("mongoose")

Mongoose.set('strictQuery', false);
const db ='mongodb+srv://anil:anil@cluster0.jdkql.mongodb.net/'
Mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
        console.log("Connected to mongodb database")
    }).catch((err)=> console.log(err))

module.exports = Mongoose