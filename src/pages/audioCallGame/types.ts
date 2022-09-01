import { IGetWordRes, IUserWords } from '../../API/types';
import { groupType } from '../../types';

export type Word = IGetWordRes;
export type UserWord = IUserWords;

export enum GameStates {
  NotStarted,
  InProgress,
  Finished,
}

export interface GameState {
  level: groupType;
  isFromTextbook: boolean;
  words: Word[];
  userWords: UserWord[];
  state: GameStates;
  iteration: {
    curIndex: number;
    options: Word[];
  };
  wordsResults: boolean[];
}

export enum GameActions {
  SetFromTextbook = 'SET_FROM_TEXTBOOK',
  Initialize = 'INITIALIZE',
  Start = 'START',
  GoToNextWord = 'GO_TO_NEXT_WORD',
  Reset = 'RESET',
  ChangeLevel = 'CHANGE_LEVEL',
  ChangePage = 'CHANGE_PAGE',
  SetWords = 'SET_WORDS',
}

export type GameAction =
  | {
      type: GameActions.SetFromTextbook;
      payload: Pick<GameState, 'level'>;
    }
  | {
      type: GameActions.SetWords;
      payload: Pick<GameState, 'words'>;
    }
  | {
      type: GameActions.Initialize;
      payload: Pick<GameState, 'words'>;
    }
  | {
      type: GameActions.Start;
    }
  | {
      type: GameActions.GoToNextWord;
      payload: {
        result: boolean;
      };
    }
  | {
      type: GameActions.Reset;
    }
  | {
      type: GameActions.ChangeLevel;
      payload: Pick<GameState, 'level'>;
    };
