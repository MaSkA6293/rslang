import {
  GameAction,
  GameActions,
  GameState,
  GameStates,
  Word,
} from '../../types';
import { shuffle } from '../../utils';

const getOptions = (current: number, words: Word[]): Word[] => {
  const correctAnswer = words[current];
  const wrongAnswers = shuffle(words)
    .filter((_w, i) => i !== current)
    .filter((w) => w.wordTranslate !== correctAnswer.wordTranslate);
  return shuffle([...wrongAnswers.slice(0, 4), correctAnswer]);
};

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  const { type } = action;

  switch (type) {
    case GameActions.SetFromTextbook:
      return {
        ...state,
        isFromTextbook: true,
        level: action.payload.level,
      };

    case GameActions.SetWords:
      return {
        ...state,
        words: action.payload.words,
      };

    case GameActions.Initialize:
      return {
        ...state,
        words: action.payload.words,
        iteration: {
          curIndex: 0,
          options: getOptions(0, action.payload.words),
        },
      };

    case GameActions.Start: {
      return {
        ...state,
        state: GameStates.InProgress,
      };
    }

    case GameActions.GoToNextWord: {
      const results = [...state.wordsResults, action.payload.result];
      if (state.iteration.curIndex + 1 >= state.words.length) {
        return {
          ...state,
          state: GameStates.Finished,
          wordsResults: results,
        };
      }
      const nextIndex = state.iteration.curIndex + 1;
      const nextOptions = getOptions(nextIndex, state.words);
      return {
        ...state,
        iteration: {
          curIndex: nextIndex,
          options: nextOptions,
        },
        wordsResults: results,
      };
    }

    case GameActions.Reset:
      return {
        ...state,
        state: GameStates.NotStarted,
      };

    case GameActions.ChangeLevel:
      return {
        ...state,
        level: action.payload.level,
      };
    default:
      return state;
  }
};
