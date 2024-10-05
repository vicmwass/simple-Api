import morgan from 'morgan'
import {infoLogger as logger,defLogger as logger2} from './logger.js'

const morganFormat = `
{    "method": ":method",    "url": ":url",    "status": ":status",    "response-time": ":response-time",    "ip_addr": ":remote-addr"}`

function messageHandler (message) {
  const data= JSON.parse(message.trim())
  logger.info('Request received '+message.trim())
  logger2.info(`Request received :: ${data.method} ${data.url} status:${data.status} from_ip:${data.ip_addr}`)
}

const morganMiddleware = morgan(
  morganFormat,
  {
    stream: { write: messageHandler }
  }
)

export default morganMiddleware
