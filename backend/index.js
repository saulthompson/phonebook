const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const password = process.argv[2]
const url = process.env.MONGODB_URL
const app = express()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

mongoose.set('strictQuery',false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

app.use(express.json())
app.use(cors())
app.use(morgan(':person'))

morgan.token('person', function(req, res) {
  console.log('hello');
  return JSON.stringify(req.body)
})

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  contactSchema.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/info', (request, response) => {
  const entries = persons.length

  response.send(`<p>Phonebook has info for ${entries} people</p>
  <p>${new Date().toLocaleString()}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = String(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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

  if (!body.name || !body.number) {
    return response.status(404).json({
      "error": "content missing",
    })
  } else if (persons.findIndex(p => p.name === body.name !== -1)) {
     return response.status(400).end()
  }

  const id = Math.floor(1000000 * Math.random())

  const person = {
    id: id.toString(),
    name: body.name,
    number: body.number,
  }
  persons = persons.concat(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on ${PORT}`);