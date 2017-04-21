import { Card } from './Card';
import { CardResponse } from './CardResponse';

export class DecisionTree {

    completedCardResponses: Array<CardResponse>;

    getNextCard(): Card {
        throw new Error('Not implemented');
    }


    getAvailableCards(): Card {
        throw new Error('Not implemented');
    }


    madeDecisions(card: Card, response?: boolean) {
        throw new Error('Not implemented');
    }

}