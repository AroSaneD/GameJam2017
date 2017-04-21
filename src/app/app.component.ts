import { Component } from '@angular/core';
import { Card } from './model/Card';
import { DecisionTree } from './model/DecisionTree';
import { Http } from '@angular/http';

import 'rxjs';
import { CardService } from './services/CardService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CardService]
})
export class AppComponent {
  title = 'app works12313!';
  currentCard: Card;
  decisions: DecisionTree;

  constructor(private cardService: CardService) {

    console.log("starting");
    cardService.getAllCards().subscribe(cards => {
      this.decisions = new DecisionTree(cards);
      console.log(cards);
      this.setup(cards);
    });
  }

  private setup(cards: Array<Card>) {
    this.currentCard = this.decisions.getNextCard();
    console.log(this.currentCard);
  }
}
