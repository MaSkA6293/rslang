export enum GamesIds {
  audioCall = 'audioСall',
  sprint = 'sprint',
}

export interface IGameStats {
  newWords: number;
  rightAnswers: number;
  totalAnswers: number;
  bestSeries: number;
}

export type IGameStatsWithId = {
  id: GamesIds;
} & IGameStats;

export interface IStats {
  today: {
    newWords: number;
    rightAnswers: number;
    totalAnswers: number;
  };
  games: IGameStatsWithId[];
}
