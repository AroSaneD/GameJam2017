import { CardResponse } from './CardResponse';

export class Card {

    id: number;

    question: string;

    leftText: string;
    rightText: string;

    onLeft: Array<number>;
    onRight: Array<number>;
    onIgnore: Array<number>;

    requiredResponses: Array<CardResponse>;
    cardFamily?: number;

}