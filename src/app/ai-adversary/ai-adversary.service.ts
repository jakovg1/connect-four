import { Injectable } from '@angular/core';
import { BOARD_WIDTH, Difficulty } from '../components/board/board.constants';
import { Board, BoardCell } from '../components/board/board.model';
import { BoardService } from '../components/board/board.service';

export interface PlayerMove {
  readonly column: number;
  readonly score: number;
  [moves: number]: PlayerMove;
}

@Injectable({
  providedIn: 'root',
})
export class AiAdversaryService {
  public setDifficulty(difficulty: Difficulty) {
    this._difficulty = difficulty;
  }

  public tree: any;

  private maxDepth = 5

  private _difficulty: Difficulty = Difficulty.Medium;

  constructor(private boardService: BoardService) { }

  public getNextMove(initialBoard: Board): number {
    this.tree = {};
    const optimalMove = this.minimax(initialBoard, this.maxDepth);
    const { column, score } = optimalMove;
    return column;
  }

  private minimax(intialBoard: Board, depth: number): PlayerMove {
    let result: any = {};
    if (depth == 0) {
      const playerMove = { column: -1, score: 0 } as PlayerMove; //replace score 0 with heuristic!
      return playerMove;
    }

    const validMoves: PlayerMove[] = [];
    for (let column = 0; column < BOARD_WIDTH; column++) {
      if (!intialBoard.isValidMove(column)) continue;
      const board = intialBoard.cloneBoard();
      const winner = this.boardService.addTokenToColumn(column, board);
      if (!!winner) {
        if (winner == BoardCell.Player1) return { column, score: -1_000_000 };
        if (winner == BoardCell.Player2) return { column, score: 1_000_000 };
      }

      board.toggleTurn();
      const move = this.minimax(board, depth - 1);
      validMoves.push(move);
      result[column] = move;
    }
    let optimalMoveIndex;
    if (intialBoard.turnOfPlayer == BoardCell.Player2) {  //player2 ili 1??
      //max
      const maxScore = Math.max(...validMoves.map((move) => move.score));
      optimalMoveIndex =
        validMoves.findIndex((move) => move.score === maxScore) || 0;
    } else {
      //min
      const minScore = Math.min(...validMoves.map((move) => move.score));
      optimalMoveIndex =
        validMoves.findIndex((move) => move.score === minScore) || 0;
    }

    const moveScores = validMoves.map(move => move.score);
    const averageMoveScore = moveScores.reduce((a, b) => a + b, 0) / moveScores.length;

    return { score: averageMoveScore, column: optimalMoveIndex, ...result } as PlayerMove;
  }
}
