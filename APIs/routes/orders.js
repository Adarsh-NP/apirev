const express = require('express')
const router = express.Router()

router.get('/:orderID', (req, res, next)=> {
    res.status(200).json({
        message: 'Orders fetched',
        id: req.params.orderID
    })
})
router.delete('/:orderID', (req, res, next)=> {
    res.status(200).json({
        message: 'Orders deleted',
        id: req.params.orderID
    })
})
router.post('/', (req, res, next)=> {

    const order = {
        productID: req.body.productID,
        quantity: req.body.quantity
    }

    res.status(200).json({
        message: 'Orders posted',
        order: order

    })
})

router.port

module.exports = router