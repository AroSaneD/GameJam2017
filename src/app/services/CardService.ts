
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Card } from "app/model/Card";
import { Observable } from "rxjs/Rx";

@Injectable()
export class CardService {

    constructor(private http: Http) {

    }

    public getAllCards(): Observable<Array<Card>> {
        return this.http.get('/assets/decisions.json').map(res => res.json() as Array<Card>);
    }

}