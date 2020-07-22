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
    res.status(200).json({
        message: 'Orders posted'
    })
})

router.port

module.exports = router