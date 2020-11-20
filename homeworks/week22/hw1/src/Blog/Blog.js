import styled from "styled-components";
import { useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { AuthContext, LoadingContext } from "./Contexts";
import { getMe } from "./WebAPI";

import Header from "./Header";
import About from "./Pages/About";
import Article from "./Pages/Post";
import Newpost from "./Pages/Newpost";
import Login from "./Pages/Login";
import List from "./Pages/List";
import Signup from "./Pages/Signup";

const Root = styled.div``;

const Main = styled.main`
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const StyledLoadingModal = styled.div`
  height: 100vh;
  width: 100vw;
  z-index: 1;
  font-size: 30px;
  color: white;
  background-color: #000000aa;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center
`;

export default function Blog() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getMe().then((response) => {
      if (response.ok !== 1) {
        return setLoading(false);
      }
      setUserData(response);
      return setLoading(false);
    });
  }, []);
  

  return (
    <Router>
      <Root>
        <AuthContext.Provider value={{ userData, setUserData }}>
          <LoadingContext.Provider value={{ loading, setLoading }}>
            {loading && <StyledLoadingModal>Loading</StyledLoadingModal>}
            <Header />
            <Main>
              <Switch>
                <Route exact path="/">
                  <List />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/post/:id" component={Article}></Route>
                <Route path="/signup">
                  <Signup />
                </Route>
                <Route path="/newpost">
                  <Newpost />
                </Route>
              </Switch>
            </Main>
          </LoadingContext.Provider>
        </AuthContext.Provider>
      </Root>
    </Router>
  );
}
