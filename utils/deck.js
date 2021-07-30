class Deck {
	constructor() {
		this.cards = []
	}

	buildDeck() {
		const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
		const ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 'J', 'Q', 'K']

		for (let suit of suits) {
			for (let rank of ranks) {
				this.cards.push({ rank, suit })
			}
		}
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

// const deck = new Deck()

module.exports = Deck
