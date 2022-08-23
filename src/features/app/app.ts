import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { View, pageType, groupType } from '../../types';

export interface AppState {
  isAuth: boolean;
  dictionary: {
    page: pageType;
    group: groupType;
  };
  activeView: View;
  prevPath: string;
}

const initialState: AppState = {
  isAuth: false,
  dictionary: {
    page: 0,
    group: 0,
  },
  activeView: View.main,
  prevPath: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<View>) => {
      state.activeView = action.payload;
    },
    setPath: (state, action: PayloadAction<string>) => {
      state.prevPath = action.payload;
    },
  },
});

export const { setView, setPath } = appSlice.actions;

export const selectView = (state: RootState): View => state.app.activeView;

export const selectPath = (state: RootState): string => state.app.prevPath;

export default appSlice.reducer;
