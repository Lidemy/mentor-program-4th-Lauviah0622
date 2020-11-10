import styled from "styled-components";

import Form from './Form';

const AppWrapper = styled.div`
  /* border-top: 8px solid #fad312; */
  padding: 35px 42px;
  margin: 128px auto;
  width: 645px;
  position: relative;
  box-shadow: 1.8px 2.4px 5px rgba(0, 0, 0, 0.3);
  background-color: #fff;

  &::before {
    content: "";
    top: 0;
    left: 0;
    display: block;
    position: absolute;
    height: 8px;
    width: 100%;
    background-color: var(--primary-color);
  }
`;

const StyledFoorter = styled.footer`
  bottom: 0;
  line-height: 60px;
  vertical-align: middle;
  text-align: center;
  font-size: 13px;
  background-color: #000;
  border-top: 3px solid var(--primary-color);
  color: #fff;
`;

const Header = styled.h1``;

const Info = styled.div`
  white-space: pre-line;
  & > .alert {
    display: block;
    color: red;
    padding-bottom: 0;
  }
`;



const Reminder = styled.p`
  font-size: 14px;
  margin-top: 21px;
`;
function App() {
  return (
    <>
      <AppWrapper>
        <Header>新拖延運動報名表單</Header>
        <Info>
          {`活動日期：2020/12/10 ~ 2020/12/11
          活動地點：台北市大安區新生南路二段1號
          `}
          <h4 className="alert">{`*必填`}</h4>
        </Info>
        <Form/>
        <Reminder>請勿透過表單送出您的密碼</Reminder>
      </AppWrapper>
      <StyledFoorter>© 2020 © Copyright. All rights Reserved.</StyledFoorter>
    </>
  );
}

export default App;
