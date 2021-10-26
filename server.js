if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const app = express()
const server = app.listen(process.env.PORT)
const io = require('socket.io')(server, { cors: true })
const cors = require('cors')

// Middleware //
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Controllers //
app.use('/api/users', require('./controllers/users'))

const { Player, addPlayer, removePlayer } = require('./utils/players')
let playersWaiting = []

//______________________________________________________________
// START SOCKET CONNECTION HERE

// Run when client connects //
io.on('connection', (socket) => {
	// Send player data and waiting list to client //
	socket.once('enter-lobby', (username) => {
		const player = new Player(socket.id, username)

		socket.emit('enter-lobby', player)
		socket.emit('players-waiting', playersWaiting)
	})

	socket.on('create-game', (player) => {
		// Add player to waiting list //
		playersWaiting = addPlayer(playersWaiting, player)

		// Send list of players waiting to client //
		io.emit('players-waiting', playersWaiting)
	})

	socket.on('update-players-waiting', (id) => {
		// Remove player from waiting list //
		playersWaiting = removePlayer(playersWaiting, id)

		io.emit('players-waiting', playersWaiting)
	})

	socket.on('enter-poker-room', ({ roomId, currentPlayer }) => {
		// Join socket to a given room //
		socket.join(roomId)

		if (currentPlayer.id !== roomId) io.to(roomId).emit('start-game')

		socket.once('get-players-info', (player) =>
			socket.to(roomId).emit('get-players-info', player)
		)

		socket.on('deal', () => {
			const dealer = require('./utils/dealer')

			dealer.shuffleDeck()

			// Deal hole cards //
			const playerOneHoleCards = dealer.dealCards(2)
			const playerTwoHoleCards = dealer.dealCards(2)

			socket.emit('deal-preflop', playerOneHoleCards)
			socket.to(roomId).emit('deal-preflop', playerTwoHoleCards)

			// Deal community cards //
			const flop = dealer.dealCards(3)
			const turn = dealer.dealCards(1)
			const river = dealer.dealCards(1)

			socket.once('deal-flop', () => io.to(roomId).emit('deal-flop', flop))
			socket.once('deal-turn', () => io.to(roomId).emit('deal-turn', turn))
			socket.once('deal-river', () => io.to(roomId).emit('deal-river', river))
		})

		socket.on('fold', () => {
			io.to(roomId).emit('fold')

			io.to(roomId).emit('hand-results', {
				losingPlayer: currentPlayer.username,
			})
		})

		socket.on('check', () => io.to(roomId).emit('check'))

		socket.on('call', (callAmount) => io.to(roomId).emit('call', callAmount))

		socket.on('bet', ({ betAmount }) => io.to(roomId).emit('bet', betAmount))

		socket.on('raise', ({ callAmount, raiseAmount }) =>
			io.to(roomId).emit('raise', {
				callAmount,
				raiseAmount,
			})
		)

		// Listen to hand-is-over event emitted by host //
		socket.on('hand-is-over', () => io.to(roomId).emit('hand-is-over'))

		// Listen to showdown event emitted by both players sending holecards //
		socket.on('showdown', (holeCards) =>
			// Send opponents name and holeCards to other player //
			socket.to(roomId).emit('determine-winner', {
				username: currentPlayer.username,
				holeCards,
			})
		)

		// Listen to determine-winner event emitted by opponent //
		socket.on(
			'determine-winner',
			({ opponentsName, playerOnesHand, playerTwosHand }) => {
				const dealer = require('./utils/dealer')
				let winningPlayer
				let winningHand
				let isDraw = false

				// Host is playerOne and opponent is playerTwo //
				const playerOnesHandObj = dealer.getValueOfBestHand(playerOnesHand)
				const playerTwosHandObj = dealer.getValueOfBestHand(playerTwosHand)

				if (playerOnesHandObj.handValue > playerTwosHandObj.handValue) {
					// Current player wins //
					winningPlayer = currentPlayer.username
					winningHand = playerOnesHandObj.handType
				} else if (playerOnesHandObj.handValue < playerTwosHandObj.handValue) {
					// Oponnent wins //
					winningPlayer = opponentsName
					winningHand = playerTwosHandObj.handType
				} else {
					// Draw //
					winningHand = playerOnesHandObj.handType
					isDraw = true
				}

				io.to(roomId).emit('hand-results', {
					winningPlayer,
					winningHand,
					isDraw,
				})
			}
		)

		// Listen for messages from client
		socket.on('send-chat-message', (message, clearMessage) => {
			// Send messages to current users room
			io.to(roomId).emit('chat-message', {
				user: currentPlayer.username,
				text: message,
			})

			clearMessage()
		})

		socket.on('logout', (id) => {
			// Remove player from waiting list //
			playersWaiting = removePlayer(playersWaiting, id)

			io.to(roomId).emit('opponent-left-game')
			io.emit('players-waiting', playersWaiting)
		})
	})
})
