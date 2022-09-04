export interface IUserWords {
  id: string;
  wordId: string | null;
  difficulty: 'yes' | 'no';
  learnedDate?: Number;
  optional: {
    learned: boolean;
    success: number;
    fail: number;
    series: number;
  };
}

export interface IUserWordCreate {
  difficulty: 'yes' | 'no';
  optional: {
    learnedDate?: Number;
    learned: boolean;
    success: number;
    fail: number;
    series: number;
  };
}

export interface IResultGame {
  rightAnswers: number;
  wordCounter: number;
  wrongAnswers: number;
  bestSeries: number;
  createdOn: Date;
}

export interface IStatistics {
  learnedWords: number;
  optional: {
    audioСall: IResultGame[];
    sprint: IResultGame[];
  };
}

export interface IUpdateUserPrms {
  body: { name: string; email: string, password: string };
  userId: string | null;
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
  userId: string | null;
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
  userId: string | null;
  wordId: string;
  body: IUserWordCreate;
}

export interface IUserStatisticsRes {
  learnedWords: number;
  optional: {
    audioСall: string;
    sprint: string;
  };
}

export interface IupsertUserStatistic {
  userId: string | null;
  body: IUserStatisticsRes;
}

export interface IGetAggregatedWords {
  userId: string | null;
  group?: number;
  page?: number;
  wordsPerPage?: number;
  filter?: string;
}

export interface IGetWordResAgregate {
  _id: string;
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

export interface IGetAggregatedWordsResponce {
  paginatedResults: IGetWordResAgregate[];
}
export type myTypp = IGetAggregatedWordsResponce[];