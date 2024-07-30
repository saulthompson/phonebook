const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const helper = require('./test_helper.js')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Contact = require('../models/contact')
const api = supertest(app)


describe('when there are some contacts initially saved', () => {
  beforeEach(async () => {
    await Contact.deleteMany({})
    let contactObject = new Contact(helper.initialContacts[0])
    await contactObject.save()
    contactObject = new Contact(helper.initialContacts[1])
    await contactObject.save()
  })

  test('persons are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all contacts are returned', async() => {
    const response = await api
      .get('/api/persons')
      .expect(200)

    assert.strictEqual(response.body.length, helper.initialContacts.length )
  })

  test.only('a specific contact is within the returned contacts', async() => {
    const response = await api.get('/api/persons')
    const names = response.body.map(c => c.name)
    assert(names.includes(helper.initialContacts[0].name))
  })

  describe('viewing a specific contact', () => {
    test('succeeds with a valid id', async() => {
      const contactsAtStart = await helper.contactsInDb()
      const contactToView = contactsAtStart[0]

      const response = await api
        .get(`/api/persons/${contactToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      assert.strictEqual(response.body.name, contactToView.name)
    })

    test('fails with statuscode 400 if the contact doesn\'t exist', async() => {
      const validNonExistingId = await helper.nonExistingId()

      await api
        .get(`/api/persons/${validNonExistingId}`)
        .expect(400)
    })

    test('fails with statuscode 400 for invalid id', async() => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/persons/${invalidId}`)
        .expect(400)
    })
  })
  
  describe('addition of a new contact', () => {
    test('succeeds with valid data', async () => {
      const newContact = {
        name: 'Endymion',
        number: '666666',
      }

      await api
        .post('/api/persons')
        .send(newContact)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const contactsAtEnd = await helper.contactsInDb()
      assert.strictEqual(contactsAtEnd.length, helper.initialContacts.length + 1)

      const names = contactsAtEnd.map(n => n.name)
      assert(names.includes('Endymion'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newContact = {
        number: '45354354'
      }

      await api
        .post('/api/persons')
        .send(newContact)
        .expect(400)

      const contactsAtEnd = await helper.contactsInDb()

      assert.strictEqual(contactsAtEnd.length, helper.initialContacts.length)
    })
  })

  describe('deletion of a contact', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const contactsAtStart = await helper.contactsInDb()
      const contactToDelete = contactsAtStart[0]

      await api
        .delete(`/api/persons/${contactToDelete.id}`)
        .expect(204)

      const contactsAtEnd = await helper.contactsInDb()

      assert.strictEqual(contactsAtEnd.length, helper.initialContacts.length - 1)

      const names = contactsAtEnd.map(r => r.name)
      assert(!names.includes(contactToDelete.name))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
