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
		this.cards = []
		this.buildDeck()

		for (let i = this.cards.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1))
			let x = this.cards[i]
			this.cards[i] = this.cards[j]
			this.cards[j] = x
		}
	}

	dealCards(num) {
		const cards = []

		for (let i = 0; i < num; i++) cards.push(this.cards.pop())

		return cards
	}

	isRoyalFlush(hand) {
		const MAX_STRAIGHT_FLUSH_VALUE = 8490523139
		const isBroadway = hand.every((card) => card.value >= 10)
		const isRoyalFlush = isBroadway && this.isFlush(hand)

		const handValue = isRoyalFlush ? MAX_STRAIGHT_FLUSH_VALUE + 1 : 0
	}

	isStraightFlush(hand) {
		const MAX_FOUR_OF_A_KIND_VALUE = 8359411030
		const isStraightFlush = this.isStraight(hand) && this.isFlush(hand)

		const handValue = isStraightFlush
			? MAX_FOUR_OF_A_KIND_VALUE + this.isHighCard(hand)
			: 0

		return handValue
	}

	isFourOfAKind(hand) {
		const MAX_FULL_HOUSE_VALUE = 6946269616
		const cardCounts = {}

		// Count occurences of each rank //
		hand.forEach(({ rank }) => (cardCounts[rank] = (cardCounts[rank] || 0) + 1))

		const counts = Object.values(cardCounts)
		const isFourOfAKind = counts.includes(4)
		const handValue = isFourOfAKind
			? MAX_FULL_HOUSE_VALUE + this.isHighCard(hand)
			: 0

		return handValue
	}

	isFullHouse(hand) {
		const MAX_FLUSH_VALUE = 5533128302
		const cardCounts = {}

		// Count occurences of each rank //
		hand.forEach(({ rank }) => (cardCounts[rank] = (cardCounts[rank] || 0) + 1))

		const counts = Object.values(cardCounts)
		const isFullHouse = counts.includes(2) && counts.includes(3)
		const handValue = isFullHouse ? MAX_FLUSH_VALUE + this.isHighCard(hand) : 0

		return handValue
	}

	isFlush(hand) {
		const MAX_STRAIGHT_VALUE = 5391817173
		const isFlush = hand.every((card) => card.suit === hand[0].suit)

		const handValue = isFlush ? MAX_STRAIGHT_VALUE + this.isHighCard(hand) : 0

		return handValue
	}

	isStraight(hand) {
		const MAX_TRIPS_VALUE = 4380695859
		const handCopy = hand.map((card) => ({ ...card }))
		let sortedHand = handCopy.sort((a, b) => a.value - b.value)

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

		const handValue = isStraight
			? MAX_TRIPS_VALUE + this.isHighCard(handCopy)
			: 0

		return handValue
	}

	isTrips(hand) {
		const MAX_TWO_PAIR_VALUE = 2967554631
		const cardCounts = {}
		let handValue = 0

		// Count occurences of each rank //
		hand.forEach(
			({ value }) => (cardCounts[value] = (cardCounts[value] || 0) + 1)
		)

		for (let i in cardCounts) {
			if (cardCounts[i] == 3)
				handValue = Number(i) + this.isHighCard(hand) + MAX_TWO_PAIR_VALUE
		}

		return handValue
	}

	isTwoPair(hand) {
		const MAX_PAIR_VALUE = 1554433247
		const cardCounts = {}
		const pairs = {}

		// Count occurences of each rank //
		hand.forEach(
			({ value }) => (cardCounts[value] = (cardCounts[value] || 0) + 1)
		)

		for (let i in cardCounts) {
			if (cardCounts[i] == 2) pairs[i] = cardCounts[i]
		}

		const highPair = Math.max.apply(null, Object.keys(pairs))
		const twoPairValue = highPair * 5

		if (Object.keys(pairs).length < 2) return 0

		const handValue = twoPairValue + this.isHighCard(hand) + MAX_PAIR_VALUE

		return handValue
	}

	isPair(hand) {
		const MAX_HIGH_CARD_VALUE = 141312119
		const cardCounts = {}

		// Count occurences of each rank //
		hand.forEach(
			({ value }) => (cardCounts[value] = (cardCounts[value] || 0) + 1)
		)

		for (let val in cardCounts) {
			if (cardCounts[val] == 2) {
				const handValue =
					Number(val) + this.isHighCard(hand) + MAX_HIGH_CARD_VALUE

				return handValue
			}
		}

		return 0
	}

	isHighCard(hand) {
		// Create array of card values //
		const stringCardValues = hand.map(({ value }) => value)

		// Combine string values and convert to integer //
		const handValue = +stringCardValues.join('')

		return handValue
	}

	getPokerHandCombos(cards) {
		let pokerHands = []

		for (let i = 0; i < 7; i++) {
			for (let j = 6; j > i; j--) {
				pokerHands.push(
					cards.filter((card) => card !== cards[i] && card !== cards[j])
				)
			}
		}

		return pokerHands
	}

	calculateHandValue(hand) {
		const handValue =
			this.isRoyalFlush(hand) ||
			this.isStraightFlush(hand) ||
			this.isFourOfAKind(hand) ||
			this.isFullHouse(hand) ||
			this.isFlush(hand) ||
			this.isStraight(hand) ||
			this.isTrips(hand) ||
			this.isTwoPair(hand) ||
			this.isPair(hand) ||
			this.isHighCard(hand)

		return handValue
	}

	getValueOfBestHand(cards) {
		const hands = this.getPokerHandCombos(cards)

		const maxHandValue = hands.reduce((acc, hand) => {
			const handValue = this.calculateHandValue(hand)

			return acc > handValue ? acc : handValue
		})

		return maxHandValue
	}
}

const dealer = new Dealer()

module.exports = dealer
