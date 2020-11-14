import { useState } from "react";

import styled from "styled-components";
import Game from "./Game/Game";

import GameContext from "./Context";

const COLUMNS = 19;
const ROWS = 19;
const LINK_NUMBER = 5;

// 常數放在這邊

const AppWrapper = styled.div`
  margin: 50px auto;
  width: 600px;
`;

const createEmptyChart = () => Array(ROWS).fill(Array(COLUMNS).fill(null));
const makeChart = (recordArr) => {
  return Array(ROWS)
    .fill(null)
    .map((row, y) => {
      return Array(COLUMNS)
        .fill(null)
        .map((cell, x) => {
          let player = null;
          recordArr.forEach(
            (record) =>
              record.x === x && record.y === y && (player = record.player)
          );
          return player;
        });
    });
};

const StyledRecordBtn = styled(RecordBtn)`
  display: inline-block;
  border: 1px solid black;
  border-radius: 5px;
  margin: 5px;
`;

function RecordBtn({ record, index, className }) {
  return (
    <div className={className} date-record-id={index}>
      第{index}手<br/>
      {record.player}：{`${record.x}, ${record.y}`}
    </div>
  );
}

function App() {
  const [isGaming, setIsGaming] = useState(false);
  // const [chessChart, setChessChart] = useState(createEmptyChart());
  const [records, setRecord] = useState([]);
  const [winner, setWinner] = useState(null);
  const [playerState, setPlayerState] = useState({
    current: "black",
    next: "white",
  });
  const placeChess = (x, y) => {
    if (!isGaming) return;
    // const newChessChart = JSON.parse(JSON.stringify(chessChart));
    // newChessChart[y][x] = playerState.current;
    // setChessChart(newChessChart);
    // 上面是沒有存步驟的寫法
    setPlayerState({
      current: playerState.next,
      next: playerState.current,
    });
    setRecord([...records, { x: +x, y: +y, player: playerState.current }]);
  };

  const startGame = () => {
    setIsGaming(true);
    // setChessChart(createEmptyChart()); 
    // 上面是沒有存步驟的寫法
    setRecord([]);
    setWinner(null);
  };

  const surrenderGame = () => {
    setWinner(playerState.next);
    setRecord([]);
    setIsGaming(false);
  };

  const backInRecord = (id) => {
    // setRecord
    if (isGaming !== true) return
    setRecord(records.slice(0, +id + 1));
    if (playerState.next !== records[+id].player) {
      setPlayerState({
        current: playerState.next,
        next: playerState.current,
      })
    }
  }

  const checkWin = () => {
    if (!isGaming) return;
    let chesses = [];
    makeChart(records).forEach((row, rowId) => {
      row.forEach((cell, columnId) => {
        if (cell !== playerState.next) return;
        chesses.push([columnId, rowId]);
      });
    });

    let isWin = false;
    chesses.forEach((chess, i, chesses) => {
      let ninjaInChess = ([x, y]) => chesses.reduce((res, chess) => {
        return res || chess[0] === x && chess[1] === y 
      }, false);
      // 嘗試一下很不直覺的寫法 XD，下面是原版

      const inChesses = ([x, y]) => {
        let res = false;
        chesses.forEach((chess) => {
          if (chess[0] === x && chess[1] === y) res = true;
        });
        return res;
      };

      const dirs = [
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, 1],
      ];

      // 可能有連線方向的格子
      let dirCells = dirs.map((dir) => ({
        rootChess: chess,
        dir,
        cell: [chess[0] + dir[0], chess[1] + dir[1]],
      }));

      for (let i = 0; i < LINK_NUMBER - 1; i++) {
        // 可能方向的棋子
        let linkChesses = dirCells.filter((cell) => ninjaInChess(cell.cell));
        // 可能方向的下一個格子
        let nextDirCells = linkChesses.map(({ rootchess, dir, cell }) => ({
          rootChess: cell,
          dir,
          cell: [cell[0] + dir[0], cell[1] + dir[1]],
        }));
        dirCells = nextDirCells;
        if (nextDirCells.length <= 0) break;
      }

      if (dirCells.length > 0) {
        isWin = true
      }
    });
    if (isWin) {
      setIsGaming(false);
      setWinner(playerState.next);
    }
  };

  const recordButtons = records.map((record, i) => (
    <StyledRecordBtn record={record} index={i} key={`recordBtn-${i}`} />
  ));

  const handleClickRecord = (e) => {
    if (!e.target.getAttribute('date-record-id')) return 
    backInRecord(e.target.getAttribute('date-record-id'));
  }

  return (
    <GameContext.Provider value={{ rowsNum: ROWS, columnsNum: COLUMNS }}>
      <AppWrapper>
        <header>
          {isGaming || <h3>Press Start to Start Game</h3>}
          {isGaming && (
            <h3>
              Current Player: {playerState.current}, Next Player:{" "}
              {playerState.next}
            </h3>
          )}
          <h3>{winner || "No body"} is win</h3>
          {isGaming || <button onClick={startGame}>Start</button>}
          {isGaming && <button onClick={surrenderGame}>Surrender</button>}
        </header>
        <Game
          placeChess={placeChess}
          chessChart={makeChart(records)}
          checkWin={checkWin}
        />
        <footer onClick={handleClickRecord}>{recordButtons}</footer>
      </AppWrapper>
    </GameContext.Provider>
  );
}

export default App;
