import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_URL } from '../constants';
import { pageType, groupType } from '../types';

interface IGetWords {
  page: pageType;
  group: groupType;
}

interface IGetWord {
  id: string;
}

export const wordsApi = createApi({
  reducerPath: 'wordsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
  }),
  endpoints: (build) => ({
    getWords: build.query<any, any>({
      query: ({ page, group }: IGetWords) =>
        `words?page=${page}&group=${group}`,
    }),
    getWord: build.query<any, any>({
      query: ({ id }: IGetWord) => `words/${id}`,
    }),
  }),
});

export const { useGetWordsQuery, useGetWordQuery } = wordsApi;
