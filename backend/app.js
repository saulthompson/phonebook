require('./instrument.js');
const config = require('./utils/config')
const logger = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const contactsRouter = require('./controllers/contacts')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const Sentry = require("@sentry/node");
const express = require('express')

// const relDbConnection = async() => {
//   try {
//     await sequelize.authenticate()
//     console.log('Connection has been established successfully')
//     sequelize.close()
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }
// }

// relDbConnection()

const app = express()

app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/persons', contactsRouter)
app.use('/api/users', usersRouter)
app.use(express.static('dist'))
app.use(cors())

Sentry.setupExpressErrorHandler(app);
// app.use(morgan(':person'))

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
        .then(() => {
          logger.info('connected to MongoDB')
        })
        .catch((error) => {
          logger.error('error connecting to MongoDB:', error.message)
        })



morgan.token('person', function(req, res) {
  console.log('hello');
  return JSON.stringify(req.body)
})


app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)