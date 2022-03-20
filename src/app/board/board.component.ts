import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

  private boardSurface: number[][] = [];

  private height = 0;
  private width = 0;

  private context?: CanvasRenderingContext2D;

  // VARIABLE: We store the DPI to adjust the Canvas, so it doesn't look blurry
  private readonly dpi;

  constructor() {
    this.dpi = window.devicePixelRatio;
  }

  ngAfterViewInit(): void {
    if (this.canvas.nativeElement) {
      // @ts-ignore
      this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

      this.clearBoard();
      this.drawBoard();
      this.updateBoard();

      setTimeout(() => {
        setInterval(() => {
          this.clearBoard();
          this.reduceBoard();
          this.updateBoard();
        }, 125)
      }, 10000);
    }
  }

  clearBoard() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const context = canvas.getContext('2d');

    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      console.log('WHY?')
    }
  }

  ngOnInit(): void {
  }

  fixDPI() {
    let style_height = +getComputedStyle(this.canvas.nativeElement)
      .getPropertyValue("height")
      .slice(0, -2);

    let style_width = +getComputedStyle(this.canvas.nativeElement)
      .getPropertyValue("width")
      .slice(0, -2);

    this.canvas.nativeElement.setAttribute('height', (style_height * this.dpi).toString());
    this.canvas.nativeElement.setAttribute('width', (style_width * this.dpi).toString());
  }

  drawBoard() {
    this.fixDPI();

    const canvasHeight = this.canvas.nativeElement.height; // 3
    const canvasWidth = this.canvas.nativeElement.width; // 1.5

    let scale;
    if (canvasWidth > canvasHeight) {
      scale = canvasWidth / canvasHeight;
    } else {
      scale = canvasHeight / canvasWidth;
    }

    this.height = canvasHeight / 50;
    this.width = canvasWidth / (scale * 50);

    this.clearBoard();

    // NOTE: This will give us 10 rows with 40 items in each or [10][40]
    for (let y = 0; y < canvasWidth / this.width; y++) {
      const row: number[] = [];
      for (let x = 0; x < canvasHeight / this.height; x++){
        // Math.floor(Math.random() * 2)
        row.push(0)
      }
      this.boardSurface.push(row);
    }

    const liveCompute = Math.floor(Math.random() * 750);

    _.times(liveCompute, () => {
      const rows = this.boardSurface.length;
      const column = this.boardSurface[0].length;
      this.boardSurface[Math.floor(Math.random() * rows)][Math.floor(Math.random() * column)] = 1;
    })
  }

  checkColumn(row: number = 0, column: number = 0, skipCurrentCheck: boolean = false) {
    let aliveCount = 0;
    let columnLookup = column;
    if (column === 0) {
      // NOTE: Left Check
      if (this.boardSurface[row][this.boardSurface[row].length - 1]) {
        aliveCount++;
      }

      // NOTE: Right Check
      if (this.boardSurface[row][columnLookup + 1]) {
        aliveCount++;
      }

      // NOTE: Direct Check
      if (this.boardSurface[row][columnLookup]  && !skipCurrentCheck) {
        aliveCount++;
      }
    } else if (columnLookup === this.boardSurface[row].length - 1) {
      // NOTE: Right Check
      if (this.boardSurface[row][0]) {
        aliveCount++;
      }

      // NOTE: Left Check
      if (this.boardSurface[row][columnLookup - 1]) {
        aliveCount++;
      }

      // NOTE: Direct Check
      if (this.boardSurface[row][columnLookup] && !skipCurrentCheck) {
        aliveCount++;
      }
    } else {
      // NOTE: Right Check
      if (this.boardSurface[row][columnLookup + 1]) {
        aliveCount++;
      }

      // NOTE: Left Check
      if (this.boardSurface[row][columnLookup - 1]) {
        aliveCount++;
      }

      // NOTE: Direct Check
      if (this.boardSurface[row][columnLookup] && !skipCurrentCheck) {
        aliveCount++;
      }
    }

    return aliveCount;
  }

  checkCurrentRow(row: number = 0, column: number = 0) {
    return this.checkColumn(row, column, true);
  }

  checkLowerRow(row: number = 0, column: number = 0) {
    let rowLookup = row;
    if (rowLookup === this.boardSurface.length - 1) {
      rowLookup = 0;
    } else {
      rowLookup++;
    }

    return this.checkColumn(rowLookup, column, false);
  }

  checkUpperRow(row: number = 0, column: number = 0) {
    let rowLookup = row;
    if (rowLookup === 0) {
      rowLookup = this.boardSurface.length - 1;
    } else {
      rowLookup--;
    }

    return this.checkColumn(rowLookup, column, false);
  }

  reduceBoard() {
    // NOTE: Reduce the board
    let aliveCount = 0;
    for (let row = 0; row < this.boardSurface.length; row++) {
      for (let column = 0; column < this.boardSurface[row].length; column++) {
        // NOTE: Current Cell
        const currentCell = this.boardSurface[row][column];

        // NOTE: Check the current row
        aliveCount += this.checkCurrentRow(row, column);

        // NOTE: Check the top row
        aliveCount += this.checkUpperRow(row, column);

        // NOTE: Check the lower row
        aliveCount += this.checkLowerRow(row, column);

        // NOTE:
        //  Any live cell with fewer than two live neighbors dies as if caused by under-population.
        //  Any live cell with two or three live neighbors lives on to the next generation.
        //  Any live cell with more than three live neighbors dies, as if by over-population.
        //  Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

        if (aliveCount < 2 && currentCell) {
          this.boardSurface[row][column] = 0;
        } else if ((aliveCount === 2 || aliveCount === 3) && currentCell ) {
          this.boardSurface[row][column] = 1;
        } else if (aliveCount > 3 && currentCell) {
          this.boardSurface[row][column] = 0;
        } else if (aliveCount === 3 && currentCell === 0) {
          this.boardSurface[row][column] = 1;
        }

        // NOTE: Reset ALive Count
        aliveCount = 0;
      }
    }
  }

  updateBoard() {
    // NOTE: Draw the board
    for (let row = 0; row < this.boardSurface.length; row++) {
      if (this.boardSurface[row]) {
        for (let column = 0; column < this.boardSurface[row].length; column++) {
          const state = this.boardSurface[row][column];
          this.drawSquare(row * this.width, column * this.height, state, this.width, this.height)
        }
      }
    }
  }

  drawSquare(x: number = 0, y: number = 0, state: number = 0, w: number = 10, h: number = 10) {
    if (this.canvas?.nativeElement) {
      if (this.context) {
        if (state === 1) {
          this.context.strokeStyle = 'lightblue';
          this.context.fillStyle = 'green';

          // NOTE:  Draw the outline of a square
          this.context.strokeRect(x, y, w, h);

          // NOTE: Draw a square using the fillRect() method and fill it
          // NOTE: with the colour specified by the fillStyle attribute
          this.context.fillRect(x, y, w, h);

          this.context.stroke();
        } else {
          this.context.strokeStyle = 'lightgrey';
          this.context.strokeRect(x, y, w, h);
          this.context.stroke();
        }
      }
    }
  }
}
