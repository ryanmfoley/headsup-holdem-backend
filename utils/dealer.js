const Deck = require('./deck')

class Dealer extends Deck {
	constructor() {
		super()
		this.communityCards = []
	}

	dealCards(deck, num) {
		this.communityCards = []

		for (let i = 1; i < num; i++) this.communityCards.push(deck.cards.pop())
	}

	isRoyalFlush(playersHand) {
		let playersHandValue

		return playersHandValue
	}

	isStraightFlush(playersHand) {
		let playersHandValue

		return playersHandValue
	}

	isFullHouse(playersHand) {
		let playersHandValue

		return playersHandValue
	}

	isFlush(playersHand) {
		let playersHandValue

		return playersHandValue
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

		const playersHandValue = isStraight ? 100 : 0

		return playersHandValue
	}

	isTrips(playersHand) {
		let playersHandValue

		return playersHandValue
	}

	isTwoPair(playersHand) {
		let playersHandValue

		return playersHandValue
	}

	isPair(playersHand) {
		let playersHandValue

		return playersHandValue
	}

	isHighCard(playersHand) {
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

const dealer = new Dealer()

dealer.buildDeck()

// console.log(dealer.cards)

// NOTES //
// acount for A-5 and 10-A straight
