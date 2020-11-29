import { useState, useEffect } from "react";
import styled from "styled-components";
import { getPost, deletePost } from "../../WebAPI";
import { useParams, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/features/fetch/fetchSlice";

const PostContainer = styled.div``;

export default function Post() {
  const [post, setArticle] = useState(null);
  const [editable, setEditable] = useState(false);
  const userState = useSelector((store) => store.authState.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchData(() => getPost(id)))
      .then((response) => {
        setArticle(response[0]);
        if (userState == null || userState.id !== response[0].userId) return;
        setEditable(true);
      })
      .catch((err) => {
        history.push("/");
      });
  }, [id, userState]);

  const handleDeleteButton = () => {
    dispatch(fetchData(() => deletePost(id))).then(() => {
      history.push("/");
    });
  };

  const handleUpdateButton = () => {
    history.push("/update/" + id);
  };

  return (
    <PostContainer>
      <h1>
        #{post && post.id} {post && post.title}
      </h1>
      <h3>{post && new Date(post.createdAt).toLocaleString()}</h3>
      {userState && <button onClick={handleDeleteButton}>delete</button>}
      {editable && <button onClick={handleUpdateButton}>update</button>}
      <p>{post && post.body}</p>
    </PostContainer>
  );
}
