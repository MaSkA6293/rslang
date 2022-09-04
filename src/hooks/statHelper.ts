/* eslint-disable no-return-assign */
import { testStat } from '../API/newtypes';

export function getDefaultStat(): testStat {
  return {
    learnedWords: 0,
    optional: {
      '04.09.22': {
        learnedWords: [],
        games: {
          sprint: {
            newWords: [],
            rightAnswers: 0,
            wrongAnswers: 0,
            bestSeries: 0,
          },
        },
      },
    },
  };
}

export function getTimeToday() {
  const today = new Date();
  return `${today.getDate()}.${today.getMonth()}.${today.getFullYear()}`;
}

export function getDayDefaultStat(date: string) {
  const games = ['sprint', 'autoCall'];

  const result = {
    newWords: [],
    rightAnswers: 0,
    wrongAnswers: 0,
    bestSeries: 0,
  };

  const gamesWithResults: Record<string, any> = {};

  games.forEach(name => {
    gamesWithResults[name] = result
  })

  return {
    [date]: {
      learnedWords: [],
      games: {
        sprint: [],
      },
    },
  };
}

function changeStatByLearnedWord({
  stat,
  learnedWordId,
  isToDelete,
}: {
  stat: testStat;
}): testStat {
  let { learnedWords, optional } = stat;
  const today = getTimeToday();

  if (!Object.keys(optional).includes(today))
    optional = {
      ...optional,
      ...getDayDefaultStat(today),
    };

  const currentObj = optional[today as keyof typeof optional];
  let { learnedWords } = currentObj;

  if (isToDelete) {
    learnedWords = learnedWords.filter((a) => a !== learnedWordId);
  } else {
    learnedWords = learnedWords.includes(learnedWordId)
      ? learnedWords
      : [...learnedWords, learnedWordId];
  }
}
