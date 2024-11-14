const  { Router } =require("express")
const {defLogger } =require('../logger.js' )
const {getAllAccounts,getAccountByAccountNumber,getAccountByHolderId,updateAccountBalance,createAccount,deleteAccount} =require("../database.js")
const bodyParser= require("body-parser")
const { data } = require("browserslist")
const router=Router()

const logger=defLogger
// create application/json parser
var jsonParser = bodyParser.json()


router.route("/").get((req,res)=>{
    if(req.query.account_number!=undefined){
    getAccountByAccountNumber(req.query.account_number).then((result)=>{
        if (result==undefined) {
            logger.error("account does not exist");
            res.status(400).json({
                message:"account does not exist"
            })
        }else{
            res.status(200).json(result) 
        }        
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"server error"
            })
    })  
} else if(req.query.account_holder_id!=undefined){
    getAccountByHolderId(req.query.account_holder_id).then((result)=>{
        if (result==undefined) {
            logger.error("account does not exist");
            res.status(400).json({
                message:"account does not exist"
            })
        }else{
            res.status(200).json(result) 
        }        
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"server error"
            })
    })  
} else{
    getAllAccounts().then((result)=>{
        res.status(200).json(result) 
    }).catch((err)=>{
        logger.error(err.message);
        res.status(400).send('fail to get accounts') 
    })
}  
})
router.route("/withdraw_amount").post(jsonParser,(req,res)=>{
    let {amount,account_number}=req.body
    getAccountByAccountNumber(account_number).then((result)=>{
        if (result==undefined) {
            logger.error("account does not exist");
            res.status(400).json({
                message:"account does not exist"
            })
        }else if (amount >= result.account_balance) {
            logger.error(`Account with account number ${credit_account_number} has insufficient amount to perform withdrawal`);
            res.status(400).json({
                message: `Account with account number ${credit_account_number} has insufficient amount to perform withdrawal`
            })
        }else{            
            const new_balance=result.account_balance-amount
            updateAccountBalance(new_balance,account_number).then(()=>{
                let data={
                    account_number,previous_balance:result.account_balance,current_balance:new_balance
                }
                res.status(201).json({
                    message:"added amount successfully",
                    account_details:data
                })
            }).catch((err)=>{
                logger.error(err.message);
                res.status(500).json({
                    message:"server error"
                })
            })
        }        
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"server error"
            })
    }) 

})


router.route("/add_amount").post(jsonParser,(req,res)=>{
    let {amount,account_number}=req.body
    getAccountByAccountNumber(account_number).then((result)=>{
        if (result==undefined) {
            logger.error("account does not exist");
            res.status(400).json({
                message:"account does not exist"
            })
        }else{
            const new_balance=result.account_balance+amount
            updateAccountBalance(new_balance,account_number).then(()=>{
                let data={
                    account_number,previous_balance:result.account_balance,current_balance:new_balance
                }
                res.status(201).json({
                    message:"added amount successfully",
                    account_details:data
                })
            }).catch((err)=>{
                logger.error(err.message);
                res.status(500).json({
                    message:"server error"
                })
            })
        }        
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"server error"
            })
    }) 

})


router.route("/").get((req,res)=>{
    getAccountByAccountNumber(req.query.account_number).then((result)=>{
        if (result==undefined) {
            logger.error("account does not exist");
            res.status(400).json({
                message:"account does not exist"
            })
        }else{
            res.status(200).json(result) 
        }        
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"server error"
            })
    })       
  
})
router.route("/").delete((req,res)=>{
    getAccountByAccountNumber(req.params.account_number).then((result)=>{
        if (result==undefined) {
            logger.error("account does not exist");
            res.status(400).json({
                message:"account does not exist"
            })
        }else{
            deleteAccount(req.params.account_number).then(()=>{
                res.status(200).json({
                    message:"account deleted successfully"
                })   
            }).catch((err)=>{
                logger.error(err.message);
                    res.status(500).json({
                        message:"server error"
                    }) 
            })
        }
    }).catch((err)=>{
        logger.error(err.message);
            res.status(500).json({
                message:"server error"
            })
    })
})




router.route("/money_transfer").post(jsonParser,async(req,res)=>{
    let {credit_account_number,debit_account_number,amount}=req.body
    let credit_account_amount
    let debit_account_amount
    try{
        //get credit account details
        let result = await getAccountByAccountNumber(credit_account_number)
        if (result == undefined) {
            logger.error(`Account with account number ${credit_account_number} does not exist`);
            res.status(400).json({
                message: `Account with account number ${credit_account_number} does not exist`
            })
            return
        }
        if (amount >= result.account_balance) {
            logger.error(`Credit account with account number ${credit_account_number} has insufficient amount to perform transfer`);
            res.status(400).json({
                message: `Credit account with account number ${credit_account_number} has insufficient amount to perform transfer`
            })
            return
        }
        credit_account_amount=result.account_balance        

        //get debit account details
        result = await getAccountByAccountNumber(debit_account_number)
        if (result == undefined) {
            logger.error(`Account with account number ${debit_account_number} does not exist`);
            res.status(400).json({
                message: `Account with account number ${debit_account_number} does not exist`
            })
            return
        }
        debit_account_amount=result.account_balance
    }catch(err){
        logger.error("Failed transfer accounts check due to database issue");
        res.status(500).json({
            message:"server error"
        })
        return
    }
    //try to update credit account amount
    try{
        await updateAccountBalance(credit_account_amount-amount,credit_account_number)
    }catch(err){
        logger.error("Faied transfer amount from credit account due to database issue");
        res.status(500).json({
            message:"server error"
        })
        return
    }
    //try to update debit account amount
    try{
        await updateAccountBalance(debit_account_amount+amount,debit_account_number)
    }catch(err){
        logger.error("Faied transfer amount to debit account due to database issue");
        try{
            await updateAccountBalance(credit_account_amount+amount,credit_account_number)
        }catch(err){
            logger.error("Faied transfer revert amount to credit account due to database issue");
        }
        res.status(500).json({
            message:"server error"
        })
        return
    }

    res.status(200).json({
        message:"transfer successfully",
    })

})



router.post("/create_account",jsonParser,(req,res)=>{
    // account_holder_id,account_holder_name,account_number
    const {account_holder_id,account_holder_name,account_number}=req.body
    createAccount(account_holder_id,account_holder_name,account_number).then(()=>{
            let data={
                account_holder_id,account_holder_name,account_number,account_balance:0
            }
            res.status(201).json({
                message:"added successfully",
                customer:data
            })
        }).catch((err)=>{
            logger.error(err.message)
            res.status(500).json({
                message:"server error"
            })
        })                

})



module.exports=router