import { IResultGame, IUserStatisticsRes } from '../../../API/types';

type prms = {
  stat: IUserStatisticsRes;
  rightAnswers: number
  wrongAnswers: number
  bestSeries: number
  newWords: number
  gameName: string
};

export default function GetStatisticObj({
  gameName,
  stat,
  rightAnswers,
  wrongAnswers,
  bestSeries,
  newWords
}: prms): IUserStatisticsRes {
  const {learnedWords } = stat;
  let { optional } = stat;
  const game = optional[gameName as keyof typeof optional]
  const results: IResultGame[] = JSON.parse(game)
  const newResult = {wordCounter: newWords, wrongAnswers, rightAnswers, bestSeries, createdOn: new Date()}
  results.push(newResult)
  optional = {...optional, sprint: JSON.stringify(results)}

  return {
    learnedWords,
    optional
  }

}
