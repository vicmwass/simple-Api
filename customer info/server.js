const app = require('./app.js')
const {defLogger } =require('./logger.js')
const amqp=require('amqplib')
const logger=defLogger



async function startUp(){
  const PORT = process.env.PORT || 3000
try{
  // console.log("Trying to connect ....");
  // connection = await amqp.connect("amqp://user:password@localhost:5672");
  // channel = await connection.createChannel();  
  // await channel.assertQueue('message-customer', {durable: true});
  // console.log("Connected to RabbitMQ.");
  app.listen(PORT,() => {
      logger.info('Server started listening at port '+PORT)
    })
  } catch (error) {
		console.warn(error);
		console.log(error.message);
		// if (error.message.includes("connect ECONNREFUSED")) {
		// 	setTimeout(() => startUp(), 10000);
		// } else if (error.message.includes("Channel is not established.")) {
		// 	setTimeout(() => startUp(), 10000);
		// }
	}
}

startUp()
