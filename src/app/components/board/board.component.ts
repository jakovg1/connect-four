import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { BOARD_HEIGHT, BOARD_WIDTH, WINNING_STREAK } from './board.constants';
import { BoardCell } from './board.model';

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

  public board: BoardCell[][] = [];

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

  public addTokenToColumn(column: number, tokenToAdd?: BoardCell) {
    if (!tokenToAdd) tokenToAdd = this.turnOfPlayer;
    if (column < 0 || column > BOARD_WIDTH - 1) return;
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      if (this.board[column][i] == BoardCell.Empty) {
        this.board[column][i] = tokenToAdd;
        this.checkForEndOfGame(column, i);
        break;
      }
    }

    this.toggleTurn();

    if (this.turnOfPlayer == BoardCell.Player1) return;
    //Computer's turn -> refactor this code later on
    const computersMove = 0;
    this.addTokenToColumn(computersMove, this.turnOfPlayer);
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
  }

  private checkForEndOfGame(columnIndex: number, rowIndex: number): void {
    const shouldSearchUp = BOARD_HEIGHT - rowIndex >= WINNING_STREAK;
    const shouldSearchDown = rowIndex >= WINNING_STREAK - 1;
    const shouldSearchLeft = columnIndex >= WINNING_STREAK - 1;
    const shouldSearchRight = BOARD_WIDTH - columnIndex >= WINNING_STREAK;

    try {
      if (shouldSearchDown) {
        // search down
        this.checkInDirection(columnIndex, rowIndex, -1, 0);
        if (shouldSearchLeft) {
          // search down left diagonal
          this.checkInDirection(columnIndex, rowIndex, -1, -1);
        }
        if (shouldSearchRight) {
          // search down right diagonal
          this.checkInDirection(columnIndex, rowIndex, -1, 1);
        }
      }

      if (shouldSearchUp) {
        // search up left diagonal
        if (shouldSearchLeft) {
          this.checkInDirection(columnIndex, rowIndex, 1, -1);
        }
        if (shouldSearchRight) {
          // search up right diagonal
          this.checkInDirection(columnIndex, rowIndex, 1, 1);
        }
      }

      // search left
      if (shouldSearchLeft) {
        this.checkInDirection(columnIndex, rowIndex, 0, -1);
      }

      // search right
      if (shouldSearchRight) {
        this.checkInDirection(columnIndex, rowIndex, 0, 1);
      }
    } catch (exception) {
      this.announceEndOfGame(this.turnOfPlayer);
    }
  }

  private checkInDirection(
    columnIndex: number,
    rowIndex: number,
    verticaIncrement: number,
    horizontalIncrement: number
  ) {
    for (let i = 1; i < WINNING_STREAK; i++) {
      if (
        this.turnOfPlayer !==
        this.board[columnIndex + horizontalIncrement * i][
          rowIndex + verticaIncrement * i
        ]
      ) {
        break;
      }
      if (i == WINNING_STREAK - 1) throw new Error('End of game :)');
    }
  }

  private announceEndOfGame(winner: BoardCell): void {
    // this.cdk.detectChanges();
    setTimeout(() => {
      alert('Player ' + winner + ' has won the game!');
      this.resetGame();
      this.endGame.emit();
    }, 10);
  }

  private toggleTurn(): void {
    if (this.turnOfPlayer == BoardCell.Player1) {
      this.turnOfPlayer = BoardCell.Player2;
      return;
    }
    this.turnOfPlayer = BoardCell.Player1;
  }
}
