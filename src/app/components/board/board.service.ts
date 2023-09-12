import { Injectable } from '@angular/core';
import { BOARD_WIDTH, BOARD_HEIGHT, WINNING_STREAK } from './board.constants';
import { Board, BoardCell } from './board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor() {}

  public addTokenToColumn(column: number, board: Board): BoardCell | undefined {
    if (column < 0 || column > BOARD_WIDTH - 1) return;
    const { boardArray, turnOfPlayer } = board;
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      if (boardArray[column][row] == BoardCell.Empty) {
        boardArray[column][row] = turnOfPlayer;
        const winner = this.checkForEndOfGame(column, row, board);
        if (!!winner) return winner;
        break;
      }
    }
    return;
  }

  public toggleTurn(turnOfPlayer: BoardCell): BoardCell {
    return turnOfPlayer === BoardCell.Player1
      ? BoardCell.Player2
      : BoardCell.Player1;
  }

  private checkForEndOfGame(
    columnIndex: number,
    rowIndex: number,
    board: Board
  ): BoardCell | undefined {
    try {
      const { boardArray } = board;
      //search up left direction
      this.searchInDirection(columnIndex, rowIndex, 1, -1, board);

      //search horizontal direction
      this.searchInDirection(columnIndex, rowIndex, 0, 1, board);

      //search up right direction
      this.searchInDirection(columnIndex, rowIndex, 1, 1, board);

      //search vertical direction
      this.searchInDirection(columnIndex, rowIndex, 1, 0, board);
    } catch (exception) {
      return board.turnOfPlayer;
    }
    return undefined;
  }

  private searchInDirection(
    columnIndex: number,
    rowIndex: number,
    verticaIncrement: number,
    horizontalIncrement: number,
    board: Board
  ): void {
    const streakInNegativeDirection = this.getStreakInDirection(
      columnIndex,
      rowIndex,
      verticaIncrement,
      horizontalIncrement,
      board
    );

    const streakInPositiveDirection = this.getStreakInDirection(
      columnIndex,
      rowIndex,
      -verticaIncrement,
      -horizontalIncrement,
      board
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
    horizontalIncrement: number,
    board: Board
  ): number {
    let streak = 0;
    const { boardArray, turnOfPlayer } = board;
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

      if (boardArray[searchColumn][searchRow] !== turnOfPlayer) break;
      streak += 1;
    }
    return streak;
  }

  private checkIfNoMoreMovesAreAvailable(board: Board): boolean {
    for (let column = 0; column < BOARD_WIDTH; column++) {
      if (board.getColumnHeight(column) < BOARD_HEIGHT) return false;
    }
    return true;
  }
}
