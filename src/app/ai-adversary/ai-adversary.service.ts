import { Injectable } from '@angular/core';
import { BOARD_WIDTH, Difficulty } from '../components/board/board.constants';
import { Board, BoardCell } from '../components/board/board.model';
import { BoardService } from '../components/board/board.service';

export interface PlayerMove {
  readonly column: number;
  readonly score: number;
}

@Injectable({
  providedIn: 'root',
})
export class AiAdversaryService {
  public setDifficulty(difficulty: Difficulty) {
    this._difficulty = difficulty;
  }

  private maxDepth = 5; // refactor this. This should be connected to "_difficulty"

  private _difficulty: Difficulty = Difficulty.Medium;

  constructor(private boardService: BoardService) {}

  public getNextMove(initialBoard: Board): number {
    // while (true) {
    //   const board = initialBoard.cloneBoard();
    //   console.log(board);
    //   const moveProposition = Math.floor(Math.random() * BOARD_WIDTH);
    //   if (board.isValidMove(moveProposition)) return moveProposition;
    // }
    const optimalMove = this.minimax(initialBoard, this.maxDepth);
    const { column, score } = optimalMove;
    console.log(column, score);
    if (score === 0) {
      console.log('RANDOM!');
      return Math.floor(Math.random() * BOARD_WIDTH); //use random move if tree is not deep enough, i.e. score is 0. This is because no heuristic is used
    }
    return column;
  }

  private minimax(intialBoard: Board, depth: number): PlayerMove {
    if (depth === 5) debugger;
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
      validMoves.push(this.minimax(board, depth - 1));
    }

    if (intialBoard.turnOfPlayer == BoardCell.Player1) {
      //max
      const maxScore = Math.max(...validMoves.map((move) => move.score));
      return (
        validMoves.find((move) => move.score === maxScore) || ({} as PlayerMove)
      );
    } else {
      //min
      const minScore = Math.min(...validMoves.map((move) => move.score));
      return (
        validMoves.find((move) => move.score === minScore) || ({} as PlayerMove)
      );
    }
  }
}
