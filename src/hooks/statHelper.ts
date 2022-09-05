import {
  IdateStatObj,
  ItestDatesStat,
  ItestDayStat,
  ItestGameResultStat,
  ItestGamesStat,
} from '../API/newtypes';

export function getTimeToday() {
  const today = new Date();
  return `${today.getDate()}.${today.getMonth()}.${today.getFullYear()}`;
}

export function makeDayDafaultStat(): IdateStatObj {
  const date = getTimeToday();
  const gamesName = ['audioCall', 'sprint'];

  const result: ItestGameResultStat = {
    newWords: [],
    rightAnswers: 0,
    wrongAnswers: 0,
    bestSeries: 0,
  };

  const games: ItestGamesStat = {
    ...Object.fromEntries(gamesName.map((name) => [name, result])),
  };

  const dateValues: ItestDatesStat = {
    learnedWords: [],
    games,
  };

  return {
    [date]: dateValues,
  };
}

export function makeStartedDefaultStat(): ItestDayStat {
  return {
    learnedWords: 0,
    optional: {
      ...makeDayDafaultStat(),
    },
  };
}


export function makeDefaultDayStat({stat}: {stat: ItestDayStat}): ItestDayStat {
  return {
    learnedWords: 0,
    optional: {
      ...stat.optional,
      ...makeDayDafaultStat(),
    },
  }
}

type typeArgs = {isToDelete: boolean, learnedWordId: string}
export type handleStatLearning = (args: typeArgs) => void

export function changeStatByLearnedWord({
  stat,
  learnedWordId,
  isToDelete,
}: {
  stat: ItestDayStat;
  learnedWordId: string;
  isToDelete: boolean;
}): ItestDayStat {
  const date = getTimeToday();
  const { optional } = stat;
  let dateObj = optional?.[date] ?? makeDayDafaultStat()[date];
  let { learnedWords } = dateObj;
  if (isToDelete) {
    learnedWords = learnedWords.filter((word) => word !== learnedWordId);
  } else {
    learnedWords = learnedWords.includes(learnedWordId)
      ? learnedWords
      : [...learnedWords, learnedWordId];
  }

  dateObj = { ...dateObj, learnedWords };

  return {
    learnedWords: 0,
    optional: {
      ...stat.optional,
      ...{ [date]: dateObj },
    },
  };
}

export function updateStatWithPrms({
  stat,
  gameName,
  wordId,
  series,
  isRight,
}: {
  gameName: string,
  stat: ItestDayStat,
  wordId?: string;
  isRight?: boolean;
  series?: number;
}): ItestDayStat{
  const date = getTimeToday()
  const {optional} = stat
  const {games, learnedWords} = optional[date]
  console.log('gameName', gameName)
  const results = games[gameName as keyof typeof games]
  let {newWords, rightAnswers, bestSeries, wrongAnswers} = results
  if (wordId) newWords = newWords.includes(wordId) ? newWords : [...newWords, wordId]
  if (isRight !== undefined) {
    rightAnswers = isRight ? rightAnswers + 1 : rightAnswers 
    wrongAnswers = isRight ? wrongAnswers : wrongAnswers + 1
  }
  if (series) bestSeries = series > bestSeries ? series : bestSeries
  
  const curDateObj = {
    learnedWords,
    games: {
      ...games,
      [gameName]: {
        newWords,
        rightAnswers,
        wrongAnswers,
        bestSeries
      }
    }
  }

  return {
    learnedWords: 0,
    optional: {
      ...stat.optional,
      [date]: curDateObj
    }
  }
}
