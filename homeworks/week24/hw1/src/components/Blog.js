import styled from "styled-components";
import { useEffect } from "react";
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Header from "./Header";
import About from "../Pages/About";
import Article from "../Pages/Post";
import Newpost from "../Pages/Newpost";
import Login from "../Pages/Login";
import List from "../Pages/List";
import Signup from "../Pages/Signup";
import Update from "../Pages/Update";

import { useSelector, useDispatch } from "react-redux";
import { getMeData } from "../redux/features/auth/authSlice";

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
  align-items: center;
`;

export default function Blog() {
  const isLoading = useSelector((store) => store.fetchState.isLoading);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMeData());
  }, []);

  // 這個 component 會 重複 render，該如何優化？

  return (
    <Router>
      <Root>
          {isLoading && <StyledLoadingModal>Loading</StyledLoadingModal>}
          <Header />
          <Main>
            <Switch>
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
              <Route path="/update/:id" component={Update}></Route>
              <Route exact path="/">
                <List />
              </Route>
              {/* 跳轉到非上述 url 會被導回 / */}
              <Redirect to='/'/>
            </Switch>
          </Main>
      </Root>
    </Router>
  );
}
