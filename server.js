if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const app = express()
const server = app.listen(process.env.PORT)
const io = require('socket.io')(server, { cors: true })
const passport = require('passport')
const cors = require('cors')

// Middleware //
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(cors())

// Passport Config //
require('./config/passport')(passport)

// Controllers //
app.use('/api/users', require('./controllers/users'))

const { Player, addPlayer, removePlayer } = require('./utils/players')
let playersWaiting = []

//______________________________________________________________
// START SOCKET CONNECTION HERE

// Run when client connects //
io.on('connection', (socket) => {
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

	socket.once('enterPokerRoom', (roomId, currentPlayer) => {
		// Join socket to a given room //
		socket.join(roomId)

		// Second player joined //
		if (currentPlayer.id !== roomId) io.to(roomId).emit('startGame')

		socket.once('getPlayersInfo', (player) =>
			io.to(roomId).emit('getPlayersInfo', player)
		)

		socket.on('deal', () => {
			const dealer = require('./utils/dealer')
			dealer.shuffleDeck()

			// Deal community cards //
			const communityCards = dealer.dealCommunityCards()

			// Deal hole cards //
			const playerOneHoleCards = dealer.dealHoleCards()
			const playerTwoHoleCards = dealer.dealHoleCards()

			io.to(roomId).emit(
				'deal',
				playerOneHoleCards,
				playerTwoHoleCards,
				communityCards
			)
		})

		socket.on('action', (action, bet) => {
			io.to(roomId).emit('action', action, bet)
		})
	})

	socket.on('logout', (id) => {
		// Remove player from waiting list //
		playersWaiting = removePlayer(playersWaiting, id)

		io.emit('playersWaiting', playersWaiting)
	})
})
