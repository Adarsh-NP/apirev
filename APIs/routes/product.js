const express = require('express')
const { Router } = require('express')

const router = express.Router()

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'handling get requests to /products'
    })
})

router.post('/', (req, res, next)=> {
    res.status(200).json({
        message: 'handling post requests to /products'
    })
})

router.get('/:productID', (req, res, next)=> {
    const id = req.params.productID
    if(id === '12'){
        res.status(200).json({
            message: 'welcome to the productID',
            id: id
        })
    }else {
        res.status(200).json({
            message: 'you passed an ID'
        })
    }
})
router.patch('/:productID', (req, res, next)=> {
    res.status(200).json({
        message: 'product updated'
    })
})
router.delete('/:productID', (req, res, next)=> {
    res.status(200).json({
        message: 'product deleted'
    })
})


module.exports = router