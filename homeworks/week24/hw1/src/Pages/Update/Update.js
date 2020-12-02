import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getPost, updatePost } from "../../WebAPI";
import { ErrorMessage } from "../../utils";

import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/features/fetch/fetchSlice";

import useLoginRedirect from "../../hooks/useLoginRedirect";

export default function Newpost() {
  const history = useHistory();
  const loading = useSelector((store) => store.fetchState.isLoading);
  const errorMessage = useSelector((store) => store.fetchState.errorMessage);
  const userData = useSelector((store) => store.authState.user);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useLoginRedirect(() => {
    history.push("/");
  });

  useEffect(() => {
    let mounted = true;
    // 加上 mounted，解決 Can't perform a React state update on an unmounted component. 的問題
    dispatch(fetchData(() => getPost(id)))
      .then((response) => {
        if (userData.id !== response[0].userId) throw Error("not your post");
        if (mounted) {
          setContent(response[0].body);
          setTitle(response[0].title);
        }
      })
      .catch((err) => {
        history.push("/");
      });

    return () => {
      mounted = false;
    };
  }, [id, userData, history, dispatch]);

  // 防止未登入使用者透過 url 進入 newpost

  const handleSubmit = (e) => {
    if (loading) return;
    e.preventDefault();
    dispatch(fetchData(() => updatePost(id, title, content))).then(
      (response) => {
        history.push("/post/" + id);
      }
    );
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
