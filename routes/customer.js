const  { Router } =require("express")
const {defLogger } =require('../logger.js' )
const {readAllCustomer,createCustomer,readCustomer,updateCustomer,deleteCustomer} =require("../database.js")
const bodyParser= require("body-parser")
const router=Router()

const logger=defLogger
// create application/json parser
var jsonParser = bodyParser.json()

router.get('/',(req,res)=>{
    readAllCustomer().then((result)=>{
        res.status(200).json(result) 
    }).catch((err)=>{
        logger.error(err.message);
        res.status(400).send('fail to get users') 
    })
})


router.route("/:id").get((req,res)=>{
    readCustomer(req.params.id).then((result)=>{
        if (result==undefined) {
            logger.error("customer does not exist");
            res.status(400).json({
                message:"customer does not exist"
            })
        }else{
            res.status(200).json(result) 
        }        
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"database failure"
            })
    })       
  
}).put(jsonParser,(req,res)=>{
    let {firstname,lastname,username,email,account_balance}=req.body
    readCustomer(req.params.id).then((result)=>{
        if (result==undefined) {
            logger.error("customer does not exist");
            res.status(400).json({
                message:"customer does not exist"
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
            updateCustomer(req.params.id,username,firstname,lastname,email,account_balance).then((row)=>{
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
            }).catch((err)=>{
                logger.error(err.message)
                    res.status(500).json({
                        message:"failed to update customer"
                    })
            })
        }
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"database failure"
            })
    }) 
    
}).delete((req,res)=>{
    readCustomer(req.params.id).then((result)=>{
        if (result==undefined) {
            logger.error("customer does not exist");
            res.status(400).json({
                message:"customer does not exist"
            })
        }else{
            deleteCustomer(req.params.id).then(()=>{
                res.status(200).json({
                    message:"deleted successfully"
                })   
            }).catch((err)=>{
                logger.error(err.message);
                    res.status(500).json({
                        message:"error while deleting"
                    }) 
            })
        }
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"database failure"
            })
    })
})

router.post("/",jsonParser,(req,res)=>{
    const {firstname,lastname,username,password,email}=req.body
        createCustomer(firstname,lastname,username,password,email).then(()=>{
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
        }).catch((err)=>{
            logger.error(err.message)
            res.status(500).json({
                message:"coundn't create customer"
            })
        })                

})



module.exports=router