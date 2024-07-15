require ('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

app.use(express.static('dist'))

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan(':person'))

morgan.token('person', function(req, res) {
  console.log('hello');
  return JSON.stringify(req.body)
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  }).catch(error => alert(error))
})

app.get('/info', (request, response) => {
  const entries = persons.length

  response.send(`<p>Phonebook has info for ${entries} people</p>
  <p>${new Date().toLocaleString()}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id).then(contact => {
    response.json(contact.toJSON())
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = String(request.params.id)

  if (persons.findIndex(p => p.id === id) !== -1) {
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})


app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(404).json({
      "error": "content missing",
    })
  } else if (persons.findIndex(p => p.name === body.name !== -1)) {
     return response.status(400).end()
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on ${PORT}`);