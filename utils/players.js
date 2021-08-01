function Player(id, username) {
	this.id = id
	this.username = username
}

const addPlayer = (playersWaiting, newPlayer) => {
	if (
		!playersWaiting.find((player) => player.username === newPlayer.username)
	) {
		playersWaiting.push(newPlayer)
	}

	return playersWaiting
}

const removePlayer = (playersWaiting, id) =>
	playersWaiting.filter((player) => player.id !== id)

module.exports = { Player, addPlayer, removePlayer }
