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

  public board: BoardCell[][] = [];

  private suspendPlay: boolean = false;

  constructor(
    public boardService: BoardService,
    private aiAdversary: AiAdversaryService
  ) {}

  public ngOnInit(): void {
    this.resetGame();
  }

  public player1AddToken(column: number): void {
    if (this.suspendPlay) return;
    this.addTokenToColumn(column, BoardCell.Player1);
  }

  public addTokenToColumn(column: number, tokenToAdd?: BoardCell): void {
    const winner = this.boardService.addTokenToColumn(column);
    if (!!winner) {
      this.announceEndOfGame();
      return;
    }

    this.toggleTurn();

    if (this.boardService.turnOfPlayer == BoardCell.Player1) return;

    //Computer's turn -> refactor this code later on
    this.suspendPlay = true;
    const computersMove = this.aiAdversary.getNextMove(this.board);

    setTimeout(() => {
      this.addTokenToColumn(computersMove, this.boardService.turnOfPlayer);
      this.suspendPlay = false;
    }, getRandomNumberInRange(200, 1200)); // random pause to simulate "thinking" time
  }

  public resetGame(): void {
    this.boardService.resetBoard();

    this.boardService.turnOfPlayer = BoardCell.Player1;
    this.suspendPlay = false; // if player is not playing - refactor later on if needed
    this.winnerAnimation = false;
  }

  private announceEndOfGame(): void {
    this.suspendPlay = true;
    this.winnerAnimation = true;

    setTimeout(() => {
      this.resetGame();
      this.endGame.emit();
    }, 1500); //pause for displaying winner
  }

  private toggleTurn(): void {
    this.boardService.turnOfPlayer =
      this.boardService.turnOfPlayer === BoardCell.Player1
        ? BoardCell.Player2
        : BoardCell.Player1;
  }
}
