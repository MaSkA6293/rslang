import {
  IUserWordCreate,
  IUserWords,
} from '../../../API/types';

type prms = {
  userWord: IUserWords;
  answer: 'right' | 'wrong';
};

export function getObjToUpdateUserWord({
  userWord,
  answer,
}: prms): [choice: string, body: IUserWordCreate] {
  let { difficulty } = userWord;
  let { series, fail, success, learned } = userWord.optional;

  let choice = 'nothing'

  if (answer === 'right') {
    success += 1;
    if (!learned) {
      series += 1;
      const border = difficulty === 'yes' ? 5 : 3
      const isLearned = series >= border;
      if (isLearned) {
        choice = 'learned'
      }
      learned = isLearned ? true : learned;
      difficulty = isLearned ? 'no' : difficulty;
    }
    
  } else {
    choice = 'unlearned'
    series = 0;
    fail += 1;
  }

  const body = {
    difficulty,
    optional: {
      learned,
      success,
      fail,
      series,
    },
  };

  return [choice, body]
}
