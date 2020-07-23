const express = require("express")
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://Adarsh:'+process.env.MONGO_ATLAS_PW+'@cluster0.obrzl.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use('/uploads',express.static('uploads'))

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

app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app
