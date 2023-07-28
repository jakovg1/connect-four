import { Component, OnInit } from '@angular/core';
import { BOARD_HEIGHT, BOARD_WIDTH } from './board.constants';
import { BoardCell } from './board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public boardWidth = BOARD_WIDTH;
  public boardHeight = BOARD_HEIGHT;

  public board: BoardCell[][] = [];

  public ngOnInit(): void {
    this.board = new Array(BOARD_WIDTH)
      .fill(BoardCell.Empty)
      .map(() => new Array(BOARD_HEIGHT).fill(BoardCell.Empty));
    this.board[1][4] = BoardCell.Player2;
    this.board[2][3] = BoardCell.Player1;
    this.board[0][2] = BoardCell.Player1;
    console.log(this.board);

    // debugger;
    // const argh = 2 % 7;
    // const argh = this.getBoardPosition(1);

    for (let i = 0; i < 42; i++) {
      debugger;
      console.log('CALC FOR', i, this.getBoardPosition(i));
    }
  }

  public getCellStyle(index: number): any {
    debugger;
    console.log(index);
    const boardCell = this.getBoardPosition(index);

    switch (boardCell) {
      case BoardCell.Player1:
        return { 'background-color': 'blue' };
      case BoardCell.Player2:
        return { 'background-color': 'red' };
      default:
        return { 'background-color': 'teal' };
    }
  }

  public getBoardPosition(index: number) {
    return this.board[BOARD_WIDTH - 1 - Math.floor(index / BOARD_WIDTH)][
      index % BOARD_HEIGHT
    ];
  }
}
