import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { setToken } from '../utils';

import { useSelector, useDispatch } from 'react-redux';
import { clearUserData } from '../redux/features/auth/authSlice';



const HeaderContainer = styled.header`
  display: flex;
  align-items: end;
  justify-content: space-between;
  /* max-width: 1000px; */
  padding: 0 100px;
  border-bottom: 1px solid #ccc;
  box-shadow: 2px 2px 2px #ccc;
`;

const NavList = styled.div`
  display: flex;
  list-style: none;
  text-decoration: none;
  align-items: center;
  height: 60px;
`;

const NavItem = styled(Link)`
  display: block;
  padding: 20px 16px;
  box-sizing: border-box;
  height: 100%;
  width: 100px;
  text-align: center;
  color: #333;

  ${(props) =>
    props.$active &&
    `
    background-color: #ddd;
  `}
`;

const Item = styled.div`
  display: block;
  padding: 20px 16px;
  box-sizing: border-box;
  height: 100%;
  width: 100px;
  text-align: center;
  color: #333;
  cursor: pointer;
`;


const Logo = styled.h1`
  margin: 0 16px;
  padding-top: 5px;
  height: 100%;
`;

const WelcomeMessage = styled.div``;

export default function Header() {
  let location = useLocation();
  const history = useHistory();

  const dispatch = useDispatch();
  const authState = useSelector(store => store.authState);
  const handleLogout = () => {
    dispatch(clearUserData());
    setToken(null)
    if (location.pathname === '/') return
    history.push('/')
  }
  return (
    <HeaderContainer>
      <NavList>
        <Logo>
          <Link to="/">Blog</Link>
        </Logo>
        <NavItem to="/" $active={location.pathname === "/"}>
          文章列表
        </NavItem>
        <NavItem to="/about" $active={location.pathname === "/about"}>
          About
        </NavItem>
      </NavList>
      <NavList>
        {authState.user ? (
          <>
            <WelcomeMessage>Hi, {authState.user.nickname}</WelcomeMessage>
            <NavItem to="/newpost">Newpost</NavItem>
            <Item onClick={handleLogout}>Logout</Item>
          </>
        ) : (
          <>
            <NavItem to="/login">Login</NavItem>
            <NavItem to="/signup">Signup</NavItem>
          </>
        )}
      </NavList>
    </HeaderContainer>
  );
}
