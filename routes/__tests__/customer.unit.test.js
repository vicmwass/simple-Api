// import {jest } from '@jest/globals'
// import request from 'supertest'
// import app from '../../app'
const db =require("../../database.js")

const testFunctionMock = jest.spyOn(db, 'testFunction')
  
// jest.mock('../../database.js',()=>{
//     return{
//         testFunction:jest.fn()
//     }
// })
const sampleCustomer={
    firstname:"vic1",
    password:"kami",
    email:"vic1mwas2017@gmail.com",
    username:"vicmwass1",
    lastname:"mwass",
    account_balance:50
}

describe('access to customer endpoint', () => {
    const testFunctionMock = jest.spyOn(db, 'testFunction')
    it('can a customer be added', async() => {
        expect(db.testFunction()).toBe('hello')
        expect(testFunctionMock).toHaveBeenCalled()
        // const response = await request(app).post("customer/").send(sampleCustomer)
        // expect(response.statusCode).toBe(400)
    })
})
