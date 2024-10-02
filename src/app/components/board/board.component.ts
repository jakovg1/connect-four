import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
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

  public BoardCell = BoardCell;

  constructor(
    public boardService: BoardService,
    private aiAdversary: AiAdversaryService,
    public gameSettingsService: GameSettingsService
  ) {
    // console.log('BOARD INSTANTIATED!!!');
    this.board = new Board();
  }

  public ngOnInit(): void {
    console.log('BOARD!');
    this.resetGame();
  }

  public playerAddToken(column: number): void {
    if (this.suspendPlay || !this.board.isValidMove(column)) return;
    const isEndOfGame = this.executeMove(column);
    if (isEndOfGame) return;
    this.board.toggleTurnOfPlayer();

    if (this.gameSettingsService.gameMode == GameMode.PlayerVsComputer) {
      this.computerAddToken();
    }
  }

  public computerAddToken(): void {
    this.suspendPlay = true;
    const computersMove: number = this.aiAdversary.getNextMove(this.board);
    const isEndOfGame = this.executeMove(computersMove);
    if (isEndOfGame) return;
    this.suspendPlay = false;
    this.board.toggleTurnOfPlayer();
  }

  /**
   * Executes the move defined by parameter move. If game has ended in a win or draw, return true,
   * else return false
   * @param move
   * @returns
   */
  public executeMove(move: number): boolean {
    const winner: BoardCell | undefined = this.boardService.addTokenToColumn(
      move,
      this.board
    );
    if (winner !== undefined) {
      this.announceEndOfGame(winner);
      return true;
    }
    return false;
  }

  //control adding tokens with number keys 1-7
  @HostListener('window:keydown', ['$event'])
  public handleNumberKeysDown(event: KeyboardEvent): void {
    try {
      const columnToPlay = Number(event.key) - 1;
      if (columnToPlay >= 0 && columnToPlay <= 6) {
        this.playerAddToken(columnToPlay);
      }
    } catch {}
  }

  public resetGame(): void {
    this.board.resetBoard();

    this.board.turnOfPlayer = BoardCell.Player1;
    this.suspendPlay = false;
    this.winnerAnimation = false;
  }

  public exitToMainMenu(): void {
    this.resetGame();
    this.suspendPlay = true;
    this.endGame.emit();
  }

  private announceEndOfGame(winner: BoardCell): void {
    if (winner === BoardCell.Empty) {
      this.board.turnOfPlayer = BoardCell.Empty;
    }
    this.suspendPlay = true;
    this.winnerAnimation = true;

    setTimeout(() => {
      if (winner !== BoardCell.Empty) {
        this.gameSettingsService.updateHighscore(winner);
      }
      this.exitToMainMenu();
    }, PAUSE_AT_END_OF_GAME); //pause for displaying winner
  }
}
