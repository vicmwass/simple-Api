const app = require('./app.js')
const {defLogger } =require('./logger.js')
const logger=defLogger

const PORT = process.env.PORT || 3000

app.listen(PORT,() => {
    logger.info('Server started listening at port '+PORT)
  })