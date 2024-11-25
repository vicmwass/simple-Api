const sqlite3 =require('sqlite3')
const {defLogger} =require('./logger.js')

// const logger=defLogger

const db = new sqlite3.Database('mydatabase.db',()=>{});

const dbName='mydatabase.db'

new sqlite3.Database(dbName,(err)=>{
    if(err){
        defLogger.error(err.message)
    }else{
        defLogger.info("database Ok")
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='CUSTOMER';",[],(err,row)=>{            
            if(row==undefined){
                db.run("CREATE TABLE CUSTOMER (id INTEGER PRIMARY KEY AUTOINCREMENT,firstname TEXT,lastname TEXT,username TEXT UNIQUE,password TEXT, email TEXT,account_balance NUMERIC DEFAULT 0,account_number TEXT DEFAULT '');",[],(err)=>{
                if(err){
                    defLogger.info(err.message)
                }else{
                    defLogger.info("CUSTOMER table created")
                }
            })}
        })
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='AUTHTOKENS';",[],(err,row)=>{            
            if(row==undefined){
                db.run("CREATE TABLE AUTHTOKENS (username TEXT UNIQUE PRIMARY KEY NOT NULL,refresh_token TEXT DEFAULT '');",[],(err)=>{
                if(err){
                    defLogger.info(err.message)
                }else{
                    defLogger.info("AUTHTOKENS table created")
                }
            })}
        })
    }})


const readAllCustomer=()=>{
    const sql='SELECT * FROM CUSTOMER'
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
    const sql='SELECT firstname,lastname,username,account_balance,account_number FROM CUSTOMER WHERE  id= ?'
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

const readCustomerByUsername=(username)=>{
    const sql='SELECT password,id FROM CUSTOMER WHERE  username= ?'
    return new Promise((resolve, reject) => {
        db.get(sql,[username],(err,row)=>{
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
                db.all(`SELECT id,username FROM CUSTOMER ORDER BY id DESC LIMIT 1`, [], (err, rows) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(rows[0])
                    }
                })
                
            }
        })
    })
    
}

const updateCustomer=(id,username,firstname,lastname,email,account_balance,account_number)=>{
    const sql="UPDATE CUSTOMER SET firstname=?,lastname=?,username=?,email=?,account_balance=?,account_number=? WHERE id= ?"
    return new Promise((resolve, reject) => {
        db.run(sql,[firstname,lastname,username,email,account_balance,account_number,id],(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })    
}

const deleteCustomer=(id)=>{    
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

// const readAllToken=()=>{
//     const sql='SELECT * FROM AUTHTOKENS'
//     return new Promise((resolve, reject) => {
//         db.all(sql,[],(err,rows)=>{
//             if(err){
//                 reject(err)
//             }else{
//                 resolve(rows)
//             }
//         })
//     })
    
// }

const readToken=(username)=>{
    const sql='SELECT username,refresh_token FROM AUTHTOKENS WHERE  username= ?'
    return new Promise((resolve, reject) => {
        db.get(sql,[username],(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })    
}
const createUserTokenEntry=(username)=>{
    const sql="INSERT INTO AUTHTOKENS (username) VALUES (?)"
    return new Promise((resolve, reject) => {
        db.run(sql,[username],(err)=>{
            if(err){
                reject(err)
            }else{
                resolve()
                
            }
        })
    })    
}

const updateToken=(username,refresh_token)=>{
    const sql="UPDATE AUTHTOKENS SET refresh_token=? WHERE username= ?"
    return new Promise((resolve, reject) => {
        db.run(sql,[refresh_token,username],(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })    
}

const deleteToken=(username)=>{    
    const sql="UPDATE AUTHTOKENS SET refresh_token=? WHERE username= ?"
    return new Promise((resolve, reject) => {
        db.run(sql,["",username],(err)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
    
}

module.exports={
    deleteCustomer,
    updateCustomer,
    createCustomer,
    readAllCustomer,
    readCustomer,
    readCustomerByUsername,
    readToken,
    createUserTokenEntry,
    updateToken,
    deleteToken,
    testFunction
}