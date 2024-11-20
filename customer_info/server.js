const app = require('./app.js')
const {defLogger } =require('./logger.js')
const logger=defLogger
const {startMQConnection,rabbitmqListen}=require('./rabbitmqConn.js')




async function startUp(){
  const PORT = process.env.PORT || 3002
  app.listen(PORT,() => {
    logger.info('Server started listening at port '+PORT)
  })
  await startMQConnection()
  rabbitmqListen('message-customer')
}

startUp()

