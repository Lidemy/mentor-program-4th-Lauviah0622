import styled from 'styled-components';
import { useState, useContext } from "react";
import { login, getMe } from "../../WebAPI";
import { AuthContext, LoadingContext } from '../../Contexts';
import { useHistory } from 'react-router-dom';

const ErrorMessage = styled.div`
  color: red;
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');

  const {setUserData} = useContext(AuthContext);
  const {setLoading} = useContext(LoadingContext)
  const history = useHistory();


  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    login(username, password).then(json => {
      if (!json.ok) {
        setLoading(false)
        return setErrMessage(json.message);
      }
      
      getMe().then(response => {
        if (response.ok !== 1 ) {
          setUserData(null)
          setLoading(false)
          return setErrMessage(json.message);
        }
        setUserData(response)
        history.push('/')
      })
    })
  };

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
