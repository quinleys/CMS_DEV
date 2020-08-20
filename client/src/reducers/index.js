
import errorReducer from './errorReducer';
import authReducer from './authReducer'; 
import itemReducer from './itemReducer';
import clientReducer from './clientReducer'

import { combineReducers } from 'redux';

export default combineReducers({
    item: itemReducer,
    auth: authReducer,
    error: errorReducer,
    client: clientReducer
});
