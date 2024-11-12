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
        console.log(message)
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
            callback(null,{})
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
const app=require('../app')
const db =require('../database')
const jestConfig = require('../jest.config')
const request= require('supertest')  

describe('access to customer endpoint', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
  
    it('get customers', async() => {
        const response = await request(app).get("/customers")
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(sampleUsers)
    })
    it('get customer', async() => {
        const index=0
        const response = await request(app).get(`/customers/${index}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(sampleUsers[0])
    })

    it('create customer', async() => {
        let created={
            firstname:"vic5",
            password:"kami",
            email:"vic1mwas2018@gmail.com",
            username:"vicmwass5",
            lastname:"mwass",
            }
        const response = await request(app).post("/customers").send(created)
        expect(response.statusCode).toBe(201)
        delete created.password
        expect(response.body.customer).toEqual(created)
    })

    it('update customer', async() => {
        const index =0
        let updated={
            firstname:"vic5",
            email:"vic1mwas2018@gmail.com",
            username:"vicmwass5",
            lastname:"mwass",
            account_balance:50
            }
        const response = await request(app).put(`/customers/${index}`).send(updated)
        expect(response.statusCode).toBe(200)
        // delete created.password
        expect(response.body.customer).toEqual(updated)
    })

    it('delete customer', async() => {
        const index =0
        const originalLength=sampleUsers.length
        const response = await request(app).delete(`/customers/${index}`)
        console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(originalLength-1).toEqual(sampleUsers.length)
    })
})
