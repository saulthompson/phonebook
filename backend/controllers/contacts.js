const contactsRouter = require('express').Router()
const Contact = require('../models/contact')
const User = require('../models/user')
const app = require('../app.js')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

contactsRouter.get('/', (request, response, next) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  }).catch(error => next(error))
})

// app.get('/info', (request, response, next) => {
//   const entries = persons.length

//   response.send(`<p>Phonebook has info for ${entries} people</p>
//   <p>${new Date().toLocaleString()}</p>
//   `)
// })

contactsRouter.get('/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {response.json(contact.toJSON())})
    .catch(error => next(error))
})

contactsRouter.delete('/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


contactsRouter.post('/', async(request, response, next) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  console.log('token log', decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  let existingContact = await Contact.findOne({ name: body.name })
  if (existingContact) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  try{
    const user = await User.findById(body.userId)
      console.log('user here', user)
      const contact = new Contact({
        name: body.name,
        number: body.number,
        userId: user.id
      });

      const savedContact = await contact.save()

      user.contacts = user.contacts.concat(savedContact._id)
      await user.save()
      response.status(201).json(savedContact);
    }
      catch(error) {next(error)}
  })

module.exports = contactsRouter