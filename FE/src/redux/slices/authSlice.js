import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import config from "../../config";
import LocalStorage from "../../utils/LocalStorageUtil";

const AUTH_TOKEN_KEY = config.JWT_KEY;

const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false,
  account: {},
  errorMessage: null,
  redirectMessage: null,
  sessionHasBeenFetched: false,
};

let API_URL = config.API_HOST + "/auth";

export const getSession = () => async (dispatch, getState) => {
  dispatch(getAccount());
};

export const getAccount = createAsyncThunk(
  "authentication/get_account",
  async () => {
    let res = await axios.get(API_URL);
    return res;
  }
);

export const authenticate = createAsyncThunk(
  "authentication/login",
  async ({ username, password }, { dispatch }) => {
    const response = await axios.post(API_URL + "/login", {
      username: username,
      password: password,
    });
    const bearerToken = response.data.token;
    if (bearerToken) {
      LocalStorage.save(AUTH_TOKEN_KEY, bearerToken);
    }
    await dispatch(getSession());
  }
);

export const clearAuthToken = () => {
  if (LocalStorage.get(AUTH_TOKEN_KEY)) {
    LocalStorage.remove(AUTH_TOKEN_KEY);
  }
};

export const logout = () => (dispatch) => {
  clearAuthToken();
  dispatch(logoutSession());
};

export const clearAuthentication = (messageKey) => (dispatch) => {
  clearAuthToken();
  dispatch(authError(messageKey));
  dispatch(clearAuth());
};

export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    logoutSession(state) {
      return {
        ...initialState,
      };
    },
    authError(state, action) {
      return {
        ...state,
        redirectMessage: action.payload,
      };
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action?.error?.message,
        loginError: true,
      }))
      .addCase(authenticate.fulfilled, (state) => ({
        ...state,
        isAuthenticated: true,
        loading: false,
        loginError: false,
        errorMessage: null,
        sessionHasBeenFetched: true,
        loginSuccess: true,
      }))
      .addCase(getAccount.rejected, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        errorMessage: "Bạn chưa đăng nhập!",
      }))
      .addCase(getAccount.fulfilled, (state, action) => {
        const isAuthenticated = action.payload.data != null;
        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account: action.payload.data,
        };
      })
      .addCase(authenticate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { logoutSession, authError, clearAuth } =
  AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
