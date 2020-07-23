const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

router.get('/', (req, res, next)=> {
    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(201).json({
            count: docs.length,
            orders: docs.map(doc=> {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/orders/' + doc._id
                    }
                }
            }),
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})
router.post('/', (req, res, next)=> {
    Product.findById(req.body.productID)
    .then(product => {

        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productID
        })
        return order
        .save()
        .then(result => {
            res.status(201).json(result)
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            message: 'product not found'
        })
    })
    
})

router.get('/:orderID', (req,res,next)=>{
    Order.findById(req.params.orderID).exec()
    .then(order => {
        res.status(200).json({
             order: order,
             request : {
                 type: 'GET',
                 url: 'http://localhost:5000/orders'
             }
        })


    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })

})

router.delete('/:orderID', (req, res, next)=> {
    Order.remove(req.params.OrderID).exec()
    .then(order => {

        if(!order){
            return res.status(404).json({
                message: 'order not found'
            })
        }
        res.status(200).json({
            message: 'order deleted successfully',
            request : {
                type: "GET",
                name: 'Your Orders',
                url: 'http://localhost:5000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.port

module.exports = router