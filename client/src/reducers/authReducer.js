import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCES,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGIN_TOKEN,
    NOT_LOGGEDIN,
    AUTH_LOADING,
    PROFILE,
    UPDATE_PROFILE,
    LOAD_FAIL,
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: localStorage.getItem('authenticated'),
    isLoading: false,
    user: localStorage.getItem('user'),
    profile: [],
    
    
}

export default function (state = initialState, action ){
    switch(action.type){
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case USER_LOADED:
            console.log('roles',action.payload.roles)
            localStorage.setItem('id', action.payload.id);
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
                userRole: action.payload.roles
            };

        case LOGIN_TOKEN:
            localStorage.setItem('token', action.payload.token);
            // console.log(action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
            };
        case PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            }
        case UPDATE_PROFILE: 
            return {
                ...state,
                profile: action.payload,
                loading: false,
            }
        case LOGIN_SUCCES:
            // console.log(action.payload.email)
            console.log('login succes', action.payload)
            localStorage.setItem('user-email', action.payload.email);
            localStorage.setItem('id', action.payload.id);
            localStorage.setItem('username', action.payload.username);
            localStorage.setItem('authenticated', true);
            localStorage.setItem('userRole', action.payload.roles);
            return {
                ...state,
                ...action.payload,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                userRole: action.payload.roles
            };
        case NOT_LOGGEDIN:
            return {
                ...state,
                isAuthenticated:false,
                isLoading:false,
            };
        case LOAD_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
            console.log('logout delete everything')
            localStorage.removeItem('user-email');
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            localStorage.removeItem('authenticated');
            localStorage.removeItem('userRole');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                userRole: null,
            };
        case LOGOUT_SUCCESS:
                console.log('logout delete everything')
                localStorage.removeItem('user-email');
                localStorage.removeItem('id');
                localStorage.removeItem('username');
                localStorage.removeItem('authenticated');
                localStorage.removeItem('userRole');
                return {
                    ...state,
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    userRole: null,
                };   
        case AUTH_LOADING:
            return {
                ... state,
                isLoading: true
            }
        default:
            return state; 
    }
}