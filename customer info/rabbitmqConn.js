const amqp = require('amqplib')
const { defLogger } = require('./logger.js')
const logger = defLogger
const exchange = "info_exg";
const {readAllCustomer,createCustomer,readCustomer,updateCustomer,deleteCustomer} =require("./database.js")
let channel;
let connection;


async function rabbitmqListen(queue) {
  try {
    if (!channel) {
      console.warn("Channel is not established")
      throw new Error("Channel is not established")
    }
    channel.prefetch(1)
    await channel.consume(queue, (message) => {
      if (message !== null) {
        const routingKey = message.fields?.routingKey;
        const content = JSON.parse(message.content.toString());
        if (routingKey.startsWith('message-customer.update-accno')) {
          readCustomer(content.account_holder_id).then((result) => {
            if (result == undefined) {
              logger.error("customer does not exist");
              channel.nack(message, false, false);
            } else {
              const firstname = result.firstname
              const lastname = result.lastname
              const username = result.username
              const email = result.email
              const account_balance = result.account_balance
              const account_number = content.account_number
              updateCustomer(content.account_holder_id, username, firstname, lastname, email, account_balance, account_number).then((row) => {
                logger.info(`updated account number for ${content.account_holder_id}`)
                channel.ack(message)
              }).catch((err) => {
                logger.error(err.message)
                channel.nack(message, false, false);
              })
            }
          }).catch((err) => {
            logger.error(err.message);
            channel.nack(message, false, false);
          })
          return
        }
        channel.nack(message, false, false);
        return
      }
      channel.nack(message, false, false);
    }, { noAck: false });
  } catch (err) {
    logger.error(err.message)
  }

}



function sendMessage(message, routingKey) {
  channel.publish(exchange, routingKey, Buffer.from(message), {
    persistent: true,
    // messageId,
    // mandatory: true,
  });
}

async function startMQConnection() {
  try {
    logger.info("Trying to connect to RabbitMQ....");
    connection = await amqp.connect("amqp://user:password@localhost:5672");
    // const connection = await amqp.connect("amqp://user:password@rabbitmq");
    channel = await connection.createChannel();
    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue('message-account', { durable: true });
    await channel.bindQueue('message-account', exchange, 'message-account.#')
    logger.info("Connected to RabbitMQ.");


    process.once('SIGINT', () => {
      connection.close();
    });
  } catch (error) {
    console.warn(error);
    logger.error(error.message);
    if (error.message.includes("connect ECONNREFUSED")) {
      setTimeout(() => startUp(), 10000);
    } else if (error.message.includes("Channel is not established.")) {
      setTimeout(() => startUp(), 10000);
    }
  }
}

module.exports = {
  sendMessage,
  startMQConnection,
  rabbitmqListen
}