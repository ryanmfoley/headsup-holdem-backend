class Deck {
	constructor() {
		this.cards = []
	}

	buildDeck() {
		const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
		const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']

		suits.forEach((suit) =>
			ranks.forEach((rank, index) => {
				this.cards.push({ rank, suit, value: index + 2 })
			})
		)
	}

	// Fisher-Yates algorithm for shuffling cards //
	shuffle() {
		this.buildDeck()

		for (let i = this.cards.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1))
			let x = this.cards[i]
			this.cards[i] = this.cards[j]
			this.cards[j] = x
		}
	}
}

module.exports = Deck
