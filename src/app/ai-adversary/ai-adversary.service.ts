import { Injectable } from '@angular/core';
import { BOARD_WIDTH, Difficulty } from '../components/board/board.constants';
import { Board, BoardCell } from '../components/board/board.model';
import { BoardService } from '../components/board/board.service';
import { getRandomIntInRange } from '../utility/utils';

export interface PlayerMove {
  readonly column: number;
  readonly score: number;
  [moves: number]: PlayerMove;
}

@Injectable({
  providedIn: 'root',
})
export class AiAdversaryService {
  private _difficulty: Difficulty = Difficulty.Medium;

  public set difficulty(difficulty: Difficulty) {
    switch (difficulty) {
      case Difficulty.Easy:
        this._maxDepth = 2;
        break;
      case Difficulty.Medium:
        this._maxDepth = 4;
        break;
      case Difficulty.Hard:
        this._maxDepth = 5;
        break;
    }
    this._difficulty = difficulty;
  }

  public get difficulty(): Difficulty {
    return this._difficulty;
  }

  public tree: any;

  private _maxDepth: number;

  constructor(private boardService: BoardService) {
    this._maxDepth = 4;
    this._difficulty = Difficulty.Medium;
  }

  public getNextMove(initialBoard: Board): number {
    this.tree = {};
    const optimalMove = this.minimax(initialBoard, this._maxDepth);
    let { column } = optimalMove;
    return column;
  }

  private minimax(intialBoard: Board, depth: number): PlayerMove {
    let result: any = {};
    if (depth == 0) {
      const playerMove = { column: -1, score: 0 } as PlayerMove; //replace score 0 with heuristic!
      return playerMove;
    }

    const validMoves: Record<number, PlayerMove> = {};
    for (let column = 0; column < BOARD_WIDTH; column++) {
      if (!intialBoard.isValidMove(column)) continue;
      const board = intialBoard.cloneBoard();
      const winner = this.boardService.addTokenToColumn(column, board);
      if (winner !== undefined) {
        switch (winner) {
          case BoardCell.Player1:
            return { column, score: -1_000_000 };
          case BoardCell.Player2:
            return { column, score: 1_000_000 };
          case BoardCell.Empty:
            return { column, score: 0 };
          default:
            return { column, score: 0 };
        }
      }

      board.toggleTurnOfPlayer();
      const move = this.minimax(board, depth - 1);
      validMoves[column] = move;
      result[column] = move;
    }
    let optimalMoveIndex: number;
    let minMaxFunction: Function;
    if (intialBoard.turnOfPlayer == BoardCell.Player2) {
      minMaxFunction = Math.max;
    } else {
      minMaxFunction = Math.min;
    }
    optimalMoveIndex = this.getOptimalMoveIndex(validMoves, minMaxFunction);

    const moveScores = Object.values(validMoves).map((move) => move.score);
    const averageMoveScore =
      moveScores.reduce((a, b) => a + b, 0) / moveScores.length;

    return {
      score: averageMoveScore,
      column: optimalMoveIndex,
      ...result,
    } as PlayerMove;
  }

  private getOptimalMoveIndex(
    validMoves: Record<number, PlayerMove>,
    minOrMaxFunction: Function
  ): number {
    if (Object.keys(validMoves).length == 0) return -1; // no moves available

    const optimalScore = minOrMaxFunction(
      ...Object.values(validMoves).map((move) => move.score)
    );
    const moveIndicesOfOptimalScore = Object.keys(validMoves).filter(
      (column) => validMoves[Number(column)].score === optimalScore
    );

    const randomMoveIndexOfOptimalScore = getRandomIntInRange(
      0,
      moveIndicesOfOptimalScore.length
    );
    const optimalMoveIndex: number = Number(
      moveIndicesOfOptimalScore[randomMoveIndexOfOptimalScore]
    );
    return optimalMoveIndex;
  }
}
