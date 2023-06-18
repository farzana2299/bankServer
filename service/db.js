// import mongoose library

const mongoose=require("mongoose")

mongoose.connect('mongodb://127.0.0.1:27017/bankServer')


// model for collection     //schema fields and values in model
const User=mongoose.model('User',{
    acno:Number,
    uname:String,
    psw:String,
    balance:Number,
    transaction:[]

})
//export the model 

module.exports={
    User
}