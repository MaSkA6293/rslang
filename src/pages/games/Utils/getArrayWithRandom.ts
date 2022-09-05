import { shuffleArray } from './suffleArray';

export function getArrayWithRandom(length: number): number[] {
  const array = [...Array(length)].map((_, i) => i);
  return shuffleArray(array);
}
