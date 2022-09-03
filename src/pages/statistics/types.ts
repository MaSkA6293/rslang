import { IResultGame } from '../../API/types';

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

export type IWordsStats = IGameStats & {
  date: string;
  learnedWords: number;
};

export interface IStats {
  today: {
    newWords: number;
    rightAnswers: number;
    totalAnswers: number;
  };
  games: IGameStatsWithId[];
  wordsStatsByDay: IWordsStats[];
}

export type GameResult = IResultGame & { gameId: GamesIds };
