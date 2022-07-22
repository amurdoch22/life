import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  @Output() colour: EventEmitter<string> = new EventEmitter<string>();
  @Output() delay: EventEmitter<number> = new EventEmitter<number>();
  @Output() height: EventEmitter<number> = new EventEmitter<number>();
  @Output() width: EventEmitter<number> = new EventEmitter<number>();
  @Output() pause: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() reset: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}
