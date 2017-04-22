import { Card } from './Card';
import { CardResponse } from './CardResponse';

export class DecisionTree {

    completedCardResponses: Array<CardResponse>;

    constructor(public loadedCards: Array<Card>) {
        this.completedCardResponses = [];
    }


    getNextCard(): Card {
        let unplayedCards = this.getAvailableCards();

        if (unplayedCards && unplayedCards.length > 0) {
            return unplayedCards[Math.floor(Math.random() * unplayedCards.length)];
        }

        return null;
    }


    getAvailableCards(): Array<Card> {
        let unplayedCards = this.loadedCards.filter(c => !this.completedCardResponses.some(r => r.cardId === c.id));

        let availableUnplayedCards = unplayedCards.filter(unplayedCard => {
            let shouldPlay = true;
            unplayedCard.requiredResponses.forEach(requiredResponse => {

                let matchExists = this.completedCardResponses.some(existingResponse => {
                    return existingResponse.cardId === requiredResponse.cardId &&
                        existingResponse.swipedLeft === requiredResponse.swipedLeft;
                });

                if (!matchExists) {
                    shouldPlay = false;
                }
            });

            return shouldPlay;
        });

        return availableUnplayedCards;
    }


    madeDecisions(card: Card, response?: boolean) {
        this.completedCardResponses.push(new CardResponse(card.id, response));
    }

}