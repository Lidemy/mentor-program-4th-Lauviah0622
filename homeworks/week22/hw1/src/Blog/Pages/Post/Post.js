import { useState, useEffect } from "react";
import styled from 'styled-components';
import { getPost } from '../../WebAPI';
import { useParams } from 'react-router-dom';

const PostContainer = styled.div`
`;

export default function Post() {
  const [post, setArticle] = useState(null);
  let { id } = useParams();
  console.log(id);
  useEffect(() => {
    getPost(id).then(json => {
      console.log(json);
      setArticle(json[0])
    })
  }, [id]);
  return (
    <PostContainer>
      <h1>
        #{post && post.id} {post && post.title} 
      </h1>
      <h3>{post && new Date(post.createdAt).toLocaleString()}</h3>
      <p>{post && post.body}</p>
    </PostContainer>
  );
}
