import { IResultGame } from '../../API/types';

export const isSameDay = (date: Date, targetDay: Date) =>
  date.toDateString() === targetDay.toDateString();

export const reviveDate = (targetKey: string) => (key: string, val: any) =>
  key === targetKey ? new Date(val) : val;

export const parseGameResult = (result: string): IResultGame[] =>
  JSON.parse(result, reviveDate('createdOn'));

export const getPrcntStr = (num: number, denom: number) =>
  `${denom === 0 ? 0 : Math.round((num / denom) * 100)}%`;

export const groupBy = <T extends Record<string, any>>(
  data: T[],
  key: keyof T,
  groupKeyMapper: (val: any) => string,
): Record<string, T[]> =>
  data.reduce((storage: Record<string, any>, item) => {
    const group = groupKeyMapper(item[key]);
    storage[group] = storage[group] || [];
    storage[group].push(item);
    return storage;
  }, {});

export const getDayString = (date: Date) => date.toISOString().slice(0, 10);

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const getDateRange = (startDate: Date, endDate: Date) => {
  const startDateInMs = startDate.valueOf();
  const numberOfDays =
    Math.ceil((endDate.valueOf() - startDate.valueOf()) / DAY_IN_MS) + 1;
  return [...Array(numberOfDays).fill(null)].map((_, i) =>
    getDayString(new Date(startDateInMs + i * DAY_IN_MS)),
  );
};

export const aggregateGameResults = (results: IResultGame[]) => {
  const newWords = results
    .map((result) => result.wordCounter)
    .reduce((sum, count) => sum + count, 0);
  const totalAnswers = results
    .map((result) => result.rightAnswers + result.wrongAnswers)
    .reduce((sum, answers) => sum + answers, 0);
  const rightAnswers = results
    .map((result) => result.rightAnswers)
    .reduce((sum, right) => sum + right, 0);
  const bestSeries = Math.max(...results.map((result) => result.bestSeries));
  const stats = {
    newWords,
    rightAnswers,
    totalAnswers,
    bestSeries: Number.isFinite(bestSeries) ? bestSeries : 0,
  };
  return stats;
};
