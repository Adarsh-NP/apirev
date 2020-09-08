const express = require("express")
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


mongoose.connect('{mongoDB connection string}', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use('/uploads',express.static('uploads'))  //this makes the folder uploads publically accessible so when we click on the productImage we can view it in the browser


const productRoutes = require('./APIs/routes/product')
const orderRoutes = require('./APIs/routes/orders')
const UserRoutes = require('./APIs/routes/user')


app.use((req, res, next)=> {
    res.header('Acsess-Control-Allow-Origin', '*'),
    res.header('Access-Control-Allow-Headers', 
    'Origin, x-requested-with, Content-type, Accept, Authorization',
    )
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT', "POST", "PATCH", "DELETE", "GET")
        return res.status(200).json({})
    }
    next()
})



app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', UserRoutes)


//this code block creates an error, basically something that doesn't go to the above routes comes here 
app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
}) 

//this code block gives the error in json, when you catch some error, the status code is either of the previous error or something with the new req which is handled here
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app
