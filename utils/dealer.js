class Dealer {
	constructor() {
		this.cards = []
	}

	buildDeck() {
		const suits = ['spades', 'hearts', 'clubs', 'diamonds']
		const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']

		suits.forEach((suit, suitIndex) => {
			const color = suit === 'spades' || suit === 'clubs' ? 'black' : 'red'
			let symbol
			switch (suit) {
				case 'spades':
					symbol = '♠️'
					break
				case 'hearts':
					symbol = '♥️'
					break
				case 'clubs':
					symbol = '♣️'
					break
				case 'diamonds':
					symbol = '♦️'
					break
			}

			ranks.forEach((rank, rankIndex) => {
				this.cards.push({
					id: `${suitIndex}${rankIndex}`,
					rank,
					suit,
					value: rankIndex + 2,
					color,
					symbol,
				})
			})
		})
	}

	// Fisher-Yates algorithm for shuffling cards //
	shuffleDeck() {
		this.buildDeck()

		for (let i = this.cards.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1))
			let x = this.cards[i]
			this.cards[i] = this.cards[j]
			this.cards[j] = x
		}
	}

	dealHoleCards() {
		const cards = []

		// Deal 2 cards //
		cards.push(this.cards.pop())
		cards.push(this.cards.pop())

		return cards
	}

	dealCommunityCards() {
		const cards = []

		// Deal 5 cards //
		for (let i = 1; i <= 5; i++) {
			cards.push(this.cards.pop())
		}

		return cards
	}

	isRoyalFlush(hand) {
		const isBroadWay = hand.every((card) => card.value >= 10)
		const isRoyalFlush = isBroadway && this.isFlush(hand)

		const handValue = isRoyalFlush ? 1000 : 0
	}

	isStraightFlush(hand) {
		const isStraightFlush = this.isStraight(hand) && this.isFlush(hand)

		const handValue = isStraightFlush ? 500 : 0
	}

	isFullHouse(hand) {
		let playersHandValue

		return playersHandValue
	}

	isFlush(hand) {
		const isFlush = hand.every((card) => card.suit === hand[0].suit)

		const handValue = isFlush ? 200 : 0

		return handValue
	}

	isStraight(hand) {
		let sortedHand = hand.sort((a, b) => a.value - b.value)

		function allConsecutives(hand) {
			for (let i = 0; i < hand.length - 1; i++) {
				if (hand[i + 1].value - hand[i].value !== 1) return false
			}
			return true
		}

		// Check for consecutive values //
		let isStraight = allConsecutives(sortedHand)

		// Check for 5-high straight //
		if (!isStraight && sortedHand.some((card) => card.value === 14)) {
			// Change Ace value to 1 for low //
			sortedHand = sortedHand.map((card) => {
				if (card.value === 14) card.value = 1
				return card
			})

			// Sort Values //
			sortedHand = sortedHand.sort((a, b) => a.value - b.value)

			isStraight = allConsecutives(sortedHand)
		}

		const handValue = isStraight ? 100 : 0

		return handValue
	}

	isTrips(hand) {
		let playersHandValue

		return playersHandValue
	}

	isTwoPair(hand) {
		let playersHandValue

		return playersHandValue
	}

	isPair(hand) {
		let playersHandValue

		return playersHandValue
	}

	isHighCard(hand) {
		let playersHandValue

		return playersHandValue
	}

	calculateHandValues(playerOnesHand, playerTwosHand) {
		const playerOnesHandValue =
			this.isRoyalFlush(playerOnesHand) ||
			this.isStraightFlush(playerOnesHand) ||
			this.isFullHouse(playerOnesHand) ||
			this.isFlush(playerOnesHand) ||
			this.isStraight(playerOnesHand) ||
			this.isTrips(playerOnesHand) ||
			this.isTwoPair(playerOnesHand) ||
			this.isPair(playerOnesHand) ||
			this.isHighCard(playerOnesHand)

		const playerTwosHandValue =
			this.isRoyalFlush(playerTwosHand) ||
			this.isStraightFlush(playerTwosHand) ||
			this.isFullHouse(playerTwosHand) ||
			this.isFlush(playerTwosHand) ||
			this.isStraight(playerTwosHand) ||
			this.isTrips(playerTwosHand) ||
			this.isTwoPair(playerTwosHand) ||
			this.isPair(playerTwosHand) ||
			this.isHighCard(playerTwosHand)

		return { playerOnesHandValue, playerTwosHandValue }
	}
}

module.exports = Dealer
