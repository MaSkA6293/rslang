import { IResultGame } from '../../API/types';

export const isDateWithinToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const reviveDate = (targetKey: string) => (key: string, val: any) =>
  key === targetKey ? new Date(val) : val;

export const parseGameResult = (result: string): IResultGame[] =>
  JSON.parse(result, reviveDate('createdOn'));

export const getPrcntStr = (num: number, denom: number) =>
  `${denom === 0 ? 0 : Math.round((num / denom) * 100)}%`;
