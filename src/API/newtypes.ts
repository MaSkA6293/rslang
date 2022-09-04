export interface testStat {
  learnedWords: number,
  optional: {
    "04.09.22": {
      learnedWords: string[],
      games: {
        sprint: {
          newWords: string[]
          rightAnswers: number
          wrongAnswers: number
          bestSeries: number
        }
      } 
    }
  }
}