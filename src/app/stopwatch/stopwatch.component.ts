import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit {
  
  public startButton: string = 'Start';
  public isStarted: boolean = false;
  public timeForDisplay = {
    h: '00',
    m: '00',
    s: '00'
  };
  
  startStopwatch(): void{
    if (this.isStarted){
      this.startButton = 'Start';
    }
    else{
      this.startButton = 'Stop';
    }
    this.isStarted = !this.isStarted;
  }
  constructor() { }


  ngOnInit(): void {
  }


}
