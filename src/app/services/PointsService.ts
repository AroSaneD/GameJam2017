
import { Injectable } from '@angular/core';
import { Card } from "app/model/Card";

@Injectable()
export class PointsService {
    readonly maxValue = 100;

    public turnsPassed = 0;
    public points = [50, 50, 50, 50];

    constructor() {

    }

    public addPoints(points: number[]): boolean {
        let gameEnded = false;
        points.forEach((point, index) => {
            this.points[index] += point;
            if (this.points[index] <= 0 || this.points[index] >= 100) {
                gameEnded = true;
            }
        });
        this.turnsPassed++;
        return gameEnded;
    }

}