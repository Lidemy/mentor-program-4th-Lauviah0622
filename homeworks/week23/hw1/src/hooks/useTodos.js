import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {addTodo as addTodoAction, deleteTodo as deleteTodoAction, updateTodo, toggleTodo} from '../redux/feature/todos/todoSlice';

const filtTodolistData = (todosData, filterState) => {
  return todosData.filter(todo => {
    if (filterState === "done") return todo.isDone;
    if (filterState === "undone") return !todo.isDone;
    return true;
  });
};

const useDispatchCallback = (callback) => {
  const dispatch = useDispatch();
  return useCallback(callback, [dispatch])

}

function useToolkitTodos() {
  const todosData = useSelector(store => {
    return filtTodolistData(store.todos, store.filterState);
  });

  const dispatch = useDispatch();

  const addTodo = useDispatchCallback((content) => {
    dispatch(addTodoAction({content}));
  })
  
  const deleteTodo = useDispatchCallback(
    (id) => {
      dispatch(deleteTodoAction({id}));
    })

  const updateTodoContent = useDispatchCallback(
    (id, content) => {
      dispatch(updateTodo({id, content}));
    }
    );

  const toggleTodoDone = useDispatchCallback(id => {
    dispatch(toggleTodo({id}));
  });

  
  // 這裡有想說能不能把 useCallback(func, [dispatch]) 抽成一個 fucntion，可是 hook 只能用在 最頂層

  return {
    todosData,
    addTodo,
    deleteTodo,
    updateTodoContent,
    toggleTodoDone,
  }
}

export default useToolkitTodos;
