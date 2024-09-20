import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { Difficulty, GameMode } from './components/board/board.constants';
import { GameSettingsService } from './game-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(BoardComponent) private board!: BoardComponent;
  public DifficultyEnum = Difficulty;
  public GameModeEnum = GameMode;
  public isAppStartup = true;

  public overlayAnimationSpeed = 500;

  constructor(public gameSettingsService: GameSettingsService) {}

  public menuActive: boolean = true;

  public newGame(): void {
    this.isAppStartup = false;
    this.menuActive = false;
    this.board.resetGame();
  }

  public displayGameMode(): string {
    return GameMode[this.gameSettingsService.gameMode];
  }
  public displayDifficulty(): string {
    return Difficulty[this.gameSettingsService.difficulty];
  }
}
