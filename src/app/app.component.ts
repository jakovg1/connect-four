import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { Difficulty, GameMode } from './components/board/board.constants';
import { GameSettingsService } from './game-settings.service';
import { ActiveMenu } from './app.constants';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(BoardComponent) private board!: BoardComponent;
  public DifficultyEnum = Difficulty;
  public GameModeEnum = GameMode;
  public ActiveMenuEnum = ActiveMenu;

  public activeMenu = ActiveMenu.MainMenu;

  public isAppStartup = true;
  public overlayAnimationSpeed = 500;
  public menusAreVisible: boolean = true;

  constructor(
    public gameSettingsService: GameSettingsService,
    public messageService: MessageService
  ) {
    this.activeMenu = ActiveMenu.MainMenu;
  }

  public newGame(): void {
    this.isAppStartup = false;
    this.menusAreVisible = false;
  }

  public displayGameMode(): string {
    return GameMode[this.gameSettingsService.gameMode];
  }
  public displayDifficulty(): string {
    return Difficulty[this.gameSettingsService.difficulty];
  }

  public resetHighscore(): void {
    this.gameSettingsService.resetHighScore();
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Highscore has been reset!',
    });
  }
}
