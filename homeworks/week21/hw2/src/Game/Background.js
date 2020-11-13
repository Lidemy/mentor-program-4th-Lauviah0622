import styled from "styled-components";

const Frame = styled.div`
  pointer-events: none;
  height: 100%;
  display: grid;
  position: absolute;
  left: 15px;
  top: 15px;
  grid-template-rows: repeat(18, 30px);
  grid-template-columns: repeat(18, 30px);
  box-sizing: border-box;
  & > div {
    border-top: 1px solid black;
    border-right: 1px solid black;
  }

  & > div:nth-of-type(18n + 1) {
    /* border-bottom: 1px solid black; */
    border-left: 1px solid black;
  }

  & > div:nth-last-of-type(-n + 18) {
    border-bottom: 1px solid black;
  }
`;

export default function Background({ rows, columns }) {
  const squares = Array((rows - 1) * (columns - 1))
    .fill("")
    .map((_, id) => {
      return <div key={"brd-" + id}></div>;
    });
    // 這裡因為沒有用到 map 的第一個參數就用 _ 來命名，之前好像有看過這樣的用法？不知道用的正不正確
  return <Frame>{squares}</Frame>;
}
