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

//______________________________________________________________
// START SOCKET CONNECTION HERE

// Run when client connects //
io.on('connection', (socket) => {
	const { Player, addPlayer, removePlayer } = require('./utils/players')
	const Dealer = require('./utils/dealer')

	let playersWaiting = []

	// Send player data and waiting list to client //
	socket.once('enterLobby', (username) => {
		const player = new Player(socket.id, username)

		socket.emit('enterLobby', player)
		socket.emit('playersWaiting', playersWaiting)
	})

	socket.once('createGame', (player) => {
		// Add player to waiting list //
		playersWaiting = addPlayer(playersWaiting, player)

		// Send list of players waiting to client //
		io.emit('playersWaiting', playersWaiting)
	})

	socket.on('updatePlayersWaiting', (id) => {
		// Remove player from waiting list //
		playersWaiting = removePlayer(playersWaiting, id)

		io.emit('playersWaiting', playersWaiting)
	})

	socket.on('enterPokerRoom', ({ id, currentPlayer }) => {
		// Join socket to a given room //
		socket.join(id)

		// Second player joined //
		if (currentPlayer.id !== id) io.to(id).emit('startGame')

		socket.once('getPlayersInfo', (player) =>
			// socket.to(id).emit('getPlayersInfo', player)
			io.to(id).emit('getPlayersInfo', player)
		)

		socket.on('deal', () => {
			const dealer = new Dealer()
			dealer.shuffleDeck()

			// Deal cards //
			const holeCards = dealer.dealHoleCards()
			const communityCards = dealer.dealCommunityCards()

			socket.to(id).emit('dealHoleCards', holeCards)
			io.to(id).emit('dealCommunityCards', communityCards)
		})
	})

	socket.on('logout', (id) => {
		// Remove player from waiting list //
		playersWaiting = removePlayer(playersWaiting, id)

		io.emit('playersWaiting', playersWaiting)
	})
})

const { PORT } = process.env

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
