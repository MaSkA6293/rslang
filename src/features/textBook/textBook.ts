import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  View,
  pageType,
  groupType,
  textBookView,
  learnedPagesType,
} from '../../types';

export interface TextBookState {
  page: pageType;
  group: groupType;
  view: textBookView;
  learnedPages: learnedPagesType;
}

const initialState: TextBookState = {
  page: 0,
  group: 0,
  view: textBookView.textBook,
  learnedPages: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  },
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
    setLearnedPage: (
      state,
      action: PayloadAction<{ group: groupType; value: pageType }>,
    ) => {
      const { group, value } = action.payload;
      const candidat = state.learnedPages[group];
      if (!candidat.includes(value)) {
        state.learnedPages = {
          ...state.learnedPages,
          [group]: [...candidat, value],
        };
      }
    },
    removeLearnedPage: (
      state,
      action: PayloadAction<{ group: groupType; value: pageType }>,
    ) => {
      const { group, value } = action.payload;
      const candidat = state.learnedPages[group];
      state.learnedPages = {
        ...state.learnedPages,
        [group]: candidat.filter((el) => el !== value),
      };
    },
  },
});

export const {
  setGroup,
  setPage,
  setTextBookView,
  setLearnedPage,
  removeLearnedPage,
} = textBookSlice.actions;

export const selectView = (state: RootState): View => state.app.activeView;

export const selectTextBook = (
  state: RootState,
): {
  page: pageType;
  group: groupType;
} => state.textBook;

export const selectTextBookView = (state: RootState): textBookView =>
  state.textBook.view;
export const selectLearnedPages = (state: RootState): learnedPagesType =>
  state.textBook.learnedPages;

export default textBookSlice.reducer;
