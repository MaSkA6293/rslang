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

export { shuffle, numWord };
