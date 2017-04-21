import { CardResponse } from './CardResponse';

export class Card {

    id: number;

    question: string;

    onLeft: Array<number>;
    onRight: Array<number>;
    onIgnore: Array<number>;

    requiredResponses: Array<CardResponse>;
    cardFamily?: number;

}