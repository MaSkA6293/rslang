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

export default shuffle;
