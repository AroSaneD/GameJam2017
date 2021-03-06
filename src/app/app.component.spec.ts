import { TestBed, async, inject } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { CardService } from './services/CardService';
import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [
        AppComponent
      ],
      providers: [CardService]
    }).compileComponents();

  }));

  // it('all cards should be at least playable', inject([CardService], (service: CardService) => {
  //   service.getAllCards().subscribe(cards => {
  //     //expect(cards.length).toBe(3);
  //     cards.forEach(card => {
  //       expect(card.question).toBeTruthy();
  //       expect(card.leftText).toBeTruthy();
  //       expect(card.rightText).toBeTruthy();
  //       expect(card.onLeft.length).toBe(4);
  //       expect(card.onRight.length).toBe(4);
  //       expect(card.requiredResponses).toBeTruthy();
  //       expect(card.id).toBeTruthy();
  //     });
  //   });
  // }));

  // it('should create the app', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));

  // it(`should have as title 'app works!'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));
});
