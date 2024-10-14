import { configureStore } from '@reduxjs/toolkit';
import clubReducer from './slices/clubSlice';
import sportReducer from './slices/sportSlice';
import undoReducer from './slices/undoSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    club: clubReducer,
    sport: sportReducer,
    undo: undoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
