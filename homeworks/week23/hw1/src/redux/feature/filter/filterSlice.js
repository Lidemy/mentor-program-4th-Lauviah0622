import { createSlice } from "@reduxjs/toolkit";

const filterStateSlice = createSlice({
  name: "filterState",
  initialState: '',
  reducers: {
    setFilterState(state, action) {
      return action.payload.filterState
    }
  },
});

export const { setFilterState } = filterStateSlice.actions;

export default filterStateSlice.reducer;
