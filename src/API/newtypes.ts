export interface ItestGameResultStat {
  newWords: string[];
  rightAnswers: number;
  wrongAnswers: number;
  bestSeries: number;
}


export type ItestGamesStat = Record<string, ItestGameResultStat>;


export interface ItestDatesStat {
  learnedWords: string[],
  games: ItestGamesStat
}

export type IdateStatObj = Record<string, ItestDatesStat>

export interface ItestDayStat {
  learnedWords: number;
  optional: IdateStatObj
}

// export interface testStat {
//   learnedWords: number;
//   optional: {
//     string: {
//       learnedWords: string[];
//       games: {
//         sprint: {
//           newWords: string[];
//           rightAnswers: number;
//           wrongAnswers: number;
//           bestSeries: number;
//         };
//       };
//     };
//   };
// }