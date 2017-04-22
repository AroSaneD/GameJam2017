import { Component, ViewChild, ElementRef } from '@angular/core';
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
  private readonly maxXOffset: number = 130;
  private readonly maxRotation: number = 5;
  private readonly maxYOffset: number = 40;

  title = 'app works12313!';
  currentCard: Card;
  decisions: DecisionTree;

  cardXCoordinate: number = 0;

  private get cardRotation(): number {
    return Math.abs(this.cardXCoordinate) / this.maxXOffset * this.maxRotation * Math.sign(this.cardXCoordinate);
  };

  private get cardYCoordinate(): number {
    return Math.abs(this.cardXCoordinate) / this.maxXOffset * this.maxYOffset;
  };

  private get isImageDraggedToLeft(): boolean {
    if (!this.isDragging) {
      return null;
    }

    if (this.cardXCoordinate < 0) {
      return true;
    } else {
      return false;
    }
  }

  isDragging: boolean;

  //@ViewChild('playingCard') cardRef: ElementRef;

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

  private startNewGame() {
    this.pointsService.points = [50, 50, 50, 50];
    this.pointsService.turnsPassed = 0;
    this.decisions.completedCardResponses = [];
  }

  private clickLeft() {
    // alert("Click left");
    let isGameEnd = this.pointsService.addPoints(this.currentCard.onLeft);
    if (!isGameEnd) {
      this.decisions.madeDecisions(this.currentCard, true);
      this.currentCard = this.decisions.getNextCard();
    } else {
      this.displayDialog();
    }
  }

  private clickRight() {
    // alert("Click right");
    let isGameEnd = this.pointsService.addPoints(this.currentCard.onRight);
    if (!isGameEnd) {
      this.decisions.madeDecisions(this.currentCard, false);
      this.currentCard = this.decisions.getNextCard();
    } else {
      this.displayDialog();
    }
  }

  displayDialog() {
    $('#endGameModal').modal({
      keyboard: false,
      backdrop: 'static'
    });
  }

  dragImageStart() {
    this.isDragging = true;
  }

  dragImageEnd() {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;
    if (Math.abs(this.cardXCoordinate) < 25) {
      //return;
    }
    else {
      if (this.cardXCoordinate >= 0) {
        this.clickRight();
      } else {
        this.clickLeft();
      }
    }

    //this.cardXCoordinate = 0;
    let intervalId = setInterval(() => {
      this.cardXCoordinate -= this.cardXCoordinate / 20;
      if (Math.abs(this.cardXCoordinate) < 1) {
        this.cardXCoordinate = 0;
        clearInterval(intervalId);
      }
    }, 5);
  }

  dragImage(event: MouseEvent) {
    if (!this.isDragging) {
      return;
    }

    if (Math.abs(this.cardXCoordinate + event.movementX) > this.maxXOffset) {
      this.cardXCoordinate += (this.maxXOffset - Math.abs(this.cardXCoordinate)) * Math.sign(this.cardXCoordinate);
      return;
    }

    this.cardXCoordinate += event.movementX;
  }

}
