import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_URL } from '../constants';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserUpdate {
  id: string;
  email: string;
  password: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
  }),
  endpoints: (build) => ({
    getUser: build.query<any, any>({
      query: ({ id }: { id: string }) => `users/${id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({
                type: 'User',
                id,
              })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    createUser: build.mutation<any, any>({
      query: (body: IUser) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST ' }],
    }),
    deleteUser: build.mutation({
      query: (id: string) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: build.mutation({
      query: ({ id, password, email }: IUserUpdate) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: { email, password },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    getNewUserToken: build.mutation({
      query: (id: string) => ({
        url: `users/${id}/tokens`,
        method: 'GET',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const { useGetUserQuery, useCreateUserMutation, useDeleteUserMutation } =
  userApi;
