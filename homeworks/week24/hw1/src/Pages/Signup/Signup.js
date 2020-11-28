import styled from "styled-components";
import { useState } from "react";
import { register } from "../../WebAPI";
import { useHistory } from "react-router-dom";

import { useDispatch } from "react-redux";
import { getMeData, clearUserData } from "../../redux/features/auth/authSlice";
import { fetchData } from "../../redux/features/fetch/fetchSlice";

import useErrorMessage from "../../hooks/useErrorMessage";
import useLoginRedirect from "../../hooks/useLoginRedirect";

const ErrorMessage = styled.div`
  color: red;
`;

export default function Signup() {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const errMessage = useErrorMessage();
  const history = useHistory();
  const dispatch = useDispatch();

  useErrorMessage();
  // 如果登入狀態辦帳號，就會自動登出，只在第一次進入的時候驗證

  useLoginRedirect(null, () => {
    dispatch(clearUserData());
  });

  const handleFormSubmit = () => {
    dispatch(fetchData(() => register(nickname, username, password)))
      .then(() => dispatch(getMeData()))
      .then(() => {
        history.push("/");
      });
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        nickname:{" "}
        <input
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
          }}
        ></input>
      </div>
      <div>
        username:{" "}
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></input>
      </div>
      <div>
        password:{" "}
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
      </div>
      <button>submit</button>
      <ErrorMessage>{errMessage}</ErrorMessage>
    </form>
  );
}

// ame: "我是 user01"
// password: "Lidemy"
// username: "user01"
