import { BACKEND_URL } from '../constants';
import { IUserWordCreate } from './types';
import { pageType, groupType } from '../types';
import { User } from '../features/auth/authSlice';

export const getUserWord = async (
  wordId: string,
  userId: string,
  token: string,
) => {
  try {
    const responce = await fetch(
      `${BACKEND_URL}/users/${userId}/words/${wordId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (responce.status === 200) {
      return responce.json();
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const createUserWord = async (
  wordId: string,
  userId: string,
  token: string,
  body: IUserWordCreate,
) => {
  try {
    const request = await fetch(
      `${BACKEND_URL}/users/${userId}/words/${wordId}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (request.status === 200) {
      return request.json();
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const getUserWords = async (user: User) => {
  try {
    const { userId, token } = user;
    const request = await fetch(`${BACKEND_URL}/users/${userId}/words`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (request.status === 200) {
      return request.json();
    }

    if (request.status === 401 || request.status === 400) {
      return undefined;
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const updateUserWord = async (
  wordId: string,
  userId: string,
  token: string,
  body: IUserWordCreate,
) => {
  try {
    const request = await fetch(
      `${BACKEND_URL}/users/${userId}/words/${wordId}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (request.status === 200) {
      return request.json();
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const getWordById = async (wordId: string) => {
  try {
    const responce = await fetch(`${BACKEND_URL}/words/${wordId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (responce.status === 200) {
      return responce.json();
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const getWords = async (
  page: pageType,
  group: groupType,
  token: string,
) => {
  try {
    const responce = await fetch(
      `${BACKEND_URL}/words?page=${page}&group=${group}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (responce.status === 200) {
      return responce.json();
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const getRefreshToken = async (user: User) => {
  try {
    const { userId, refreshToken } = user;
    const refreshReq = await fetch(`${BACKEND_URL}/users/${userId}/tokens`, {
      headers: {
        authorization: `Bearer ${refreshToken}`,
      },
    });
    if (refreshReq.ok && refreshReq.status === 200) {
      return refreshReq.json();
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};
