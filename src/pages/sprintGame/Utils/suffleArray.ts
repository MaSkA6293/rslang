export function shuffleArray<T>(array: T[]) {
  const copyArr = [...array]
  for (let i = copyArr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copyArr[i], copyArr[j]] = [copyArr[j], copyArr[i]];
  }
  return copyArr
}