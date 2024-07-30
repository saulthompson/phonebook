const Contact = require('../models/contact')
const User = require('../models/user')

const initialContacts = [
  {
    name: "Mark",
    number: "3429874324"
  },
  {
    name: "Luke",
    number: "8795698643"
  }
]

const nonExistingId = async () => {
  const contact = new Contact({ name: 'willremovethissoon', number: "55555" })
  await contact.save()
  await contact.deleteOne()

  return contact._id.toString()
}

const contactsInDb = async() => {
  const contacts = await Contact.find({})
  return contacts.map(contact => contact.toJSON())
}

const usersInDb = async() => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialContacts, nonExistingId, contactsInDb, usersInDb
}