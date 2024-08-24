import { configureStore } from '@reduxjs/toolkit';
import clubReducer from './slices/clubSlice';
import snookerReducer from './slices/snookerSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    club: clubReducer,
    snooker: snookerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: true,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
