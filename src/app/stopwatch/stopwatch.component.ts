import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { StopwatchService} from './../shared/services/stopwatch.service'
import { displayedTime} from './../shared/interfaces/displayed-time'

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit, OnDestroy {
  
  public startButton: string = 'Start';
  public isStarted: boolean = false;
  public isWait: boolean = false;
  private lastClick: number;
  private subscription: Subscription;
  public timeForDisplay: displayedTime = {
    h: '00',
    m: '00',
    s: '00'
  };
  
  private timer$: Observable<displayedTime>;
  
  constructor(private stopwatchServise: StopwatchService) { }
  
  runStopwatch(): void{
    // check status of stopwatch
    if (!this.isStarted){
      // check status of wait function. When "Wait" not activek, start stopwatch from "00":"00":"00"
      if (!this.isWait){
        this.timer$ = this.stopwatchServise.startTimer();
      }
      // when "Wait" is active, start stopwatch form current time
      else if (this.isWait){
        let currentTime = (+this.timeForDisplay.h*3600 + +this.timeForDisplay.m*60 + +this.timeForDisplay.s)*1000;
        this.timer$ = this.stopwatchServise.startTimer(currentTime);
      }
      // add subsribe for get data for display and change name of "start" button to "stop"
      this.subscription = this.stopwatchServise.timerStream$.subscribe( time => {
           this.timeForDisplay = time;
      });
      this.startButton = 'Stop';
    }
    // if status of stopwatch is "run", unsubscribe and change name of "stop" button to "start"
    else{
      this.stopwatchServise.subscription.unsubscribe();
      this.subscription.unsubscribe();
      for (let item in this.timeForDisplay){
        this.timeForDisplay[item] = "00";
      }
      this.startButton = 'Start';
      
    }
    this.isStarted = !this.isStarted;
  }

  pauseStopwatch(event): void {
    // check previos click to "Wait" button
    // If it was, calculate the time difference
    if(this.lastClick){
      let diff = event.timeStamp - this.lastClick;
      // if diff < 300 unsubcribe
      if (diff <= 300){
        console.log("doble click");
        this.subscription.unsubscribe();
        this.stopwatchServise.subscription.unsubscribe();
        this.isStarted = false;
        this.isWait = true;
        this.startButton = 'Start';
      }
    }
    // add info about last click
    this.lastClick = event.timeStamp;
  }

  resetStopwatch():void {
    this.stopwatchServise.resetTimer();
  }
  

  ngOnInit(): void {
  }
  
  ngOnDestroy():void {
    this.stopwatchServise.subscription.unsubscribe();
    this.subscription.unsubscribe();
  }


}
