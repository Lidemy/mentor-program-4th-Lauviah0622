import styled from "styled-components";
import { getPosts } from "../../WebAPI";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LoadingContext } from "../../Contexts";
import PropTypes from "prop-types";

function Post({ title, time, id }) {
  return (
    <PostItem>
      <PostTitle to={`/post/${id}`}>
        #{id} {title}
      </PostTitle>
      <PostTime>{new Date(time).toLocaleTimeString()}</PostTime>
    </PostItem>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  time: PropTypes.number,
  id: PropTypes.number,
};

const PostItem = styled.div`
  border-bottom: 1px solid #777;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  & + & {
    margin-top: 12px;
  }
`;

const PostTime = styled.p``;

const PostTitle = styled(Link)`
  font-size: 18px;
  font-weight: 500;
  color: #000;
`;

const PostsListContainer = styled.div`
  max-width: 600px;
  margin: 30px auto;
`;

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const { setLoading } = useContext(LoadingContext);
  console.dir(PostsList);

  useEffect(() => {
    console.log("getPost");
    getPosts().then((json) => {
      setPosts(json);
      setLoading(false);
    });
  }, []);

  return (
    <PostsListContainer>
      {posts.map(({ title, id, createdAt, body }, index) => (
        <Post title={title} key={id} id={id} time={createdAt} />
      ))}
    </PostsListContainer>
  );
}
