
const express=require("express")
const morganMiddleware =require('./morganMiddleware.js')
const urlencoded=express.urlencoded
const {readToken,updateToken,deleteToken,readCustomerByUsername}=require("./database.js")
const {defLogger } =require('./logger.js' )
const logger=defLogger
require('dotenv').config()
const bodyParser= require("body-parser")
var jsonParser = bodyParser.json()
const jwt = require('jsonwebtoken')


const app = express();
app.use(express.json())
app.use(morganMiddleware)
app.use(urlencoded({extended:true}))

const customerRoutes =require("./routes/customer.js")
const {authRoutes}=require("./routes/auth.js")


app.use("/customers",customerRoutes)
app.use("/auth",authRoutes)

module.exports= app
