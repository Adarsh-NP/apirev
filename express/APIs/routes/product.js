const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/checkauth')


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
    cb(null, true)
    else
    cb(new Error('file format should be either jpeg or png'), false) //false is because if there's some error then we don't want to save the file
}

const upload = multer({
    storage: storage, 
    limits:{
    fileSize: 1024*1024*50,
    },
    fileFilter : fileFilter
})


const Product = require('../models/product')

router.get('/', (req, res, next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs=> {
        const response = {
            count: docs.length,
            products: docs.map (doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request : {
                        type: 'GET',
                        url: 'http://localhost:5000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post("/", checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path 
    });
    product
      .save()  //method of mongoose
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created product successfully",
          createdProduct: {
              name: result.name,
              price: result.price,
              _id: result._id,
              request: {
                  type: 'GET',
                  url: "http://localhost:3000/products/" + result._id
              }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.get('/:productID', (req, res, next)=> {
    const id = req.params.productID
    Product.findById(id)
    .select('name pride_id productImage').exec()
    .then(
        doc => {
        if(doc){
            res.status(200).json(doc)
        }else{
            res.status(404).json({
                message: "Not Found"
            })
        }
        }
    ).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})
// router.patch('/:productID', (req, res, next)=> {
//     const id = req.params.productID
//     const updateOps = {};
//     for (const ops of req.body){
//         updateOps[ops.propName] = ops.value;
//     }
//     Product.update({ _id: id }, {$set: updateOperations})
//     .exec()
//     .then(result => {
//         console.log(result);
//         res.status(200).json(result)
//     })
//     .catch(err=>{
//         console.log(error);
//         res.status(500).json({error: err})
//     })
// })

router.patch("/:productId", checkAuth, (req, res, next) => {
    const id = req.params.productId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //   updateOps[ops.propName] = ops.value;
    // }
    Product.update({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.delete('/:productID', checkAuth, (req, res, next)=> {
    const id = req.params.productID //same as the route name   
    Product.remove({ _id : id })
    .exec()
    .then(result => {
        res.status(200).json(result)

    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router