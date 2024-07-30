const { Pool } = require('pg')
const config = require('../utils/config')

const pool = new Pool({
  user: config.PGUSER,
  host: config.PGHOST,
  database: config.PGDATABASE,
  password: config.PGPASSWORD,
  port: config.PGPORT,
})

const getUsers = async () => {
  try {
    const results = await pool.query("SELECT * FROM usernames")
    console.log('results here', results)
    return results.rows
  } catch (error) {
    console.error(error)
    throw new Error("internal server error")
  }
}

module.exports = {
  getUsers
}
// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//   username: String,
//   name: String,
//   passwordHash: String,
//   contacts: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Contact"
//     }
//   ],
// })

// userSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//     delete returnedObject.passwordHash
//   }
// })

// const User = mongoose.model('User', userSchema)

// module.exports = User