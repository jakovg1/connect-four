import { Injectable } from '@angular/core';
import { BOARD_WIDTH, Difficulty } from '../components/board/board.constants';
import { BoardCell } from '../components/board/board.model';

@Injectable({
  providedIn: 'root',
})
export class AiAdversaryService {
  public setDifficulty(difficulty: Difficulty) {
    this._difficulty = difficulty;
  }

  private _difficulty: Difficulty = Difficulty.Medium;

  constructor() {}

  public getNextMove(board: BoardCell[][]): number {
    return Math.floor(Math.random() * BOARD_WIDTH);
  }
}
