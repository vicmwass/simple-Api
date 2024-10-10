// import sqlite3 from'sqlite3'
// import { jest } from '@jest/globals'
const sampleUser={
    firstname:"vic1",
    password:"kami",
    email:"vic1mwas2017@gmail.com",
    username:"vicmwass1",
    lastname:"mwass",
    account_balance:50
}
const logger= {
    error:jest.fn().mockImplementation((message)=>{}),
    info:jest.fn().mockImplementation((message)=>{})
}
jest.mock('../logger',()=>{    
    return{
        defLogger:logger,
        infoLogger:logger
    }
})

const jestConfig = require('../jest.config')
const lg=require('../logger')
// const loggerMock = jest.spyOn(db.infoLogger, 'info')

const sqlite3 =require('sqlite3')

describe('Database credibility', () => {
    it('is ok if the database is ok and can be connected',() => {
        new Promise((resolve,reject)=>{
            setTimeout(()=>{
                require('../database')
                resolve()
            },1000)}).then(()=>{
                expect(lg.defLogger.info).toHaveBeenCalledWith("database Ok") 
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
    })
})

describe('customer database crud operations', () => {
        const db =require('../database')
        jest.mock('sqlite3', () => {
        const mockDatabase = {
            all: jest.fn(),
            get: jest.fn(),
            run: jest.fn(),
        };
        return {
            Database: mockDatabase,
            
            verbose: jest.fn(() => {
                return { Database: mockDatabase };
            }),
        }
    })
    it('read all customers',() => {
        db.readAllCustomer().then(()=>{
            expect(sqlite3.Database.all).toHaveBeenCalled()
        })
    })
    it('read single customer',() => {
        db.readCustomer().then(()=>{
            expect(sqlite3.Database.all).toHaveBeenCalled()
        })
    })

})




