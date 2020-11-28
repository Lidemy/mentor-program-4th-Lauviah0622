import { clearErrorMessage } from "../redux/features/fetch/fetchSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function useErrorMessage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearErrorMessage());
  }, []);
  const errorMessage = useSelector((store) => store.fetchState.errorMessage);
  return errorMessage;
}
