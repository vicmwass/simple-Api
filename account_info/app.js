const express=require("express")
const morganMiddleware =require('./morganMiddleware.js')
const urlencoded=express.urlencoded

const app = express();

app.use(morganMiddleware)
app.use(urlencoded({extended:true}))

const accountRoutes =require("./routes/accounts.js")

app.use("/accounts",accountRoutes)


// function logger(req,res,next){
//     console.log(req.originalUrl)
//     next()
// }

module.exports= app
