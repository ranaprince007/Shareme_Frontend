import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const user = action.payload
            state.user = user
        },
        unsetUser: (state, action) => {
            state = null
        }
    }
})

export const {setUser, unsetUser} = userSlice.actions

export default userSlice.reducer