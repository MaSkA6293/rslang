import { IUserWordCreate, IUserWords } from '../../../API/types';

type prms = {
  userWord: IUserWords;
  answer: 'right' | 'wrong';
};

export function getObjToUpdateUserWord({ userWord, answer }: prms): IUserWordCreate {
  let { difficulty } = userWord;
  let { series, fail, success, learned } = userWord.optional;

  if (answer === 'right') {
    success += 1;
    series += 1
    const isLearned = series >= 3;
    learned = isLearned ? true : learned
    difficulty = isLearned ? 'no' : difficulty;
  } else {
    series = 0;
    fail += 1;
  }

  return {
    difficulty,
    optional: {
      learned,
      success,
      fail,
      series,
    },
  };
}
