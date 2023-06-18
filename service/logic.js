//import the db.js to this page

const db = require('./db')

//import json web token

const jwt= require('jsonwebtoken')

//register logic
register = (acno1, uname, psw) => {
    return db.User.findOne({ acno: acno1 }).then(user => {
        if (user) {
            return {
                message: 'user already present',
                status: false,
                statusCode: 404
            }
        }
        else {
            newuser = new db.User({
                acno: acno1,
                uname: uname,
                psw: psw,
                balance: 0,
                transaction: []

            })
            //to reflect the changes done by server in database
            newuser.save()
            return {
                message: 'registered successfully',
                status: true,
                statusCode: 200

            }


        }
    })
}

//login logic

login = (acno, psw) => {
    return db.User.findOne({ acno, psw }).then(user => {
        if (user) {
            //token generation
            const token=jwt.sign({acno},'bankKey123')
         return{
            message: 'login success',
            status: true,
            statusCode: 200,
            currentUsername:user.uname,
            currentAcno:acno,
            token

         }
        }
        else {
            return {
                message: 'incorrect acno or password',
                status: false,
                statusCode: 404

            }
        }
    })
}
getUser=(acno)=>{
  return db.User.findOne({acno}).then(user=>{
        if(user){
             return {
                message:user,
                status: true,
                statusCode: 200

             }
        }
        else{
            return {
                message: 'user not exist',
                status: false,
                statusCode: 404

            }
        }
    })
}

getBalance=(acno)=>{
    return db.User.findOne({acno}).then(user=>{
        if(user){
           return {
            message:user.balance,
            status: true,
                statusCode:200

           }
        }
        else{
            return {
                message: 'user not exist',
                status: false,
                statusCode: 404

            }

        }
    })
}

moneyTransfer=(fromAcno,toAcno,amount,psw,date)=>{
 return db.User.findOne({acno:fromAcno,psw}).then(fromUser=>{
    if(fromUser){
        return db.User.findOne({acno:toAcno}).then(toUser=>{
            if(toUser){
               amount=parseInt(amount)
               if(amount>fromUser.balance){
                return {
                    message: 'Insufficient balance',
                    status: false,
                    statusCode: 404
    
                }
                }else{
                    //balance update
                    fromUser.balance=fromUser.balance-amount
                    //push the details to transaction object in the model in db
                    fromUser.transaction.push({type:'DEBIT',amount,date})
                    //save this changes in database
                    fromUser.save()

                   // changes in recepient array
                   toUser.balance=toUser.balance+amount
                   toUser.transaction.push({type:'CREDIT',amount,date})
                   toUser.save()

                   return {
                    message: 'Transaction success',
                    status: true,
                    statusCode: 200
    
                }

                }

            }
            else{
                return {
                    message: 'Invalid credit credentials',
                    status: false,
                    statusCode: 404
    
                }
            }
         })
    }
    else{
        return {
            message: 'Invalid debit credentials',
            status: false,
            statusCode: 404

        }
    }
  })
}

//transaction history
getTransaction=acno=>{
  return  db.User.findOne({acno}).then(user=>{
        if(user){
            return {
                message: user.transaction,
                status: true,
                statusCode: 200

            }

        }else{
            return {
                message: 'user not exist',
                status: false,
                statusCode: 404
    
            }
    
        }
    })
}






module.exports = {
    register,login,getUser,getBalance,moneyTransfer,getTransaction
}