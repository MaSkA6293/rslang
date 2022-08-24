import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface User {
  message: string;
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
}

export interface authState {
  user: User;
}

const initialUser = {
  message: '',
  token: null,
  refreshToken: null,
  userId: null,
}

const initialState: authState = {
  user: initialUser
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredential: (state, action) => {
      const user = action.payload;
      state.user = user;
    },
    logOut: (state) => {
      state.user = initialUser
    },
  },
});

export const { setCredential, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.user.token;
