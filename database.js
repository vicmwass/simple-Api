import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('mydatabase.db');

const dbName='mydatabase.db'
export default new sqlite3.Database(dbName,(err)=>{
    if(err){
        console.error(err.message)
    }else{
        console.log("connected to database")
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='CUSTOMER';",(res)=>{
            console.log(res,'ll')
            db.run('CREATE TABLE CUSTOMER (id INTEGER PRIMARY KEY AUTOINCREMENT,firstname TEXT,lastname TEXT,username TEXT,password TEXT, email TEXT);',(err)=>{
                if(err){
                    console.error(err.message)
                }else{
                    console.log("table created or existed")
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

export const updateCustomer=(id,username,firstname,lastname,email,callback)=>{
    const sql="UPDATE CUSTOMER SET firstname=?,lastname=?,username=?,email=? WHERE id= ?"
    db.run(sql,[firstname,lastname,username,email,id],callback)
}

export const deleteUser=(id,callback)=>{    
    const sql="DELETE FROM CUSTOMER WHERE id= ?"
    db.run(sql,[id],callback)
}