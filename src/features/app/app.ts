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
}

const initialState: AppState = {
  isAuth: false,
  dictionary: {
    page: 0,
    group: 0,
  },
  activeView: View.main,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<View>) => {
      state.activeView = action.payload;
    },
  },
});

export const { setView } = appSlice.actions;

export const selectView = (state: RootState): View => state.app.activeView;

export default appSlice.reducer;
