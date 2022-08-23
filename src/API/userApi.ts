/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { RootState } from '../app/store';
import { BACKEND_URL } from '../constants';
import { logOut, setCredential } from '../features/auth/authSlice';

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
    getUser: builder.query<{ id: string; email: string }, any>({
      query: (id) => `users/${id}`,
    }),
    register: builder.mutation({
      query: (body) => ({
        url: 'users',
        method: 'post',
        body,
      }),
    }),
    login: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        url: '/signin',
        method: 'post',
        body,
      }),
    }),
  }),
});

export const { useGetUserQuery, useRegisterMutation, useLoginMutation } =
  userApi;
