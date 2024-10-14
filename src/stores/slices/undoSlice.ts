import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UndoEntry {
  sliceName: string;
  previousState: any;
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
