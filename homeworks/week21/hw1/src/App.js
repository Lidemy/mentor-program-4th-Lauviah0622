import styled from "styled-components";
import { useState } from "react";
import Header from "./Header";
import Todolist from "./Todolist";
import { Button } from "./Utils";

const AppWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  margin: 50px auto 50px auto;
  background-color: #fefefe;
  box-shadow: 5px 5px 20px #cccccc;
  border-radius: 10px;
  width: 512px;
  top: 20%;
  & * {
    box-sizing: border-box;
  }
`;

const createTodo = (function () {
  let counter = 1;
  return function (content) {
    return {
      id: counter++,
      content,
      isDone: false,
    };
  };
})();

const Filter = styled.div`
  position: absolute;
  background-color: white;
  left: -70px;
  top: 50px;
  background-color: #fefefe;
  box-shadow: 3px 3px 10px #cccccc;
  border-radius: 7px;
  margin: 2px 0px;
`;

const FilterButton = styled(Button)`
  font-size: 1em;
  margin: 8px 10px;
  padding: 1px 1px 1px 5px;
`;

function App() {
  const [todosData, setTodosData] = useState([createTodo("讓你試試看")]);
  const [filterState, setFilterState] = useState(null);

  const addToto = (content) => {
    setTodosData([
      createTodo(content.length === 0 ? "忙些事兒" : content),
      ...todosData,
    ]);
  };

  const deleteTodo = (id) => {
    setTodosData(todosData.filter((todo) => todo.id !== id));
  };

  const updateTodoContent = (id, content) => {
    setTodosData(
      todosData.map((todo) => {
        if (id !== todo.id) return todo;
        return {
          ...todo,
          content: content,
        };
      })
    );
  };

  const toggleTodoDone = (id) => {
    setTodosData(
      todosData.map((todo) => {
        if (id !== todo.id) return todo;
        return {
          ...todo,
          isDone: !todo.isDone,
        };
      })
    );
  };

  const setFilter = (mode) => {
    setFilterState(mode);
  };

  const filtedTodosData = todosData.filter((todo) => {
    if (!filterState) return true;
    if (filterState === "done") return todo.isDone;
    if (filterState === "undone") return !todo.isDone;
  });

  return (
    <AppWrapper>
      <Header addToto={addToto} />
      <Todolist
        todosData={filtedTodosData}
        deleteTodo={deleteTodo}
        updateTodoContent={updateTodoContent}
        toggleTodoDone={toggleTodoDone}
      />
      <Filter>
        <FilterButton onClick={() => setFilter("done")}>✔</FilterButton>
        <FilterButton
          style={{ fontSize: "1.5em" }}
          onClick={() => setFilter("undone")}
        >
          ⨯
        </FilterButton>
        <FilterButton onClick={() => setFilter(null)}>All</FilterButton>
      </Filter>
    </AppWrapper>
  );
}

export default App;
