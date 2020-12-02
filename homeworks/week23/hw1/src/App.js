import styled from "styled-components";
import useTodos from './hooks/useTodos';
import useFilter from "./hooks/useFilter";
import Todolist from "./components/Todolist";
import Header from "./components/Header";
import Filter from './components/Filter';



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


function App() {
  const [setFilter] = useFilter();
  const {todosData, 
    addTodo, 
    deleteTodo, 
    updateTodoContent, 
    toggleTodoDone
  } = useTodos();

  return (
    <AppWrapper>
      <Header addToto={addTodo} />
      <Todolist
        todosData={todosData}
        deleteTodo={deleteTodo}
        updateTodoContent={updateTodoContent}
        toggleTodoDone={toggleTodoDone}
      />
      <Filter setFilter={setFilter}/>
    </AppWrapper>
  );
}

export default App;
