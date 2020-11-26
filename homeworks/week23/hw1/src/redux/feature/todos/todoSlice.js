import { createSlice } from "@reduxjs/toolkit";

const createTodo = (function () {
  let counter = 1;
  return function (content) {
    return {
      id: counter++,
      content: content.length === 0 ? "忙些事兒" : content,
      isDone: false,
    };
  };
})();

const getTodosIndex = (todoState, id) => {
  return todoState.findIndex((todo) => todo.id === id);
};

const todoSlice = createSlice({
  name: "todos",
  initialState: [createTodo("讓你試試看")],
  reducers: {
    // reducer 裡面的 method 可以用 mutable 了
    // 在背後，它會幫我們加進去 createReducer 裡面，然後 createReducer 會用 immer Library 幫我們處理 immutable 的問題，讓我們可以用 mutable 寫 immutable
    addTodo(state, action) {
      state.push(createTodo(action.payload.content));
    },
    deleteTodo(state, action) {
      const todoIndex = getTodosIndex(state, action.payload.id);
      state.splice(todoIndex, 1);
    },
    updateTodo(state, action) {
      const { content, id } = action.payload;
      const todoIndex = getTodosIndex(state, id);
      state[todoIndex].content = content;
    },
    toggleTodo(state, action) {
      const todoIndex = getTodosIndex(state, action.payload.id);
      state[todoIndex].isDone = !state[todoIndex].isDone;
    },
  },
});

export const {
  addTodo,
  deleteTodo,
  updateTodo,
  toggleTodo,
} = todoSlice.actions;

export default todoSlice.reducer;
/*
上面會自動幫我們生出下面這些東西，太神拉


{
  name: "todos",
  reducer: (state, action) => newState,
  actions: {
    addTodo: (payload) => ({type: "todos/addTodo", payload}),
    toggleTodo: (payload) => ({type: "todos/toggleTodo", payload})
  },
  caseReducers: {
    addTodo: (state, action) => newState,
    toggleTodo: (state, action) => newState,
  }
}
*/
