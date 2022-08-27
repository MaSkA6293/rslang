import { IUserWordCreate, IUserWords } from '../../../API/types';

export function getNewWordDifficult(): IUserWordCreate {
  return {
    difficulty: 'yes',
    optional: {
      learned: false,
      addTime: new Date().toString(),
      games: {
        sprint: {
          right: 0,
          wrong: 0,
        },
        audioCall: {
          right: 0,
          wrong: 0,
        },
      },
      allTry: 0,
    },
  };
}

export function getNewWordLearned(): IUserWordCreate {
  return {
    difficulty: 'no',
    optional: {
      learned: true,
      addTime: new Date().toString(),
      games: {
        sprint: {
          right: 0,
          wrong: 0,
        },
        audioCall: {
          right: 0,
          wrong: 0,
        },
      },
      allTry: 0,
    },
  };
}

export function modifyDifficulty(checkWord: IUserWords): IUserWordCreate {
  return {
    difficulty: checkWord.difficulty === 'yes' ? 'no' : 'yes',
    optional: checkWord.optional,
  };
}

export function modifyLearned(checkWord: IUserWords): IUserWordCreate {
  return {
    difficulty: checkWord.difficulty,
    optional: { ...checkWord.optional, learned: !checkWord.optional.learned },
  };
}
