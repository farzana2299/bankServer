//import server
const express=require("express")

//server creation
const server=express()

//covert the incoming json data to javascript
server.use(express.json())

//set port
server.listen(3000,()=>{
    console.log("___server started at port 3000____");
})
// server api resolve
server.post('/getexc',(req,res)=>{
    res.send("post request........")
})
server.post('/getexc2',(req,res)=>{
    res.send(".......post request 2........")
})
//import logic file
const logic=require('./service/logic')

//import cors
const cors=require('cors')

//import json web token
const jwt= require('jsonwebtoken')

//connect with front end
server.use(cors({origin:"http://localhost:4200"}))

// try catch method is used to solve the run time error

//middleware creation

const tokenMiddleware=(req,res,next)=>{
    try{
        const token=req.headers["access_token"]
        jwt.verify(token,'bankKey123')
        next()
     
    }
    catch{
        res.status(404).json({
            message:"token not verified",
            status:false,
            statusCode:404
        })

    }
}



//register-post

server.post('/register',(req,res)=>{
logic.register(req.body.acno,req.body.uname,req.body.psw).then(result=>{
    //convert into json and send
    res.status(result.statusCode).json(result)
})
})


// login-post
 server.post('/login',(req,res)=>{
    logic.login(req.body.acno,req.body.psw).then(result=>{
        res.status(result.statusCode).json(result)

    })
 })

// get user data-get
server.get('/getuser/:acno',tokenMiddleware,(req,res)=>{
    logic.getUser(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
 
    })
})

// balance-get
server.get('/getbalance/:acno',tokenMiddleware,(req,res)=>{
    logic.getBalance(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
  
    })
})

// money transfer-post
server.post('/transfer',(req,res)=>{
logic.moneyTransfer(req.body.fromAcno,
    req.body.toAcno,
    req.body.amount,
    req.body.psw,
    req.body.date).then(result=>{
        res.status(result.statusCode).json(result)

    })
})


// transaction history-get
server.get('/history/:acno',(req,res)=>{
    logic.getTransaction(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
  
    })
})

// delete accnt-delete