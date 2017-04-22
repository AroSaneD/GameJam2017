
import { Injectable } from '@angular/core';
import { Card } from "app/model/Card";

export interface EndScenario {
    endText: string;
    endType: number;
}

const endScenarios: EndScenario[] = [
    {
        endText: "Your school went bancrupt, the local government decided to replace you for not looking after the school finances.",
        endType: 0
    },
    {
        endText: "School personel wrote a petition to replace you, which got accepted by the government.",
        endType: 1
    },
    {
        endText: "Chaos reigns supreme in your school, the parents of the students wrote a petition to replace you.",
        endType: 2
    },
    {
        endText: "One of the student suffered repeated bullying from others and court has concluded that you are not fit to be the school director.",
        endType: 3
    }
];


@Injectable()
export class PointsService {
    readonly maxValue = 100;

    public turnsPassed = 0;
    public points = [50, 50, 50, 50];

    constructor() {

    }

    public addPoints(points: number[]): EndScenario {
        let endScenario = null;
        points.forEach((point, index) => {
            this.points[index] += point;
            if (this.points[index] <= 0) {
                endScenario = endScenarios[index];
            }
            if (this.points[index] > 100) {
                this.points[index] = 100;
            }
        });
        console.log("points", this.points);
        this.turnsPassed++;
        return endScenario;
    }

    public calculateMinigamePoints(goodClicked: number, badClicked: number, badStudentsCount: number) {
        var total = badStudentsCount - badClicked;
        total += goodClicked;
        total *= 3;
        this.points[3] -= total;
        if(this.points[3] <= 0) {
            return endScenarios[3];
        }
        return null;
    }

}