const shuffle = <T>(arr: T[]): T[] => {
  let curIndex = arr.length;
  let randIndex;
  while (curIndex !== 0) {
    randIndex = Math.floor(Math.random() * curIndex);
    curIndex -= 1;
    [arr[curIndex], arr[randIndex]] = [arr[randIndex], arr[curIndex]];
  }
  return arr;
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
