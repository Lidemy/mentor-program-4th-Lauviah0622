import { useRef } from "react";
import styled from "styled-components";
import { Button } from './Utils';

const HeaderWrapper = styled.div`
  border-radius: 10px 10px 3px 3px;
  overflow: hidden;
  background-color: ${(props) => props.theme.color.primary};
`;

const Title = styled.h1`
  text-align: center;
  color: #fefefe;
  font-size: 1.6rem;
  padding-top: 1em;
  padding-bottom: 0.5em;
  margin: 0;
  user-select: none;
`;

const InputBar = styled.div`
  display: flex;
  color: #fff;
  height: 60px;
  align-items: center;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  background-color: #0000;
  border: none;
  font-size: 0.9rem;
  padding: 5px 9px 0 5px;
  outline: none;
  color: inherit;
  border-radius: 2px;
  font-family: "Overpass", "Noto Sans TC", sans-serif;
  margin: ${(props) => props.theme.padding.m};
  border-bottom: 1px solid #fff;
  opacity: 0.8;
  transition: 0.2s;

  &:focus {
    background-color: #0001;
    text-shadow: 2px 0px 1px #00000022;
    opacity: 1;
  }

  &::placeholder {
    color: inherit;
  }
`;

const InputButton = styled(Button)`
  &:active div {
    transform: scale(1.2, 1.2) translateX(1px);
  }
`;





export default function Header({addToto}) {
  const inputRef = useRef()
  const handleInputChange = () => {
    // console.log(inputRef.current.value);
    
  }

  const handleButtonClick = (e) => {
    addToto(inputRef.current.value)
    inputRef.current.value = '';
    inputRef.current.focus();
  }



  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return 
    addToto(inputRef.current.value)
    inputRef.current.value = '';
    inputRef.current.focus();
  }

  return (
    <HeaderWrapper>
      <Title>TodoList</Title>
      <InputBar>
        <StyledInput 
        placeholder="有什麼要忙的嗎？" 
        ref={inputRef} 
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        />
        <InputButton
          onClick={handleButtonClick}
          tabIndex="enter"
        >»</InputButton>
      </InputBar>
     
    </HeaderWrapper>
  );
}
