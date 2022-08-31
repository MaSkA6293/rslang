export interface IUserWords {
  id: string;
  wordId: string;
  difficulty: 'yes' | 'no';
  optional: {
    learned: boolean;
    success: number;
    fail: number;
    series: 0 | 1 | 2 | 3;
  };
}

export interface IUserWordCreate {
  difficulty: 'yes' | 'no';
  optional: {
    learned: boolean;
    success: number;
    fail: number;
    series: 0 | 1 | 2 | 3;
  };
}

export interface IResultGame {
  rightAnswers: number;
  wrongAnswers: number;
  wordCounter: number;
  bestSeries: number;
  createdOn: Date;
}

export interface IStatistics {
  learnedWords: number;
  optional: {
    audioСall?: IResultGame[];
    sprint?: IResultGame[];
  };
}

export interface IUpdateUserPrms {
  body: { name: string; email: string };
  userId: string;
}

export interface IUpdateUserRes {
  name: string;
  email: string;
  password: string;
}

export interface IGetWordPrms {
  page: number;
  group: number;
}

export interface IUserRes {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
}

export interface IGetWordRes {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface ICreateUserWord {
  wordId: string;
  body: {};
}

export interface IGetUserResponse {
  email: string;
  id: string;
  name: string;
}

export interface ICreateUserWordPrms {
  userId: string;
  wordId: string;
  body: IUserWordCreate;
}

export interface IUserStatisticsRes extends IStatistics {}

export interface IupsertUserStatistic {
  userId: string;
  body: IUserStatisticsRes;
}

export interface IGetAggregatedWords {
  userId: string;
  group?: number;
  page?: number;
  wordsPerPage?: number;
  filter?: Record<any, any>;
}
