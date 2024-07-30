// const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { getUsers } = require('../models/user')

usersRouter.get('/', async (req, res) => {
  try {
    const users = await getUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// usersRouter.post('/', async (request, response, next) => {
//   const { username, name, password } = request.body

//   const saltRounds = 10
//   const passwordHash = await bcrypt.hash(password, saltRounds)

//   const user = new User({
//     username: username,
//     name,
//     passwordHash,
//   })

//   try {
//     const savedUser = await user.save()
//     response.status(201).json(savedUser)
//   } 
//   catch(error) {
//     next(error)
//   }
// })

// usersRouter.get('/', async (request, response) => {
//   const users = await User.find({}).populate('contacts', {name: 1, number: 1})
//   response.json(users)
// })


module.exports = usersRouter