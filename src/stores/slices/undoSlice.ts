import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum UndoSnookerTypes {
  MATCH_START = 'MATCH_START',
  POINT = 'POINT',
  FOUL = 'FOUL',
  END_FRAME = 'END_FRAME',
  START_FRAME = 'START_FRAME',
}

interface UndoEntry {
  sliceName: string;
  previousState: any;
  type: UndoSnookerTypes;
}

interface UndoState {
  undoStack: UndoEntry[];
}

const initialState: UndoState = {
  undoStack: [],
};

const undoSlice = createSlice({
  name: 'undo',
  initialState,
  reducers: {
    pushToUndoStack(state, action: PayloadAction<UndoEntry>) {
      state.undoStack.push(action.payload);
    },
    popFromUndoStack(state) {
      state.undoStack.pop();
    },
    clearUndoStack(state) {
      state.undoStack = [];
    },
  },
});

export const { pushToUndoStack, popFromUndoStack, clearUndoStack } = undoSlice.actions;
export default undoSlice.reducer;
