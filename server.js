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

	socket.once('enterPokerRoom', ({ roomId, currentPlayer }) => {
		socket.player = currentPlayer

		// Join socket to a given room //
		socket.join(roomId)

		if (currentPlayer.id !== roomId) io.to(roomId).emit('startGame')

		socket.once('getPlayersInfo', (player) =>
			socket.to(roomId).emit('getPlayersInfo', player)
		)

		socket.on('deal', () => {
			const dealer = require('./utils/dealer')

			dealer.shuffleDeck()

			// Deal hole cards //
			const playerOneHoleCards = dealer.dealCards(2)
			const playerTwoHoleCards = dealer.dealCards(2)

			socket.emit('dealPreFlop', playerOneHoleCards)
			socket.to(roomId).emit('dealPreFlop', playerTwoHoleCards)

			// Deal community cards //
			const flop = dealer.dealCards(3)
			const turn = dealer.dealCards(1)
			const river = dealer.dealCards(1)

			socket.once('dealFlop', () => io.to(roomId).emit('dealFlop', flop))
			socket.once('dealTurn', () => io.to(roomId).emit('dealTurn', turn))
			socket.once('dealRiver', () => io.to(roomId).emit('dealRiver', river))
		})

		socket.on('fold', () => {
			const winningPlayer = socket.player.isPlayerOne
				? 'playerTwo'
				: 'playerOne'

			io.to(roomId).emit('handResults', { winningPlayer })
		})

		socket.on('check', () =>
			io.to(roomId).emit('check', { player: socket.player })
		)

		socket.on('call', (callAmount) => io.to(roomId).emit('call', callAmount))

		socket.on('bet', ({ betAmount }) => io.to(roomId).emit('bet', betAmount))

		socket.on('raise', ({ callAmount, raiseAmount }) =>
			io.to(roomId).emit('raise', {
				callAmount,
				raiseAmount,
			})
		)

		// Listen to handIsOver event emitted by host //
		socket.on('handIsOver', () => io.to(roomId).emit('handIsOver'))

		// Listen to showdown event emitted by both players sending holecards //
		socket.on('showdown', (holeCards) =>
			// Send opponents holeCards to other player //
			socket.to(roomId).emit('determineWinner', holeCards)
		)

		// Listen to determineWinner event emitted by opponent //
		socket.on('determineWinner', ({ playerOnesHand, playerTwosHand }) => {
			const dealer = require('./utils/dealer')
			let winningPlayer
			let isDraw = false

			// Host is playerOne and opponent is playerTwo //
			const playerOnesHandValue = dealer.getValueOfBestHand(playerOnesHand)
			const playerTwosHandValue = dealer.getValueOfBestHand(playerTwosHand)

			if (playerOnesHandValue > playerTwosHandValue) {
				winningPlayer = 'playerOne'
			} else if (playerOnesHandValue < playerTwosHandValue) {
				winningPlayer = 'playerTwo'
			} else {
				isDraw = true
			}

			io.to(roomId).emit('handResults', { winningPlayer, isDraw })
		})
	})

	socket.on('logout', (id) => {
		// Remove player from waiting list //
		playersWaiting = removePlayer(playersWaiting, id)

		io.emit('playersWaiting', playersWaiting)
	})
})
