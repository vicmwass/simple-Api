import pino from 'pino'
import pretty from 'pino-pretty'

export const defLogger = pino(pretty())
export const infoLogger=pino(pino.destination('./app.log'))

defLogger.level = process.env.LOG_LEVEL || 'trace'
infoLogger.level = process.env.LOG_LEVEL || 'trace'


