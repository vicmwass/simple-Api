import express, { urlencoded} from "express"
const app = express();
 
 



app.use(urlencoded({extended:true}))

import customerRoutes from "./routes/customer.js"

app.use("/customers",logger,customerRoutes)

function logger(req,res,next){
    console.log(req.originalUrl)
    next()
}

app.listen(3000)