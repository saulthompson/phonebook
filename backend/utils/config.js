require('dotenv').config()

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI, // MongoDB connection string
  PGUSER: process.env.PGUSER,
  PGHOST: process.env.PGHOST,
  PGDATABASE: process.env.PGDATABASE,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: process.env.PGPORT
}

module.exports = config