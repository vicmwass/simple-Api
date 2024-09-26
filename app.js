import express, { urlencoded} from "express"
import {readAllCustomer,createCustomer} from "./database.js"
const app = express();
 
 
// create application/json parser
 
// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
// // POST /login gets urlencoded bodies
// app.post('/login', urlencodedParser, function (req, res) {
//   res.send('welcome, ' + req.body.username)
// })


app.use(urlencoded({extended:true}))
// app.set("view engine","ejs")
// app.use("/public",express.static('public'));

import customerRoutes from "./routes/customer.js"

app.use("/customers",logger,customerRoutes)

function logger(req,res,next){
    console.log(req.originalUrl)
    next()
}

// app.get("/",async (req,res)=>{
//     console.log("get customers")
//     // res.status(200).json({message:"hello"})
//     readAllCustomer((err, rows) => {
//         if (!err) {
//             // res.status(200).json(rows)
//             // console.log(rows)
//         } else {
//             console.error(err.message);
//         }
//         data = rows;
//         res.json(rows)    
//         // res.render("index",{testimonials:data})
//     })   
// })




// app.post("/",jsonParser,(req,res)=>{
//     const {firstname,lastname,username,password,email}=req.body
//     createCustomer(firstname,lastname,username,password,email,(err)=>{
//         if(err){
//             console.error(err.message)
//         }else{
//             let data={
//                 firstname,
//                 lastname,
//                 username,
//             }
//             res.json({
//                 message:"added successfully",
//                 customer:data
//             })
//         }
//     })
    
    
    // res.send(req.body)
    // res.status(200).json({message:req.body})

// })

// app.route("/:id").post("/:id",jsonParser,(req,res)=>{
//     console.log(req.params.id)
//     // const {firstname,lastname,username,password,email}=req.body
//     // createCustomer(firstname,lastname,username,password,email,(err)=>{
//     //     if(err){
//     //         console.error(err.message)
//     //     }else{
//     //         let data={
//     //             firstname,
//     //             lastname,
//     //             username,
//     //         }
//     //         res.json({
//     //             message:"added successfully",
//     //             customer:data
//     //         })
//     //     }
//     // })
//     res.send(req.body)
// })

app.listen(3000)