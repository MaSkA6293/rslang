import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userApi } from '../API/userApi';
import { wordsApi } from '../API/wordsApi';
import appReducer from '../features/app/app';
import authSlice from '../features/auth/authSlice';
import textBookReducer from '../features/textBook/textBook';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'textBook'],
};

const rootRecuder = combineReducers({
  auth: authSlice,
  app: appReducer,
  [userApi.reducerPath]: userApi.reducer,
  [wordsApi.reducerPath]: wordsApi.reducer,
  textBook: textBookReducer,
});

const persistedReducer = persistReducer(persistConfig, rootRecuder);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([userApi.middleware, wordsApi.middleware]),
  devTools: true,
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
