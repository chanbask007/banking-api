const {User,Account} = require('../models')

const jwt = require('jsonwebtoken')
const config = require('../config/db.config')

function jwtSignUser(user){
    const ONE_DAY = 60*60*24
    return jwt.sign(user, config.authentication.jwtSecret,{
        expiresIn : ONE_DAY
    })
}


module.exports = {
    async register(req,res){
        try{
            const user = await User.create(req.body)
            const userJson = user.toJSON()
            res.status(201).send({user:userJson,token:jwtSignUser(userJson)})
        }
        catch(err){
            res.status(400).send({
                error : 'email already exist.!'
            })
        }
    },

    async login(req,res){
        try{
            const email = req.body.email
            const password = req.body.password
            const user = await User.findOne({
                where:{
                    email: email
                }
            })

            if(!user){
                return res.status(403).send({
                    error: 'user does not exist.!'
                })
            }

            const isPasswordValid = password == user.password

            if(!isPasswordValid){
                return res.status(403).send({
                    error: 'The login information was incorrect!'
                })
            }
            const userJson = user.toJSON()

            res.status(200).send({
                user: userJson,
                role: userJson.role,
                token: jwtSignUser(userJson)
            })

        }
        catch(err){
            res.status(500).send({
                error: err
            })
        }

    },

    async makeTransaction(req,res){
        if(req.userData.role === 'customer'){
            try{
                const user = await User.findOne({where:{email:req.userData.email}})
                console.log(user);
                if(req.body.transactionType==='debit'){
                    console.log(user.balance,req.body.transactionAmount,req.body.transactionType);
                    if(user.balance > req.body.transactionAmount){


                            const account = await Account.create({
                            userEmail: req.userData.email,
                            transactionType: req.body.transactionType,
                            transactionAmount: req.body.transactionAmount
                        })


                       await  User.update({balance: user.balance - account.transactionAmount},{where:{email:user.email}})
                        res.status(201).send({customer:{email: req.userData.email,updatedBalance: user.balance - account.transactionAmount},transaction:account})

                    }
                    else{
                        res.status(403).send({msg:"No sufficient Fund!"})

                    }
                }

                if(req.body.transactionType==='credit'){
                    console.log(user.balance,req.body.transactionAmount,req.body.transactionType);


                            const account = await Account.create({
                            userEmail: req.userData.email,
                            transactionType: req.body.transactionType,
                            transactionAmount: req.body.transactionAmount
                        })


                      await User.update({balance: user.balance + account.transactionAmount},{where:{email:user.email}})
                        res.status(201).send({customer:{email:req.userData.email,updatedBalance:user.balance + account.transactionAmount},transaction:account})



                }

            }catch(err){res.send({error:err})}

        }
        else{
            res.status(403).send({msg:'only customers can make transactions!'})
        }







    },

    async accounts(req,res){
        try{
            const email = req.userData.email
            const role = req.userData.role
            if(role === 'customer'){
            const transactions = await Account.findAll({
                where:{
                    userEmail: email
                },
                order:[['id','DESC']]
            })
            // console.log('transactions',transactions);
            res.status(200).send({'customer':req.userData,'transactions':transactions})

        }
        else if(role === 'banker'){
            const users = await User.findAll({
                where:{
                    role: 'customer'
                }
            })
            res.status(200).send({'users': users})
        }

        else{
            res.status(403).send({"msg":"This action is not allowd for your role"})
        }
    }

        catch(err){
            res.send({error: err})

        }
    },

    async users(req,res){
        if(req.userData.role ==='banker'){
        try{
        const banker = req.userData
        const userTransactions = await User.findAll({where:{role:'customer'}})
        const data = userTransactions.map(user=>{
            return {
                email : user.email,
                balance: user.balance,
                details: `http://${req.headers.host}/users/${user.email}`

            }
        })

        res.status(200).send({
            "banker": banker,
            "users": data
        })
    }
    catch(err){
        res.send({"error": err})
        }
    }
    else{
        res.status(403).send({'msg':'unauthorized access'})
    }

    },
    async userId(req,res){
        if(req.userData.role==='banker'){
            // res.send({id:req.params.userId})
            try{
                const transactions = await Account.findAll({where:{userEmail:req.params.userId}})
                res.status(200).send({transactions: transactions})

            }catch(err){
                res.send({error:err})
            }
        }

    }

}
