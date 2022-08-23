import { RootState } from '../app/store';
import { User } from '../features/auth/authSlice';
import { pageType, groupType } from '../types';
import { ICreateUserWord, IUserWords } from './types';
import { userApi } from './userApi';

export interface IGetWords {
  page: pageType;
  group: groupType;
}

export interface IGetWord {
  id: string;
}

export const wordsApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    getWords: build.query({
      query: ({ page = 1, group = 1 }: IGetWords) =>
        `words?page=${page}&group=${group}`,
    }),
    getWord: build.query<any, any>({
      query: ({ id }: IGetWord) => `words/${id}`,
    }),
    getUserWords: build.query<IUserWords[], Pick<User, 'userId'>>({
      query: ({ userId }) => `users/${userId}/words`,
    }),
    createUserWord: build.mutation({
      async queryFn(
        arg: ICreateUserWord,
        { getState },
        extraOptions,
        fetchWithBQ,
      ) {
        const { userId } = (getState() as RootState).auth.user;

        const { body } = arg;

        const result = await fetchWithBQ({
          url: `users/${userId}/words/${arg.wordId}`,
          method: 'POST',
          body,
        });

        const data = result.data as IUserWords;

        return { data };
      },
    }),
  }),
});

export const { useGetWordsQuery, useGetWordQuery, useGetUserWordsQuery,
useCreateUserWordMutation } =
  wordsApi;
