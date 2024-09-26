export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 7;

export const NO_OF_BLUE_PLAYER_WINS = 'bluePlayerWins';
export const NO_OF_RED_PLAYER_WINS = 'redPlayerWins';

export const WINNING_STREAK = 4;
export const PAUSE_AT_END_OF_GAME = 2500; //ms

export enum GameMode {
  PlayerVsComputer,
  PlayerVsPlayer,
}

export enum Difficulty {
  Easy,
  Medium,
  Hard,
}
