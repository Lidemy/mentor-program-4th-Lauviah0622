import styled from "styled-components";

const Button = styled(ButtonComponent)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.padding.m};
  font-size: 1.5rem;
  height: 100%;
  user-select: none;
  cursor: pointer;
  transform: scale(1, 1);
  transform-origin: center center;
  transition: 0.2s;
  outline: none;
  border-radius: 2px 2px 2px 2px;

  & div {
    transform: scale(1, 1) translateX(-1px);
    transition: transform 0.1s ease-in-out, text-shadow 0.1s ease-in-out;
  }

  &:hover div {
    transform: scale(1.1, 1.1) translateX(-1px);
    text-shadow: 1px 0px 1px #00000022;
  }

  &:active div {
    transform: scale(1.2, 1.2) translateX(-1px);
  }
`;

// function ButtonComponent({ children, className, onClick, onKeyDown}) {
//   return (
//     <div
//       // {...props}
//       className={className}
//       onClick={e => onClick == null || onClick(e)}
//       onKeyDown={e => onKeyDown(e)}
//     >
//       <div>{children}</div>
//     </div>
//   );
// }
function ButtonComponent(props) {
  return (
    <div
      {...props}
      // className={className}
      // onClick={e => onClick == null || onClick(e)}
      // onKeyDown={e => onKeyDown(e)}
    >
      <div>{props.children == null ||props.children }</div>
    </div>
  );
}

export { Button };
