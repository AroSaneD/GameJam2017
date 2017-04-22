import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class AppComponent implements AfterViewInit {
  private readonly maxXOffset: number = 130;
  private readonly maxRotation: number = 5;
  private readonly maxYOffset: number = 40;

  private readonly maxCancelRangePercentage: number = 0.19;

  private readonly turnDurationInMilliseconds: number = 10000;

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
    if (!this.isDragging || Math.abs(this.cardXCoordinate) < this.maxCancelRange) {
      return null;
    }

    if (this.cardXCoordinate < 0) {
      return true;
    } else {
      return false;
    }
  }

  isDragging: boolean;

  currentTurnDuration: number;

  constructor(private cardService: CardService, private pointsService: PointsService) {
    console.log("starting");
    cardService.getAllCards().subscribe(cards => {
      this.decisions = new DecisionTree(cards);
      console.log(cards);
      this.setup(cards);
    });

  }

  ngAfterViewInit() {
    $('.game-wrapper').css('height', (window.innerHeight - 56) + 'px');
  }

  private setup(cards: Array<Card>) {
    this.currentCard = this.decisions.getNextCard();
    this.startNewGame();
  }

  private startNewGame() {
    this.pointsService.points = [50, 50, 50, 50];
    this.pointsService.turnsPassed = 0;
    this.decisions.completedCardResponses = [];
    this.endScenario = null;

    // let intervalId = setInterval(() => {
    //   this.currentTurnDuration += 10;
    //   if ()
    // }, 10);
  }

  private clickLeft() {
    let endScenario = this.pointsService.addPoints(this.currentCard.onLeft);
    this.decisions.madeDecisions(this.currentCard, true);
    this.playerResponded(endScenario);
  }

  private clickRight() {
    let endScenario = this.pointsService.addPoints(this.currentCard.onRight);
    this.decisions.madeDecisions(this.currentCard, false);
    this.playerResponded(endScenario);
  }

  private clickIgnore() {
    let endScenario = this.pointsService.addPoints(this.currentCard.onIgnore);
    this.decisions.madeDecisions(this.currentCard, null);
    this.playerResponded(endScenario);
  }

  private playerResponded(isGameEnd: EndScenario) {
    if (isGameEnd) {
      this.endScenario = isGameEnd;
      this.displayDialog();
      return;
    }

    this.currentCard = this.decisions.getNextCard();
  }

  displayDialog() {
    $('#endGameModal').modal({
      keyboard: false,
      backdrop: 'static'
    });
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

    let smoothnessMultiplier = 0.2;
    var xOffset = (event.touches[0].clientX - this.lastTouch.clientX) * smoothnessMultiplier;
    var yOffset = (event.touches[0].clientY - this.lastTouch.clientY) * smoothnessMultiplier;
    this.dragImageBackEnd(xOffset, yOffset);
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

}
