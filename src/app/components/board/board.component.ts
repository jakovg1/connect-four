import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  GameMode,
  PAUSE_AT_END_OF_GAME,
} from './board.constants';
import { Board, BoardCell } from './board.model';
import { AiAdversaryService } from 'src/app/ai-adversary/ai-adversary.service';
import { BoardService } from './board.service';
import { GameSettingsService } from 'src/app/game-settings.service';

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
    private aiAdversary: AiAdversaryService,
    public gameSettingsService: GameSettingsService
  ) {
    // console.log('BOARD INSTANTIATED!!!');
    this.board = new Board();
  }

  public ngOnInit(): void {
    this.resetGame();
  }

  public addToken(column: number): void {
    if (this.suspendPlay || !this.board.isValidMove(column)) return;
    const winner = this.boardService.addTokenToColumn(column, this.board);
    if (!!winner) {
      this.announceEndOfGame();
      return;
    }
    this.togglePlayer();

    if (this.gameSettingsService.gameMode == GameMode.PlayerVsComputer) {
      this.suspendPlay = true;
      setTimeout(() => {
        const computersMove = this.aiAdversary.getNextMove(this.board);
        const winner = this.boardService.addTokenToColumn(
          computersMove,
          this.board
        );
        if (!!winner) {
          this.announceEndOfGame();
          return;
        }
        this.suspendPlay = false;
        this.togglePlayer();
      });
    }
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
    }, PAUSE_AT_END_OF_GAME); //pause for displaying winner
  }

  private togglePlayer(): void {
    this.board.turnOfPlayer =
      this.board.turnOfPlayer == BoardCell.Player1
        ? BoardCell.Player2
        : BoardCell.Player1;
  }
}
