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

  private readonly maxCancelRangePercentage: number = 0.25;

  private readonly turnDurationInMilliseconds: number = 5000;
  private readonly miniGameDurationInMilliseconds: number = 2000;

  private get maxCancelRange(): number {
    return this.maxXOffset * this.maxCancelRangePercentage;
  }

  endScenario: EndScenario = null;

  currentCard: Card;
  decisions: DecisionTree;

  cardXCoordinate: number = 0;
  miniGameData: Array<Array<{ isBadStudent: boolean, isClicked: boolean }>> = null;

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

  timerIntervalId: any;
  currentTurnDuration: number;
  private get currentTurnDurationPercentage(): number {
    return this.currentTurnDuration / this.turnDurationInMilliseconds * 100;
  }

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
    this.startTimer();
  }

  private startTimer() {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }

    this.currentTurnDuration = 0;
    this.timerIntervalId = setInterval(() => {
      this.currentTurnDuration += 10;

      if (this.currentTurnDuration > this.turnDurationInMilliseconds) {
        clearInterval(this.timerIntervalId);
        this.clickIgnore();
      }
    }, 10);
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

  miniGameExecuted = false;
  private playerResponded(isGameEnd: EndScenario) {
    var random = Math.random();

    if (this.miniGameExecuted) {
      this.pointsService.calculateMinigamePoints(this.goodClicked, this.badClicked, this.badStudentsCount);
    }

    if (!isGameEnd && random > 0.7 && !this.miniGameExecuted) {
      this.miniGameExecuted = true;
      this.createMiniGameData();
      $('#miniGameModal').modal({
        keyboard: false,
        backdrop: 'static'
      });
      clearInterval(this.timerIntervalId);
      this.startMiniGameTimer();
    } else {
      this.miniGameExecuted = false;
      if (isGameEnd) {
        this.endScenario = isGameEnd;
        this.displayDialog();
        return;
      }

      this.currentCard = this.decisions.getNextCard();
      this.startTimer();
    }
  }

  displayDialog() {
    $('#endGameModal').modal({
      keyboard: false,
      backdrop: 'static'
    });
  }

  touchStart(): void {
    this.dragImageStart();
  }

  touchEnd(): void {
    this.dragImageEnd();
  }

  touchMove(event: TouchEvent): void {
    if (!this.isDragging) {
      return;
    }

    this.dragImageBackEnd(event.touches[0].pageX);
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

    this.dragImageBackEnd(event.pageX);
  }

  dragImageBackEnd(screenXPosition: number) {
    let xOffset = screenXPosition - (window.innerWidth / 2);
    if (Math.abs(xOffset) > this.maxXOffset) {
      this.cardXCoordinate = xOffset + ((this.maxXOffset - Math.abs(xOffset)) * Math.sign(xOffset));
      return;
    }

    this.cardXCoordinate = xOffset;
  }

  private get currentMiniGamePercentage(): number {
    return this.miniGameTimer / this.miniGameDurationInMilliseconds * 100;
  }

  intervalRunning = false;
  miniGameTimer: number = 0;
  startMiniGameTimer() {
    this.goodClicked = 0;
    this.badClicked = 0;
    this.intervalRunning = true;
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }

    this.miniGameTimer = 0;
    this.timerIntervalId = setInterval(() => {
      this.miniGameTimer += 10;

      if (this.miniGameTimer > this.miniGameDurationInMilliseconds) {
        clearInterval(this.timerIntervalId);
        this.intervalRunning = false;
      }
    }, 10);
  }

  goodClicked = 0;
  badClicked = 0;
  clickedOnMiniGameImage(kid: { isBadStudent: boolean, isClicked: boolean }) {
    kid.isClicked = true;
    if (kid.isBadStudent) {
      this.badClicked++;
    } else {
      this.goodClicked++;
    }
  }

  badStudentsCount: number = 0;
  createMiniGameData() {
    this.badStudentsCount = 0;
    this.miniGameData = [];
    for (let i = 0; i < 5; i++) {
      this.miniGameData.push([]);
      for (let j = 0; j < 5; j++) {
        let random = Math.random();
        if (random < 0.2) {
          this.badStudentsCount++;
          this.miniGameData[i].push({
            isBadStudent: true,
            isClicked: false
          });
        } else {
          this.miniGameData[i].push({
            isBadStudent: false,
            isClicked: false
          });
        }
      }
    }
  }

}
