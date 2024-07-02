const AUTH_TOKEN_KEY = config.JWT_KEY;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import config from '../../config/index';
import  axios  from 'axios';

const initialState = {
  loading: false,
  updating: false,
  updateSuccess: false,
  loadSuccess: false,
  users: [],
  totalPage: 0,
  currentPage: 0,
  totalUser: 0,
  errorMessage: null,
};

let API_URL = config.API_HOST + "/users";

export const getUsers = createAsyncThunk(
  "user-management",
  async () => {
    const requestUrl = `${API_URL}`;
    let res = await axios.get(requestUrl);
    return res;
  }
);

export const UserSlice = createSlice({
  name: "user-management",
  initialState: initialState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUsers.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action.error.message,
        loading: false,
        loadSuccess: false
      }))
      .addCase(getUsers.fulfilled, (state, action) => {
        const {items : items, currentPage, totalPage, total} = action.payload.data;
        return {
            ...state,
            users: items,
            currentPage: currentPage,
            totalPage: totalPage,
            total: total,
            loading: false,
            loadSuccess: true
        }
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { reset } =  UserSlice.actions;

export default UserSlice.reducer;
