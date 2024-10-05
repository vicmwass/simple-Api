import { Router } from "express"
import {defLogger as logger} from '../logger.js' 
import {readAllCustomer,createCustomer,readCustomer,updateCustomer,deleteUser} from "../database.js"
import bodyParser from "body-parser"
const router=Router()
// create application/json parser
var jsonParser = bodyParser.json()

router.get('/',(req,res)=>{
    readAllCustomer((err, rows) => {
        if (!err) {         
        } else {
            logger.error(err.message);
        }
        res.status(200).json(rows)    
    })
})




router.route("/:id").get((req,res)=>{
    readCustomer(req.params.id,(err, rows) => {
        let data=rows[0]        
        if (data==undefined) {
            logger.error("customer does not exist");
            res.status(400).json({
                message:"customer does not exist"
            })
        }else if(err){
            logger.error("database failure");
            res.status(500).json({
                message:"database failure"
            })
        }else{
            res.status(200).json(rows[0])    
        }
        
    })
  
}).post(jsonParser,(req,res)=>{
    let {firstname,lastname,username,email,account_balance}=req.body
    readCustomer(req.params.id,(err, rows) => {
        let data=rows[0]
        if (data==undefined) {
            logger.error("customer does not exist");
            res.status(400).json({
                message:"customer does not exist"
            })
        }else if(err){
            logger.error("database failure");
            res.status(500).json({
                message:"database failure"
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
                        logger.error(err.message)
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
    readCustomer(req.params.id,(err, rows) => {
        let data=rows[0]
        if (data==undefined) {
            logger.error("customer does not exist");
            res.status(400).json({
                message:"customer does not exist"
            })
        }else if(err){
            logger.error("database failure");
            res.status(500).json({
                message:"database failure"
            })
        }else{
            deleteUser(req.params.id,(err) => {
                if (err) {
                    logger.error(err.message);
                    res.status(500).json({
                        message:"error while deleting"
                    }) 
                }else{
                res.status(200).json({
                    message:"deleted successfully"
                })   
             }
            })
        }
    })
    
})

router.post("/",jsonParser,(req,res)=>{
        const {firstname,lastname,username,password,email}=req.body
            createCustomer(firstname,lastname,username,password,email,(err)=>{
                if(err){
                    logger.error(err.message)
                }else{
                    let data={
                        firstname,
                        lastname,
                        username,
                        email
                    }
                    res.status(201).json({
                        message:"added successfully",
                        customer:data
                    })
                }
            })

})



export default router