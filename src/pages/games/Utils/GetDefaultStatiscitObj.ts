import { IResultGame, IUserStatisticsRes } from "../../../API/types";

export function GetDefaultStatiscitObj(): IUserStatisticsRes {
  function getDefaultResultObj(): IResultGame {
    return {
      wordCounter: 0,
      rightAnswers: 0,
      wrongAnswers: 0,
      bestSeries: 0,
      createdOn: new Date(),
    }
  }
  
  return {
    learnedWords: 0,
    optional: {
      audioСall: JSON.stringify([getDefaultResultObj()]),
      sprint: JSON.stringify([getDefaultResultObj()]),
    },
  }
}