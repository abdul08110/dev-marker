/**
 * DEFINES CLUB STATE IN THE APP
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClubData, ClubState } from '../types';


const initialState: ClubState = {
    clubs: [],
    activeClub: null,
};

const clubSlice = createSlice({
    name: 'club',
    initialState,
    reducers: {
        setClubs(state, action: PayloadAction<ClubData[]>) {
            state.clubs = action.payload;
        },
        setActiveClub(state, action: PayloadAction<ClubData>) {
            state.activeClub = action.payload;
        },
    },
});

export const { setClubs, setActiveClub } = clubSlice.actions;
export default clubSlice.reducer;