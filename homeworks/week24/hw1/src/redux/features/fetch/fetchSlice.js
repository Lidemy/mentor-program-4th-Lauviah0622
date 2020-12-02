import { createSlice } from "@reduxjs/toolkit";

const fetchSlice = createSlice({
  name: "fetchState",
  initialState: {
    isLoading: false,
    errorMessage: null,
  },
  reducers: {
    setLoading(state, { payload }) {
      state.isLoading = payload;
    },
    setResponse(state, { payload }) {
      state.response = payload;
    },
    setErrorMessage(state, { payload }) {
      state.errorMessage = payload;
    },
    clearResponse(state) {
      state.response = null;
    },
    clearErrorMessage(state) {
      state.errorMessage = null;
    },
  },
});

export const {
  setLoading,
  setResponse,
  setErrorMessage,
  clearResponse,
  clearErrorMessage,
} = fetchSlice.actions;

export const fetchData = (webApi) => async (dispatch) => {
  dispatch(clearResponse());
  dispatch(clearErrorMessage());
  dispatch(setLoading(true));
  try {
    const response = await webApi();
    dispatch(setResponse(response));
    return response;
  } catch (err) {
    dispatch(setErrorMessage(err));
    return Promise.reject(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export default fetchSlice.reducer;
