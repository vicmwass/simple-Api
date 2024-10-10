const sqlite3 =require('sqlite3')
const {defLogger} =require('./logger.js')

const logger=defLogger

const db = new sqlite3.Database('mydatabase.db');

const dbName='mydatabase.db'

new sqlite3.Database(dbName,(err)=>{
    if(err){
        logger.error(err.message)
    }else{
        logger.info("database Ok")
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='CUSTOMER';",(err,row)=>{            
            if(row==undefined){
                db.run('CREATE TABLE CUSTOMER (id INTEGER PRIMARY KEY AUTOINCREMENT,firstname TEXT,lastname TEXT,username TEXT,password TEXT, email TEXT,account_balance INTEGER DEFAULT 0 );',(err)=>{
                if(err){
                    logger.info(err.message)
                }else{
                    logger.info("CUSTOMER table created")
                }
            })}
        })
    }})


const readAllCustomer=()=>{
    const sql='SELECT id,firstname,lastname,username,email FROM CUSTOMER'
    return new Promise((resolve, reject) => {
        db.all(sql,[],(err,rows)=>{
            if(err){
                reject(err)
            }else{
                resolve(rows)
            }
        })
    })
    
}

// const readAllCustomer=(callback)=>{
//     const sql='SELECT firstname,lastname,username,email FROM CUSTOMER'
//     db.all(sql,[],callback)
// }

const testFunction=()=>{
    return "hello"
}
const readCustomer=(id)=>{
    const sql='SELECT firstname,lastname,username FROM CUSTOMER WHERE  id= ?'
    return new Promise((resolve, reject) => {
        db.get(sql,[id],(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
    
}

const createCustomer=(firstname,lastname,username,password,email)=>{
    const sql="INSERT INTO CUSTOMER (firstname,lastname,username,password,email) VALUES (?,?,?,?,?)"
    return new Promise((resolve, reject) => {
        db.run(sql,[firstname,lastname,username,password,email],(err)=>{
            if(err){
                reject(err)
            }else{
                resolve()
            }
        })
    })
    
}

const updateCustomer=(id,username,firstname,lastname,email,account_balance)=>{
    const sql="UPDATE CUSTOMER SET firstname=?,lastname=?,username=?,email=?,account_balance=? WHERE id= ?"
    return new Promise((resolve, reject) => {
        db.run(sql,[firstname,lastname,username,email,account_balance,id],(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
    
}

const deleteUser=(id)=>{    
    const sql="DELETE FROM CUSTOMER WHERE id= ?"
    return new Promise((resolve, reject) => {
        db.run(sql,[id],(err)=>{
            if(err){
                reject(err)
            }else{
                resolve()
            }
        })
    })
    
}


module.exports={
    deleteUser,
    updateCustomer,
    createCustomer,
    readAllCustomer,
    readCustomer,
    testFunction
}