import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { BOARD_HEIGHT, BOARD_WIDTH, WINNING_STREAK } from './board.constants';
import { BoardCell } from './board.model';
import { getRandomNumberInRange } from 'src/app/utility/utils';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Output() public endGame: EventEmitter<void> = new EventEmitter<void>();

  public boardWidth = BOARD_WIDTH;
  public boardHeight = BOARD_HEIGHT;

  public turnOfPlayer: BoardCell = BoardCell.Player1;

  public winnerAnimation: boolean = false;

  public board: BoardCell[][] = [];

  private suspendPlay: boolean = false;

  constructor(private cdk: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.resetGame();
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

  public getBoardPosition(index: number) {
    const xCoordinate = index % BOARD_WIDTH;
    const yCoordinate = BOARD_HEIGHT - 1 - Math.floor(index / BOARD_WIDTH);
    return this.board[xCoordinate][yCoordinate];
  }

  public player1AddToken(column: number): void {
    if (this.suspendPlay) return;
    this.addTokenToColumn(column, BoardCell.Player1);
  }

  public addTokenToColumn(column: number, tokenToAdd?: BoardCell): void {
    if (!tokenToAdd) tokenToAdd = this.turnOfPlayer;
    if (column < 0 || column > BOARD_WIDTH - 1) return;
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      if (this.board[column][i] == BoardCell.Empty) {
        this.board[column][i] = tokenToAdd;
        if (this.checkForEndOfGame(column, i)) return;
        break;
      }
    }

    this.toggleTurn();

    if (this.turnOfPlayer == BoardCell.Player1) return;

    //Computer's turn -> refactor this code later on
    this.suspendPlay = true;
    const computersMove = Math.floor(Math.random() * BOARD_WIDTH);
    setTimeout(() => {
      this.addTokenToColumn(computersMove, this.turnOfPlayer);
      this.suspendPlay = false;
    }, getRandomNumberInRange(200, 1200));
  }

  public getColumnHeight(column: number): number {
    if (column < 0 || column > BOARD_WIDTH - 1)
      throw new Error('Invalid column index!');
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      if (this.board[column][i] == BoardCell.Empty) return i;
    }
    return BOARD_HEIGHT;
  }

  public resetGame(): void {
    this.board = new Array(BOARD_WIDTH)
      .fill(BoardCell.Empty)
      .map(() => new Array(BOARD_HEIGHT).fill(BoardCell.Empty));

    this.turnOfPlayer = BoardCell.Player1;
    this.suspendPlay = false; // if player is not playing - refactor later on if needed
    this.winnerAnimation = false;
  }

  private checkForEndOfGame(columnIndex: number, rowIndex: number): boolean {
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
      this.announceEndOfGame();
      return true;
    }
    return false;
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

  private announceEndOfGame(): void {
    this.suspendPlay = true;
    this.winnerAnimation = true;

    setTimeout(() => {
      this.resetGame();
      this.endGame.emit();
    }, 1500); //pause for displaying winner
  }

  private checkIfNoMoreMovesAreAvailable(): boolean {
    for (let column = 0; column < BOARD_WIDTH; column++) {
      if (this.getColumnHeight(column) < BOARD_HEIGHT) return false;
    }
    return true;
  }

  private toggleTurn(): void {
    this.turnOfPlayer =
      this.turnOfPlayer === BoardCell.Player1
        ? BoardCell.Player2
        : BoardCell.Player1;
  }
}
