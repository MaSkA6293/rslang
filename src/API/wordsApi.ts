import { User } from '../features/auth/authSlice';
import {
  ICreateUserWordPrms,
  IGetAggregatedWords,
  IGetWordPrms,
  IGetWordRes,
  IUserWords,
} from './types';
import { userApi } from './userApi';

export const wordsApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    getWords: build.query<IGetWordRes[], IGetWordPrms>({
      query: ({ page = 1, group = 1 }) => `words?page=${page}&group=${group}`,
    }),
    getWord: build.query<IGetWordRes, { wordId: string }>({
      query: ({ wordId }) => `words/${wordId}`,
    }),
    getUserWords: build.query<IUserWords[], Pick<User, 'userId'>>({
      query: ({ userId }) => `users/${userId}/words`,
    }),
    getUserWordById: build.query<IUserWords, Omit<ICreateUserWordPrms, 'body'>>(
      {
        query: ({ userId, wordId }) => `/users/${userId}/words/${wordId}`,
      },
    ),
    createUserWord: build.mutation<IUserWords, ICreateUserWordPrms>({
      query: ({ userId, wordId, body }) => ({
        url: `/users/${userId}/words/${wordId}`,
        method: 'POST',
        body,
      }),
    }),
    updateUserWord: build.mutation<IUserWords, ICreateUserWordPrms>({
      query: ({ userId, wordId, body }) => ({
        url: `/users/${userId}/words/${wordId}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteUserWord: build.mutation<
      IUserWords,
      Omit<ICreateUserWordPrms, 'body'>
    >({
      query: ({ userId, wordId }) => ({
        url: `/users/${userId}/words/${wordId}`,
        method: 'DELETE',
      }),
    }),
    getAggregatedWords: build.query<IGetWordRes[], IGetAggregatedWords>({
      query: ({ userId, page, group, wordsPerPage, filter }) =>
        `/users/${userId}/aggregatedWords?${page && `page=${page}&`}${
          group && `group=${group}&`
        }${wordsPerPage && `wordsPerPage=${wordsPerPage}&`}${
          filter && `filter=${filter}`
        }`,
    }),
    getAggregatedWordsById: build.query<
      IUserWords,
      Omit<ICreateUserWordPrms, 'body'>
    >({
      query: ({ userId, wordId }) =>
        `/users/${userId}/aggregatedWords/${wordId}`,
    }),
  }),
});

export const {
  useGetWordsQuery,
  useGetWordQuery,
  useGetUserWordsQuery,
  useGetUserWordByIdQuery,
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
  useDeleteUserWordMutation,
  useGetAggregatedWordsQuery,
  useGetAggregatedWordsByIdQuery,
} = wordsApi;
