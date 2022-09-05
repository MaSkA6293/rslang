import { useDispatch, useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux/es/types';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
