import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { View, pageType, groupType, textBookView } from '../../types';

export interface TextBookState {
  page: pageType;
  group: groupType;
  view: textBookView;
}

const initialState: TextBookState = {
  page: 0,
  group: 0,
  view: textBookView.textBook,
};

export const textBookSlice = createSlice({
  name: 'textBook',
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<Number>) => {
      state.group = action.payload as groupType;
      state.page = 0;
    },
    setPage: (state, action: PayloadAction<Number>) => {
      state.page = action.payload as pageType;
    },
    setTextBookView: (state, action: PayloadAction<textBookView>) => {
      state.view = action.payload;
    },
  },
});

export const { setGroup, setPage, setTextBookView } = textBookSlice.actions;

export const selectView = (state: RootState): View => state.app.activeView;
export const selectTextBook = (
  state: RootState,
): {
  page: pageType;
  group: groupType;
} => state.textBook;

export const selectTextBookView = (state: RootState): textBookView =>
  state.textBook.view;

export default textBookSlice.reducer;
