if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const cors = require('cors')
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: true })

// Middleware //
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(cors())

// Passport Config
require('./config/passport')(passport)

// Controllers //
app.use('/api/users', require('./controllers/users'))

const { PORT } = process.env

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
