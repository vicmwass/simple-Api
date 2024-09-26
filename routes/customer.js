import { Router } from "express"
import {readAllCustomer,createCustomer,readCustomer,updateCustomer,deleteUser} from "../database.js"
import bodyParser from "body-parser"
const router=Router()

// create application/json parser
var jsonParser = bodyParser.json()

router.get('/',(req,res)=>{
    readAllCustomer((err, rows) => {
        if (!err) {
         
        } else {
            console.error(err.message);
        }
        res.status(200).json(rows)    
    })
})




router.route("/:id").get((req,res)=>{
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
  
}).post(jsonParser,(req,res)=>{
    let {firstname,lastname,username,email,account_balance}=req.body
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
                if(account_balance==undefined){
                    account_balance=data.account_balance
                }
                updateCustomer(req.params.id,username,firstname,lastname,email,account_balance,(err)=>{
                    if(err){
                        console.error(err.message)
                        res.status(500).json({
                            message:"failed to update customer"
                        })
                    }else{
                        data={
                            firstname,
                            lastname,
                            username,
                            email,
                            account_balance
                        }
                        res.json({
                            message:"updated successfully",
                            customer:data
                        })
                    }
                })
    }
    })
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



export default router