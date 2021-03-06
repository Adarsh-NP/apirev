const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const user = require('../models/user')

router.post('/signup', (req, res, next)=> {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length>=1) {
            return res.status(409).json({
                message: 'email already registered'
            })
        }else {
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                    res.status(500).json({
                        error: err
                    })
                } else {
                    const user  = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User Created"
                        })
                    })
                    .catch(err=>(
                        res.status(500).json({
                            error: err
                        })
                    ))
                }
            })
        }
    })
    
    
})

router.post('/login', (req, res, next)=> {
    User.find({email: req.body.email}).exec()
    .then(user => {
        if(user.length<1){
            return res.status(401).json({
                message: "Auth failed"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=> {
            if(err){
                res.status(401).json({
                    message: "Auth failed"
                })
            }
            if(result){
               const token = jwt.sign({
                    email: user[0].email,
                    userID: user[0]._id 
                }, process.env.JWT_KEY, {
                    expiresIn: '1hr'
                })
                res.status(201).json({
                    message: "Auth successful",
                    token: token
                })
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.post('/forgot', (req, res, next)=> {
    User.find({email: req.body.email}).exec()
    .then(
        user => {
            if(user.length<1){
                return res.status(404).json({
                    message: "user with this mail doesn't exist"
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    if(err){
                        res.status(500).json({
                            error: err
                        })
                    } else {
                        User.update({email:req.body.email},{password: hash})
                        .exec()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "Password changed"
                            })
                        })
                        .catch(err=>(
                            res.status(500).json({
                                error: err
                            })
                        ))
                    }
                })
            }
        }

    )
    .catch(err=> {
        res.status(500).json({
            error: err
        })
    })
})

// router.post('/reset', (req, res, next)=> {
//     let mail = req.query.valid
//     console.log(mail);
//     bcrypt.hash(req.body.password, 10, (err, hash)=>{
//         if(err){
//             res.status(500).json({
//                 error: err
//             })
//         } else {
//             User.update({email: mail, password: hash})
//             user.save()
//             .then(result => {
//                 console.log(result);
//                 res.status(201).json({
//                     message: "Password changed"
//                 })
//             })
//             .catch(err=>(
//                 res.status(500).json({
//                     error: err
//                 })
//             ))
//         }
//     })

// })

router.delete('/:userID', (req, res, next)=> {
    User.remove({_id: req.params.userID}).exec()
    .then(result => {
        res.status(201).json({
            message: 'deleted successfully'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})



module.exports = router;