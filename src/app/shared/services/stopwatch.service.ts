import { Injectable } from '@angular/core';
import { timer, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { displayedTime } from '../interfaces/displayed-time';


@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  private time$: Observable<number> = timer(0,1000);
  private startTime: number;
  private timerTimeInMS: number;
  public subscription: Subscription;
  private timeForDisplay: displayedTime = {
    h: "00",
    m: "00",
    s: "00"
  };
  public timerStream$: BehaviorSubject <displayedTime> = new BehaviorSubject<displayedTime>(this.timeForDisplay);

  constructor() { }

  startTimer(initialTime? : number){
    // check incoming start time. When it's undefined use current time
    // When  get smth, calculate start time.
    if (!initialTime){
      this.startTime = Date.now();
    }
    else{
      this.startTime = Date.now() - initialTime;
    }
    // start timer from rxjs for get new time for stopwatch
    this.subscription = this.time$.subscribe(()=>{
      this.timerTimeInMS = Date.now() - this.startTime;
      this.convertTime();
      this.timerStream$.next(this.timeForDisplay);
    });
    return this.timerStream$.asObservable();
  }
  
  // this method is used to prepare data for display in the "00":"00":"00" format
  convertTime():void{
    let sec = Math.round(this.timerTimeInMS / 1000);
    let s = sec % 60;
    let h = Math.floor(sec / 60 / 60);
    let m = (Math.floor(sec / 60)) - (h * 60);
    if (h >= 10){
      this.timeForDisplay.h = String(h);
    }
    else this.timeForDisplay.h = String(`0${h}`);
    if (m >= 10){
      this.timeForDisplay.m = String(m);
    } 
    else this.timeForDisplay.m = String(`0${m}`);
    if (s >= 10){
      this.timeForDisplay.s = String(s);
    }  
    else this.timeForDisplay.s = String(`0${s}`);
    console.log(this.timeForDisplay);

  }
  
  resetTimer(){
    this.subscription.unsubscribe();
    this.startTimer();
  }
}
