import styled from "styled-components";

import Background from "./Background";
import { useContext, useEffect } from 'react';
import GameContext from '../Context';

function Cell({ className, x, y, player }) {
  return (
    <div className={className} data-x={x} data-y={y} data-player={player}>
      <div></div>
    </div>
  );
}

const StyledCell = styled(Cell)`
  width: 30px;
  height: 30px;
  position: relative;
  padding: 5px;
  font-size: 30px;
  & > div {
    pointer-events: none;
    width: 100%;
    height: 100%;
    background-color: ${(props) =>{
      if (!props.player) return 'transparant'
      if (props.player === 'black') return "#000";
      if (props.player === 'white') return "#fff";
    }};
    border: 1px solid transparent;
    border-color: ${(props) => props.player && "black"};
    border-radius: 50%;
  }

  &:not([data-player]):hover > div {
    border-color: pink;
  }
`;

const StyledRows = styled.div`
  display: flex;
`;


function Game({ className, placeChess, chessChart, checkWin }) {
  const context = useContext(GameContext)

  const handleCellClick = (e) => {
    if (e.target.getAttribute('data-player')) return 
    placeChess(e.target.getAttribute('data-x'), e.target.getAttribute('data-y'))
  }

  const board = chessChart
    .map((row, y) => {
      const boardRow = row.map((player, x) => {
        return <StyledCell 
        key={`cell- + [${x}, ${y}]`}
        x={x}
        y={y}
        player={player}
        />;
      });
      return <StyledRows key={"row-" + y}>{boardRow}</StyledRows>;
    });

  useEffect(checkWin, [chessChart]);
  
  return (
    <div className={className}>
      <Background rows={context.rowsNum} columns={context.columnsNum} />
      <div onClick={handleCellClick}>{board}</div>
    </div>
  );
}

const StyledGame = styled(Game)`
  position: relative;
`;

export default StyledGame;
