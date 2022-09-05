import { IUserWordCreate, IUserWords, IGetWordRes } from '../../../API/types';

export function getNewWordDifficult(): IUserWordCreate {
  return {
    difficulty: 'yes',
    optional: {
      learned: false,
      success: 0,
      fail: 0,
      series: 0,
    },
  };
}

export function getNewWordLearned(): IUserWordCreate {
  return {
    difficulty: 'no',
    optional: {
      learned: true,
      success: 0,
      fail: 0,
      series: 0,
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

export function getDefaultWord(): IGetWordRes {
  return {
    id: '11',
    group: 1,
    page: 1,
    word: 'string',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'string',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
  };
}
