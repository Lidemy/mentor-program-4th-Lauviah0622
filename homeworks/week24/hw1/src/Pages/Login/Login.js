import styled from "styled-components";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/auth/authSlice';

import useErrorMessage from '../../hooks/useErrorMessage';
import useLoginRedirect from '../../hooks/useLoginRedirect';


const ErrorMessage = styled.div`
  color: red;
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errMessage = useErrorMessage();
  
  const history = useHistory();
  const dispatch = useDispatch();
  useLoginRedirect(null, () => {
    history.push('/')
  })

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password)).then(resolve => {
      history.push('/')
    })
  }
  
  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>
          username:{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div>
          password:{" "}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button>submit</button>
      </form>
      <ErrorMessage>{errMessage}</ErrorMessage>
    </>
  );
}
