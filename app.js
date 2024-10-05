import express, { urlencoded} from "express"
import morganMiddleware from './morganMiddleware.js'
import {defLogger as logger} from './logger.js' 
const app = express();

app.use(morganMiddleware)
app.use(urlencoded({extended:true}))

import customerRoutes from "./routes/customer.js"

app.use("/customers",customerRoutes)


// function logger(req,res,next){
//     console.log(req.originalUrl)
//     next()
// }
const PORT = process.env.PORT || 3000

app.listen(PORT,() => {
    logger.info('Server started listening at port '+PORT)
  })