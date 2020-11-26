import { combineReducers } from 'redux';

import todosReducer from '../feature/todos/todoSlice';
import filterReducer from '../feature/filter/filterSlice';


export default combineReducers({
    todos: todosReducer,
    filterState: filterReducer
})
