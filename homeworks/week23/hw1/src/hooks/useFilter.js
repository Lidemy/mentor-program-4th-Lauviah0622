import { useDispatch } from "react-redux";
import { setFilterState } from "../redux/feature/filter/filterSlice";
import { useCallback } from "react";

function useToolkitFilter() {
  const dispatch = useDispatch();
  const setFilter = useCallback(
    (filterState) => {
      dispatch(setFilterState({ filterState }));
    },
    [dispatch]
  );
  return [setFilter];
}

export default useToolkitFilter;
