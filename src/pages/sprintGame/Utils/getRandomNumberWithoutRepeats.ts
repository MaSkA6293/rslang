/* eslint-disable no-unused-expressions */
import { getRandomIntInclusive } from "./getRandomIntInclusive";

export function getRandomNumberWithoutRepeats() {
  const arr: number[] = [];
  const fn = () => {
    let randomNumber = getRandomIntInclusive(0, 29)

    arr.includes(randomNumber)
    ? randomNumber = fn()
    : arr.push(randomNumber)

    return randomNumber
  }
  return fn
}