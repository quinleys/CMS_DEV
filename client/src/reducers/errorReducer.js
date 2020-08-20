import { GET_ERRORS,LOAD_USER_FAIL, CLEAR_ERRORS,PROFILE_ERROR, NOT_ALLOWED, ITEM_ERROR, UPDATE_ERROR, REDIRECT_TO_LOGIN } from '../actions/types';
import { returnErrors } from '../actions/errorActions';

const initialState = {
    msg: {},
    status: null,
    id: null,
    notAllowed: false,
    itemError: null,
    profileError: null,
    updateError: null,
    redirectToLogin : false,
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_ERRORS:
            return{
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id
            };
        case NOT_ALLOWED: 
            return {
                notAllowed: true,
            }
        case LOAD_USER_FAIL: {
            return {
                redirectToLogin: true,
            }
        }
        case CLEAR_ERRORS:
            return {
                msg: {},
                status: null,
                id: null,
                notAllowed: false,
                itemError: null,
                profileError: null,
                updateError: null,
                redirectToLogin: false,
            };
        case UPDATE_ERROR:
            return {
                updateError: action.payload
            }
        case ITEM_ERROR:
            return{
                itemError: action.payload
            }
        case PROFILE_ERROR:
            return{
                profileError: action.payload
            }
        case REDIRECT_TO_LOGIN:
            return {
                redirectToLogin: true
            }
        default:
            return state;

    }
}