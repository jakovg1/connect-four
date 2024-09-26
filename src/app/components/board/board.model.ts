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

  //used for CSS classes
  public isCellBlue(columnIndex: number, rowIndex: number): boolean {
    return this.isCellPlayer(columnIndex, rowIndex, BoardCell.Player1);
  }

  public isCellRed(columnIndex: number, rowIndex: number): boolean {
    return this.isCellPlayer(columnIndex, rowIndex, BoardCell.Player2);
  }

  public resetBoard(): void {
    this.boardArray = new Array(BOARD_WIDTH)
      .fill(BoardCell.Empty)
      .map(() => new Array(BOARD_HEIGHT).fill(BoardCell.Empty));
  }

  public isValidMove(column: number): boolean {
    return this.getColumnHeight(column) < BOARD_HEIGHT;
  }

  /**
   * Return true if cell indexed by columnIndex and rowIndex is occupied by board cell defined by player,
   * else return false
   * @param columnIndex
   * @param rowIndex
   */
  private isCellPlayer(
    columnIndex: number,
    rowIndex: number,
    player: BoardCell
  ): boolean {
    const boardCell = this.boardArray[columnIndex][rowIndex];
    switch (boardCell) {
      case BoardCell.Player1:
        return BoardCell.Player1 === player;
      case BoardCell.Player2:
        return BoardCell.Player2 === player;
      default:
        return false;
    }
  }
}
