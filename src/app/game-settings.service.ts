import { Injectable } from '@angular/core';
import {
  BLUE_PLAYER_WINS,
  Difficulty,
  GameMode,
  RED_PLAYER_WINS,
} from './components/board/board.constants';
import { AiAdversaryService } from './ai-adversary/ai-adversary.service';
import { BoardCell } from './components/board/board.model';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsService {
  private _difficulty = Difficulty.Medium;
  private _gameMode = GameMode.PlayerVsComputer;

  constructor(private aiAdversaryService: AiAdversaryService) {
    this.difficulty = Difficulty.Medium;
    this.resetHighScore();
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

  //highscore
  public resetHighScore(): void {
    localStorage[BLUE_PLAYER_WINS] = '0';
    localStorage[RED_PLAYER_WINS] = '0';
  }

  public getRedPlayerWins(): Number {
    return Number(localStorage.getItem(RED_PLAYER_WINS));
  }

  public getBluePlayerWins(): Number {
    return Number(localStorage.getItem(BLUE_PLAYER_WINS));
  }

  public updateHighscore(newWinner: BoardCell) {
    switch (newWinner) {
      case BoardCell.Player1:
        this.incrementPlayerWins(BLUE_PLAYER_WINS);
        break;
      case BoardCell.Player2:
        this.incrementPlayerWins(RED_PLAYER_WINS);
        break;
    }
  }

  private incrementPlayerWins(localStorageKey: string) {
    let playerWins: number = Number(localStorage.getItem(localStorageKey));
    localStorage[localStorageKey] = String(playerWins + 1);
  }
}
