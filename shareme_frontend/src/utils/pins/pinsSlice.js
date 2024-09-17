import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pins: [null]
}

export const pinsSlice = createSlice({
    name: 'pins',
    initialState,
    reducers: {
        setPins: (state, action) => {
            const pins = action.payload
            state.pins = pins
        }
    }
})

export const {setPins} = pinsSlice.actions


export default pinsSlice.reducer