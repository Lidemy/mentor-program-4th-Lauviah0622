import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createPost } from "../../WebAPI";
import { ErrorMessage } from "../../utils";

import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/features/fetch/fetchSlice";
import useLoginRedirect from "../../hooks/useLoginRedirect";

export default function Newpost() {
  const history = useHistory();
  const loading = useSelector((store) => store.fetchState.isLoading);
  const errorMessage = useSelector((store) => store.fetchState.errorMessage);

  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useLoginRedirect(() => {
    history.push("/");
  }, null);
  // 防止未登入使用者透過 url 進入 newpost

  const handleSubmit = (e) => {
    if (loading) return;
    e.preventDefault();
    dispatch(fetchData(() => createPost(title, content))).then((response) => {
      history.push("/");
    });
  };

  return (
    <form>
      <div>
        Title:{" "}
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></input>
      </div>
      <div>
        Content：{" "}
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
      </div>
      <button onClick={handleSubmit}>submit</button>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </form>
  );
}
