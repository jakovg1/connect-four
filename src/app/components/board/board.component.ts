import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { BOARD_HEIGHT, BOARD_WIDTH, WINNING_STREAK } from './board.constants';
import { Board, BoardCell } from './board.model';
import { getRandomNumberInRange } from 'src/app/utility/utils';
import { AiAdversaryService } from 'src/app/ai-adversary/ai-adversary.service';
import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Output() public endGame: EventEmitter<void> = new EventEmitter<void>();

  public boardWidth = BOARD_WIDTH;
  public boardHeight = BOARD_HEIGHT;

  public winnerAnimation: boolean = false;

  public board: Board;

  private suspendPlay: boolean = false;

  constructor(
    public boardService: BoardService,
    private aiAdversary: AiAdversaryService
  ) {
    this.board = new Board();
  }

  public ngOnInit(): void {
    this.resetGame();
  }

  public player1AddToken(column: number): void {
    if (this.suspendPlay) return;
    this.addTokenToColumn(column, BoardCell.Player1);
  }

  public addTokenToColumn(column: number, tokenToAdd?: BoardCell): void {
    if (!this.board.isValidMove(column)) return;
    const winner = this.boardService.addTokenToColumn(column, this.board);
    if (!!winner) {
      this.announceEndOfGame();
      return;
    }

    this.board.turnOfPlayer =
      this.board.turnOfPlayer == BoardCell.Player1 ? BoardCell.Player2 : BoardCell.Player1;

    if (this.board.turnOfPlayer == BoardCell.Player1) return;

    //Computer's turn -> refactor this code later on
    this.suspendPlay = true;
    const computersMove = this.aiAdversary.getNextMove(this.board);

    setTimeout(() => {
      this.addTokenToColumn(computersMove, this.board.turnOfPlayer);
      this.suspendPlay = false;
    }, getRandomNumberInRange(100, 200)); // random pause to simulate "thinking" time
  }

  public resetGame(): void {
    this.board.resetBoard();

    this.board.turnOfPlayer = BoardCell.Player1;
    this.suspendPlay = false; // if player is not playing - refactor later on if needed
    this.winnerAnimation = false;
  }

  private announceEndOfGame(): void {
    this.suspendPlay = true;
    this.winnerAnimation = true;

    setTimeout(() => {
      this.resetGame();
      this.endGame.emit();
    }, 2500); //pause for displaying winner
  }
}
