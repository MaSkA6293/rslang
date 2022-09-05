import { IUserWordCreate } from '../../API/types';

const shuffle = <T>(arr: readonly T[]): T[] => {
  const arrCopy = arr.slice();
  let curIndex = arrCopy.length;
  let randIndex;
  while (curIndex !== 0) {
    randIndex = Math.floor(Math.random() * curIndex);
    curIndex -= 1;
    [arrCopy[curIndex], arrCopy[randIndex]] = [
      arrCopy[randIndex],
      arrCopy[curIndex],
    ];
  }
  return arrCopy;
};

const numWord = (num: number, words: string[]) => {
  const value = Math.abs(num) % 100;
  const digit = value % 10;
  if (value > 10 && value < 20) {
    return words[2];
  }
  if (digit > 1 && digit < 5) {
    return words[1];
  }
  if (digit === 1) {
    return words[0];
  }
  return words[2];
};

const getNewUserWord = (isSuccess: boolean) => {
  const userWord: IUserWordCreate = {
    difficulty: 'no',
    optional: {
      learned: false,
      success: isSuccess ? 1 : 0,
      fail: isSuccess ? 0 : 1,
      series: isSuccess ? 1 : 0,
    },
  };
  return userWord;
};

const getBestSeriesCount = <T>(arr: T[], target: T): number => {
  let bestStrike = 0;
  let curStrike = 0;
  arr.forEach((item, i) => {
    if (item !== arr[i - 1]) {
      curStrike = 0;
    }
    if (item === target) {
      curStrike += 1;
      bestStrike = Math.max(curStrike, bestStrike);
    }
  });
  return bestStrike;
};

export { shuffle, numWord, getNewUserWord, getBestSeriesCount };