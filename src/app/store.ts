import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appReducer from '../features/app/app';
import { userApi } from '../API/userApi';
import { wordsApi } from '../API/wordsApi';
import counterSlice from '../features/counter/counterSlice';
import authSlice from '../features/auth/authSlice';

const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: {
    app: appReducer,
    counter: counterSlice,
    auth: authSlice,
    [userApi.reducerPath]: wordsApi.reducer,
    [wordsApi.reducerPath]: wordsApi.reducer,
    persistedReducer,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(wordsApi.middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
