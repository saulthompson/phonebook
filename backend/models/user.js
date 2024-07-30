const Pool = require('pg').Pool

const pool = new Pool();

const getUsers = async() => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM users", (error, results) => {
        if (error) {
          reject(error)
        }
        if (results && results.rows) {
          resolve(results.rows)
        } else {
          reject(new Error("no results found"))
        }
      })
    })
  } catch (error_1) {
    console.error(error_1)
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