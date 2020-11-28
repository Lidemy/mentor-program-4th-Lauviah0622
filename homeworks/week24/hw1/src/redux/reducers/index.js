import { combineReducers } from 'redux';
import fetchReducer from '../features/fetch/fetchSlice'
import authReducer from '../features/auth/authSlice';

export default combineReducers({
    fetchState: fetchReducer,
    authState: authReducer
})
