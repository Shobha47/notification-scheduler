import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import reminderReducer from './slice/reminderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reminder: reminderReducer,
    // add more reducers here (notifications, enquiry etc)
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;