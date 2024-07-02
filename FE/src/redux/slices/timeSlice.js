// src/timeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const timeSlice = createSlice({
  name: 'time',
  initialState: {
    currentTime: new Date()
  },
  reducers: {
    updateTime(state) {
      state.currentTime = new Date();
    }
  }
});

export const { updateTime } = timeSlice.actions;
export default timeSlice.reducer;