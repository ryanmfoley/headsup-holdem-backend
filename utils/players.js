function Player(id, username, room = id) {
	this.id = id
	this.username = username
	this.room = room
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

export { Player, addPlayer, removePlayer }
