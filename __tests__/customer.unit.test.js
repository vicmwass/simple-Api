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
        callback(null,{})
        console.log("running mock",sql)
    })   
    const mockDatabase = {
        all: mockRun,
        get: mockRun,
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
        expect(response.body).toEqual({})
    })
})
