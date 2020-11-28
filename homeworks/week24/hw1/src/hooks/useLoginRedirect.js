import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function useLoginRedirect(ifNotLoginCallback, ifLoginCallback) {
  const authState = useSelector((store) => store.authState);

  useEffect(() => {
    if (authState.user == null) {
      ifNotLoginCallback && ifNotLoginCallback();
    } else {
      ifLoginCallback && ifLoginCallback();
    }
  }, [authState]);
}
