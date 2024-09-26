import { BOARD_WIDTH, BOARD_HEIGHT } from './board.constants';

export enum BoardCell {
  Empty,
  Player1,
  Player2,
}

export class Board {
  public turnOfPlayer: BoardCell = BoardCell.Player1;

  public boardArray: BoardCell[][] = [];

  constructor() {
    this.resetBoard();
  }

  public cloneBoard(): Board {
    const boardArrayCopy = this.boardArray.map((column) => {
      return { ...column };
    });
    const clonedBoard = new Board();
    clonedBoard.boardArray = boardArrayCopy;
    clonedBoard.turnOfPlayer = this.turnOfPlayer;
    return clonedBoard;
  }

  public toggleTurnOfPlayer(): void {
    this.turnOfPlayer =
      this.turnOfPlayer === BoardCell.Player1
        ? BoardCell.Player2
        : BoardCell.Player1;
  }

  public getColumnHeight(column: number): number {
    if (column < 0 || column > BOARD_WIDTH - 1)
      throw new Error('Invalid column index!');
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      if (this.boardArray[column][i] == BoardCell.Empty) return i;
    }
    return BOARD_HEIGHT;
  }

  public getCellStyle(columnIndex: number, rowIndex: number): any {
    const boardCell = this.boardArray[columnIndex][rowIndex];
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
    this.boardArray = new Array(BOARD_WIDTH)
      .fill(BoardCell.Empty)
      .map(() => new Array(BOARD_HEIGHT).fill(BoardCell.Empty));
  }

  public isValidMove(column: number): boolean {
    return this.getColumnHeight(column) < BOARD_HEIGHT;
  }
}
