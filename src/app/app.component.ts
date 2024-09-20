import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { Difficulty, GameMode } from './components/board/board.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(BoardComponent) private board!: BoardComponent;

  public difficulty = Difficulty.Medium;
  public gameMode = GameMode.PlayerVsComputer;

  public DifficultyEnum = Difficulty;
  public GameModeEnum = GameMode;

  public isAppStartup = true;

  public overlayAnimationSpeed = 500;

  constructor() {}

  public menuActive: boolean = true;

  public newGame(): void {
    this.isAppStartup = false;
    this.menuActive = false;
    this.board.resetGame();
  }

  public toggleDifficulty(): void {
    this.difficulty = (this.difficulty + 1) % 3;
  }

  public toggleGameMode(): void {
    this.gameMode = (this.gameMode + 1) % 2;
  }
}
