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

	isStraight(playersHand) {
		let playersHandValue

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

dealer.shuffle()

console.log(dealer.cards)
