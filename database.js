import sqlite3 from 'sqlite3';
import {defLogger as logger} from './logger.js' 

const db = new sqlite3.Database('mydatabase.db');

const dbName='mydatabase.db'
export default new sqlite3.Database(dbName,(err)=>{
    if(err){
        logger.error(err.message)
    }else{
        logger.info("connected to database")
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='CUSTOMER';",(res)=>{            
            db.run('CREATE TABLE CUSTOMER (id INTEGER PRIMARY KEY AUTOINCREMENT,firstname TEXT,lastname TEXT,username TEXT,password TEXT, email TEXT,account_balance INTEGER DEFAULT 0 );',(err)=>{
                if(err){
                    logger.info(err.message)
                }else{
                    logger.info("table created or existed")
                }
            })
        })
    }})
        


export const readAllCustomer=(callback)=>{
    const sql='SELECT firstname,lastname,username,email FROM CUSTOMER'
    db.all(sql,[],callback)
}

export const readCustomer=(id,callback)=>{
    const sql='SELECT firstname,lastname,username FROM CUSTOMER WHERE  id= ?'
    db.all(sql,[id],callback)
}

export const createCustomer=(firstname,lastname,username,password,email,callback)=>{
    const sql="INSERT INTO CUSTOMER (firstname,lastname,username,password,email) VALUES (?,?,?,?,?)"
    db.run(sql,[firstname,lastname,username,password,email],callback)
}

export const updateCustomer=(id,username,firstname,lastname,email,account_balance,callback)=>{
    const sql="UPDATE CUSTOMER SET firstname=?,lastname=?,username=?,email=?,account_balance=? WHERE id= ?"
    db.run(sql,[firstname,lastname,username,email,account_balance,id],callback)
}

export const deleteUser=(id,callback)=>{    
    const sql="DELETE FROM CUSTOMER WHERE id= ?"
    db.run(sql,[id],callback)
}