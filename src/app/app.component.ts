import { Component } from '@angular/core';
import { Card } from './model/Card';
import { DecisionTree } from './model/DecisionTree';
import { Http } from '@angular/http';

import 'rxjs';
import { CardService } from './services/CardService';
import { PointsService } from './services/PointsService';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CardService, PointsService]
})
export class AppComponent {
  title = 'app works12313!';
  currentCard: Card;
  decisions: DecisionTree;

  constructor(private cardService: CardService, private pointsService: PointsService) {

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

  private clickLeft() {
    // alert("Click left");
    let isGameEnd = this.pointsService.addPoints(this.currentCard.onLeft);
    if (!isGameEnd) {
      this.decisions.madeDecisions(this.currentCard, true);
      this.currentCard = this.decisions.getNextCard();
    } else {
      $('#endGameModal').modal('toggle');
    }
  }

  private clickRight() {
    // alert("Click right");
    let isGameEnd = this.pointsService.addPoints(this.currentCard.onRight);
    if (!isGameEnd) {
      this.decisions.madeDecisions(this.currentCard, false);
      this.currentCard = this.decisions.getNextCard();
    } else {
      $('#endGameModal').modal('toggle');
    }
  }
}
