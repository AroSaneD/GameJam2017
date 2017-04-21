import { Card } from './Card';

export class CardResponse {
    constructor(public cardId: number, public swipedLeft?: boolean) {

    }
}