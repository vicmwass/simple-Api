import { Router } from "express"
import {readAllCustomer,createCustomer,readCustomer,updateCustomer,deleteUser} from "../database.js"
import bodyParser from "body-parser"
import { fail } from "assert"
const router=Router()
var jsonParser = bodyParser.json()

router.get('/',(req,res)=>{
    readAllCustomer((err, rows) => {
        if (!err) {
            // res.status(200).json(rows)
            // console.log(rows)
        } else {
            console.error(err.message);
        }
        // data = rows;
        res.status(200).json(rows)    
        // res.render("index",{testimonials:data})
    })
})


// router.get('/new',(req,res)=>{
//     res.render("users/form",{firstName:"Test"})
// })

router.route("/:id").get((req,res)=>{
    // if(req.isValid){
    console.log(req.params.id)
    readCustomer(req.params.id,(err, rows) => {
        let data=rows[0]        
        if (err||data==undefined) {
            console.log("fail to get customer");
            res.status(500).json({
                message:"failed to get customer"
            })
        }else{
            res.status(200).json(rows[0])    
        }
        
    })
    // }else{
    //     res.send("user does not exist")
    // }
}).post(jsonParser,(req,res)=>{
    // users[req.params.id].name=req.body.firstName   
    let {firstname,lastname,username,email}=req.body
    console.log(req.params.id)  
    readCustomer(req.params.id,(err, rows) => {
        let data=rows[0]
        if (err||data==undefined) {
            console.log("fail to get customer");
            res.status(500).json({
                message:"failed to get customer"
            })
        }else{
                if(firstname==undefined){
                    firstname=data.firstname
                }
                if(lastname==undefined){
                    lastname=data.lastname
                }
                if(username==undefined){
                    username=data.username
                }
                if(email==undefined){
                    email=data.email
                }
                updateCustomer(req.params.id,username,firstname,lastname,email,(err)=>{
                    if(err){
                        console.error(err.message)
                    }else{
                        data={
                            firstname,
                            lastname,
                            username,
                            email
                        }
                        res.json({
                            message:"updated successfully",
                            customer:data
                        })
                    }
                })
    }
    })
    // res.render("users/form",{userName:users[req.params.id].name,firstName:users[req.params.id].name,userId:req.params.id})
}).delete((req,res)=>{
    deleteUser(req.params.id,(err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({
                message:"error while deleting"
            }) 
        }else{
        res.status(200).json({
            message:"deleted successfully"
        })   
     }
    })
})

router.post("/",jsonParser,(req,res)=>{
    const isValid=true
    if(isValid){
        const {firstname,lastname,username,password,email}=req.body
            createCustomer(firstname,lastname,username,password,email,(err)=>{
                if(err){
                    console.error(err.message)
                }else{
                    let data={
                        firstname,
                        lastname,
                        username,
                        email
                    }
                    res.json({
                        message:"added successfully",
                        customer:data
                    })
                }
            })
    
    }else{
        console.log("Error")
        res.status(400).json({
            message:"failed to add customer",
        })
    }

})

// router.param("id",(req,res,next,id)=>{
//     req.User=-1
//     req.isValid=false
//     // if(id<=(users.length-1)){
//     //     req.isValid=true        
//     //     req.User=users[id]
//     //     console.log(req.method)
//     //     // if(req.method=='POST'){
//     //     //     req.method='PUT'
//     //     //     console.log("change to put")
//     //     // }

//     // }    
//     next() 
// })


export default router