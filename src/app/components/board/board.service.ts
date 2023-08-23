import { Injectable } from '@angular/core';
import { BOARD_WIDTH, BOARD_HEIGHT, WINNING_STREAK } from './board.constants';
import { BoardCell } from './board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  public turnOfPlayer: BoardCell = BoardCell.Player1;

  public get board(): BoardCell[][] {
    return this._board;
  }

  private _board: BoardCell[][] = [];

  constructor() {}

  public getColumnHeight(column: number): number {
    if (column < 0 || column > BOARD_WIDTH - 1)
      throw new Error('Invalid column index!');
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      if (this.board[column][i] == BoardCell.Empty) return i;
    }
    return BOARD_HEIGHT;
  }

  public getCellStyle(columnIndex: number, rowIndex: number): any {
    const boardCell = this.board[columnIndex][rowIndex];
    switch (boardCell) {
      case BoardCell.Player1:
        return { 'background-color': 'rgb(62, 138, 201)' };
      case BoardCell.Player2:
        return { 'background-color': 'rgb(201, 97, 62)' };
      default:
        return {};
    }
  }

  public resetBoard(): void {
    this._board = new Array(BOARD_WIDTH)
      .fill(BoardCell.Empty)
      .map(() => new Array(BOARD_HEIGHT).fill(BoardCell.Empty));
  }

  public addTokenToColumn(column: number): BoardCell | undefined {
    if (column < 0 || column > BOARD_WIDTH - 1) return;
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      if (this.board[column][row] == BoardCell.Empty) {
        this.board[column][row] = this.turnOfPlayer;
        const winner = this.checkForEndOfGame(column, row);
        if (!!winner) return winner;
        break;
      }
    }
    return;
  }

  private checkForEndOfGame(
    columnIndex: number,
    rowIndex: number
  ): BoardCell | undefined {
    try {
      //search up left direction
      this.searchInDirection(columnIndex, rowIndex, 1, -1);

      //search horizontal direction
      this.searchInDirection(columnIndex, rowIndex, 0, 1);

      //search up right direction
      this.searchInDirection(columnIndex, rowIndex, 1, 1);

      //search vertical direction
      this.searchInDirection(columnIndex, rowIndex, 1, 0);
    } catch (exception) {
      return this.turnOfPlayer;
    }
    return undefined;
  }

  private searchInDirection(
    columnIndex: number,
    rowIndex: number,
    verticaIncrement: number,
    horizontalIncrement: number
  ): void {
    const streakInNegativeDirection = this.getStreakInDirection(
      columnIndex,
      rowIndex,
      verticaIncrement,
      horizontalIncrement
    );

    const streakInPositiveDirection = this.getStreakInDirection(
      columnIndex,
      rowIndex,
      -verticaIncrement,
      -horizontalIncrement
    );

    if (
      streakInPositiveDirection + streakInNegativeDirection >=
      WINNING_STREAK - 1
    )
      throw new Error('Game over :)');
  }

  private getStreakInDirection(
    columnIndex: number,
    rowIndex: number,
    verticaIncrement: number,
    horizontalIncrement: number
  ): number {
    let streak = 0;
    for (let i = 1; ; i++) {
      const searchColumn = columnIndex + horizontalIncrement * i;
      const searchRow = rowIndex + verticaIncrement * i;
      if (
        searchColumn >= BOARD_WIDTH ||
        searchColumn < 0 ||
        searchRow >= BOARD_HEIGHT ||
        searchRow < 0
      )
        break;
      if (this.board[searchColumn][searchRow] !== this.turnOfPlayer) break;
      streak += 1;
    }
    return streak;
  }

  private checkIfNoMoreMovesAreAvailable(): boolean {
    for (let column = 0; column < BOARD_WIDTH; column++) {
      if (this.getColumnHeight(column) < BOARD_HEIGHT) return false;
    }
    return true;
  }
}
