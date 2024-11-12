const sampleUsers=[{
    firstname:"vic1",
    password:"kami",
    email:"vic1mwas2017@gmail.com",
    username:"vicmwass1",
    lastname:"mwass",
    account_balance:50
},{
    firstname:"vic2",
    password:"kami",
    email:"vic1mwas2018@gmail.com",
    username:"vicmwass2",
    lastname:"mwass",
    account_balance:50}
]


jest.mock('../logger',()=>{    
    const log=jest.fn().mockImplementation((message)=>{
        console.log("log message ",message)
    })
    const logger= {
        error:log,
        info:log
    }
    return{
        defLogger:logger,
        infoLogger:logger
    }
})
const {defLogger}=require('../logger')
const sqlite3 =require('sqlite3')
jest.mock('sqlite3', () => {
    const mockRun = jest.fn().mockImplementation((sql, params, callback) => { 
        //order of update params is firstname,lastname,username,email,account_balance,index
        //order of create params firstname,lastname,username,password,email
        if (sql.includes('UPDATE CUSTOMER')) {
            sampleUsers[params[5]]={...sampleUsers[params[5]],
                firstname:params[0],
                email:params[3],
                username:params[2],
                lastname:params[1],
                account_balance:params[4]}
            callback(null,sampleUsers[params[5]])
        } else if (sql.includes('DELETE FROM CUSTOMER')) {
            sampleUsers.splice(params[0],1)
        }  else if (sql.includes('INSERT INTO CUSTOMER')) {
            const data ={
                firstname:params[0],
                email:params[4],
                password:params[3],
                username:params[2],
                lastname:params[1],
                account_balance:0
            }
            sampleUsers.push(data)
            callback(null,data)

        } else   callback(null,{})
        console.log("running mock",sql)
    })   
    const mockAll = jest.fn().mockImplementation((sql, params, callback) => {        
        callback(null,sampleUsers)
        console.log("running mock",sql)
    }) 
    const mockGet = jest.fn().mockImplementation((sql, params, callback) => {        
        callback(null,sampleUsers[params[0]])
        console.log("running mock",sql)
    }) 
    const mockDatabase = {
        all: mockAll,
        get: mockGet,
        run: mockRun,
    };
    const Database = jest.fn().mockImplementation((databasename,callback) => {
        callback(null)
        return mockDatabase;
      });        
    return {
        Database:Database,
        verbose:jest.fn().mockImplementation(()=>{
            return {Database:Database}
        })
    }
})

const db =require('../database')
const jestConfig = require('../jest.config')





describe('Database credibility', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });  
    // const spy = jest.spyOn(defLogger, 'info');
    it('is ok if the database is ok and can be connected',async () => {
        await new Promise((resolve,reject)=>{
            setTimeout(()=>{
                require('../database')
                resolve()
            },1000)})
            
    })
})


describe('customer database crud operations', () => {    
    // const spy = jest.spyOn(sqlite3, 'Database.all');
    it('read single customer',async() => {
        const index=0
        db.readCustomer(index).then((row)=>{
            expect(row).toEqual(sampleUsers[index])
        })
    })  

    it('read multiple customer',async() => {
        db.readAllCustomer().then((row)=>{
            expect(row).toEqual(sampleUsers)
        })
    })  

    it('update customer',async() => {
        const index=0
        const original=sampleUsers[index]
        const updated={
            firstname:"vic3",
            email:"vic1mwas2018@gmail.com",
            username:"vicmwass3",
            lastname:"mwass",
            account_balance:50}
        const {username,firstname,lastname,email,account_balance}=updated
        // console.log(username,firstname,lastname,email,account_balance)
        db.updateCustomer(index,username,firstname,lastname,email,account_balance).then((row)=>{
            expect(row).toEqual(sampleUsers[index])
            expect(row).not.toEqual(original)
        })
    })
    
    it('add customer',async() => {
        const originalLength=sampleUsers.length
        const created={
            firstname:"vic5",
            password:"kami",
            email:"vic1mwas2018@gmail.com",
            username:"vicmwass5",
            lastname:"mwass",
            }
        const {username,firstname,lastname,email,password}=created
        db.createCustomer(firstname,lastname,username,password,email).then((row)=>{
            expect(row).toEqual(undefined)
            expect(originalLength+1).toEqual(sampleUsers.length)
        })
    })

    it('delete customer',async() => {
        const originalLength=sampleUsers.length
        const index =sampleUsers.length/2
        console.log(sampleUsers)
        db.deleteCustomer(index).then((row)=>{
            expect(row).toEqual(undefined)
            expect(originalLength-1).toEqual(sampleUsers.length)
        })
    })
})




        
        // db.readAllCustomer().then(()=>{
        //     lg.defLogger.info("hello")
        // }).then(()=>{
        //     expect(lg.defLogger.info).toHaveBeenCalled()    
        // })
        // expect(jest.isMockFunction(sqlite3.Database.run)).toBe(true)
        // expect(jest.isMockFunction(loggerMock)).toBe(true)
              
        // expect(sqlite3.Database.get).toHaveBeenCalled()
        // expect(sqlite3.Database.run).toHaveBeenCalled()
        // expect(loggerMock).toHaveBeenCalled()
        // const dbName='mydatabase.db'
        // new sqlite3.Database(dbName,(err)=>{
        //     expect(err).toBe(null);        
        // })
