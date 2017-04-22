import { Component, ViewChild, ElementRef } from '@angular/core';
import { Card } from './model/Card';
import { DecisionTree } from './model/DecisionTree';
import { Http } from '@angular/http';

import 'rxjs';
import { CardService } from './services/CardService';
import { PointsService, EndScenario } from './services/PointsService';

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

  private readonly maxCancelRangePercentage: number = 0.19;

  private get maxCancelRange(): number {
    return this.maxXOffset * this.maxCancelRangePercentage;
  }

  endScenario: EndScenario = null;

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
    this.endScenario = null;
  }

  private clickLeft() {
    let endScenario = this.pointsService.addPoints(this.currentCard.onLeft);
    if (!endScenario) {
      console.log(endScenario);
      this.decisions.madeDecisions(this.currentCard, true);
      this.currentCard = this.decisions.getNextCard();
    } else {
      this.endScenario = endScenario;
      this.displayDialog();
    }
  }

  private clickRight() {
    let endScenario = this.pointsService.addPoints(this.currentCard.onRight);
    if (!endScenario != null) {
      this.decisions.madeDecisions(this.currentCard, false);
      this.currentCard = this.decisions.getNextCard();
    } else {
      this.endScenario = endScenario;
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
    if (Math.abs(this.cardXCoordinate) < this.maxCancelRange) {
    }
    else {
      if (this.cardXCoordinate >= 0) {
        this.clickRight();
      } else {
        this.clickLeft();
      }
    }

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

    this.dragImageBackEnd(event.movementX, event.movementY);
  }

  dragImageBackEnd(xOffset: number, yOffset: number) {
    if (Math.abs(this.cardXCoordinate + xOffset) > this.maxXOffset) {
      this.cardXCoordinate += (this.maxXOffset - Math.abs(this.cardXCoordinate)) * Math.sign(this.cardXCoordinate);
      return;
    }

    this.cardXCoordinate += xOffset;
  }

  private lastTouch: Touch;
  touchStart(): void {
    this.dragImageStart();
  }

  touchEnd(): void {
    this.lastTouch = null;
    this.dragImageEnd();
  }

  touchMove(event: TouchEvent): void {
    if (!this.isDragging) {
      return;
    }

    if (!this.lastTouch) {
      this.lastTouch = event.touches[0];
      return;
    }

    var xOffset = event.touches[0].pageX - this.lastTouch.pageX;
    var yOffset = event.touches[0].pageY - this.lastTouch.pageY;
    this.dragImageBackEnd(xOffset, yOffset);
  }

}
