import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public colour: string = '';
  public pause: boolean = false;
  public reset: boolean = false;

  public height: number = 0;
  public width: number = 0;

  title = 'life';

  constructor() {
  }

  ngOnInit() {
  }
}
