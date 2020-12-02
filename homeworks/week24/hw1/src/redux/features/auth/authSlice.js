import { createSlice } from "@reduxjs/toolkit";
import { getMe as getMeAPI, login as loginAPI } from "../../../WebAPI";
import {
  setLoading,
  setErrorMessage,
  clearErrorMessage,
} from "../fetch/fetchSlice";

const userSlice = createSlice({
  name: "useState",
  initialState: {
    user: null,
  },
  reducers: {
    setUserData(state, { payload }) {
      state.user = payload;
    },
    clearUserData(state) {
      state.user = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export const getMeData = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrorMessage());
  try {
    const response = await getMeAPI();
    dispatch(setUserData(response.data));
  } catch (err) {
    clearUserData();
    dispatch(setErrorMessage(err.message));
    return Promise.reject(err.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (username, password) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrorMessage());
  try {
    const loginResponse = await loginAPI(username, password);
    if (loginResponse.ok !== 1) throw Error(loginResponse.message);
    const getMeResponse = await getMeAPI();
    dispatch(setUserData(getMeResponse.data));
    return true;
  } catch (err) {
    dispatch(setErrorMessage(err.message));
    return Promise.reject(err.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export default userSlice.reducer;
