import { Injectable } from '@angular/core';
import { Difficulty, GameMode } from './components/board/board.constants';
import { AiAdversaryService } from './ai-adversary/ai-adversary.service';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsService {
  private _difficulty = Difficulty.Medium;
  private _gameMode = GameMode.PlayerVsComputer;

  constructor(private aiAdversaryService: AiAdversaryService) {
    this.difficulty = Difficulty.Medium;
  }

  public set difficulty(difficulty: Difficulty) {
    this._difficulty = difficulty;
    this.aiAdversaryService.difficulty = difficulty;
  }

  public get difficulty(): Difficulty {
    return this._difficulty;
  }

  public set gameMode(gameMode: GameMode) {
    this._gameMode = gameMode;
  }

  public get gameMode(): GameMode {
    return this._gameMode;
  }

  public toggleDifficulty() {
    this.difficulty = (this._difficulty + 1) % 3;
    // console.log(this.aiAdversaryService.difficulty);
  }

  public toggleGameMode(): void {
    this.gameMode = (this._gameMode + 1) % 2;
  }
}
