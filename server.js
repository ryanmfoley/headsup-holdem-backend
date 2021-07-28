if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: true })

// Middleware //
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

const { PORT } = process.env

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
