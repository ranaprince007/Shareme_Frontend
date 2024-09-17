import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../utils/user/userSlice';
import pinsReducer from '../utils/pins/pinsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  pins: pinsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
