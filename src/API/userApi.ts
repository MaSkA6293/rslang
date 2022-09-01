import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { RootState } from '../app/store';
import { BACKEND_URL } from '../constants';
import { logOut, setCredential } from '../features/auth/authSlice';
import {
  IGetUserResponse,
  IUpdateUserPrms,
  IUpdateUserRes,
  IupsertUserStatistic,
  IUserStatisticsRes,
} from './types';

const baseQuary = fetchBaseQuery({
  baseUrl: BACKEND_URL,
  credentials: 'omit',
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as RootState).auth.user;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuary(args, api, extraOptions);
  // eslint-disable-next-line no-console
  console.log(result);
  if (result.error) {
    // sending refresh token
    const { user } = (api.getState() as RootState).auth;
    const { userId, refreshToken } = user;
    const refreshReq = await fetch(`${BACKEND_URL}/users/${userId}/tokens`, {
      headers: {
        authorization: `Bearer ${refreshToken}`,
      },
    });

    if (refreshReq.ok && refreshReq.status === 200) {
      const newTokens = await refreshReq.json();
      api.dispatch(setCredential({ ...user, ...newTokens }));
      // try the original query with new access token
      result = await baseQuary(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const userApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUser: builder.query<IGetUserResponse, { userId: string }>({
      query: ({ userId }) => `users/${userId}`,
    }),
    getUserStatistic: builder.query<IUserStatisticsRes, { userId: string }>({
      query: ({ userId }) => `/users/${userId}/statistics`,
    }),
    upsertUserStatistic: builder.mutation<
      IUserStatisticsRes,
      IupsertUserStatistic
    >({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/statistics`,
        method: 'PUT',
        body,
      }),
    }),
    register: builder.mutation<IUpdateUserRes, IUpdateUserRes>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        url: '/signin',
        method: 'POST',
        body,
      }),
    }),
    updateUser: builder.mutation<IUpdateUserRes, IUpdateUserPrms>({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteUser: builder.mutation<null, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserStatisticQuery,
  useUpsertUserStatisticMutation,
  useRegisterMutation,
  useLoginMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
