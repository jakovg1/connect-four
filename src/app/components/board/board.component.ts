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

  public gridTemplateCss = {
    'grid-template-columns': 'auto '.repeat(BOARD_WIDTH),
  };

  public board: BoardCell[][] = [];

  public ngOnInit(): void {
    this.board = new Array(BOARD_WIDTH)
      .fill(BoardCell.Empty)
      .map(() => new Array(BOARD_HEIGHT).fill(BoardCell.Empty));

    console.log(this.board);
    this.addTokenToColumn(BoardCell.Player1, 0);
    this.addTokenToColumn(BoardCell.Player2, 0);
    this.addTokenToColumn(BoardCell.Player2, 0);
    this.addTokenToColumn(BoardCell.Player2, 1);
    console.log(this.board);
  }

  public getCellStyle(index: number): any {
    debugger;
    // console.log(index);
    const boardCell = this.getBoardPosition(index);

    switch (boardCell) {
      case BoardCell.Player1:
        return { 'background-color': 'blue' };
      case BoardCell.Player2:
        return { 'background-color': 'red' };
      default:
        return {};
    }
  }

  public getBoardPosition(index: number) {
    const xCoordinate = index % BOARD_WIDTH;
    const yCoordinate = BOARD_HEIGHT - 1 - Math.floor(index / BOARD_WIDTH);

    // console.log('CALC FOR', index, ' -> ', xCoordinate, yCoordinate);
    return this.board[xCoordinate][yCoordinate];
  }

  public addTokenToColumn(tokenToAdd: BoardCell, column: number) {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      if (this.board[column][i] == BoardCell.Empty) {
        this.board[column][i] = tokenToAdd;
        break;
      }
    }
  }
}
