import { GET_ERRORS,LOAD_USER_FAIL,PROFILE_ERROR,REDIRECT_TO_LOGIN, UPDATE_ERROR,CLEAR_ERRORS,ITEM_ERROR, NOT_ALLOWED, NOT_FOUND } from './types';

// return errs
export const returnErrors = (msg, status, id) => {
    return {
        type: GET_ERRORS,
        payload: {msg, status, id}
    }
}
export const returnLoadUser = (msg, status, id) => {
    return {
        type: LOAD_USER_FAIL,
        payload: {msg, status, id}
    }
}
export const returnItemError = (err) => {
    return {
        type: ITEM_ERROR,
        payload: err
    }
}
export const failedProfile = (msg) => {
    return {
        type: PROFILE_ERROR,
        payload: msg
    }
}
export const failedUpdate = (msg) => {
    return {
        type: UPDATE_ERROR,
        payload: msg,
    }
}
// clear err
export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}
export const notFound = () => {
    return{
        type: NOT_FOUND
    }
}
export const notAllowed = () => {
    return {
        type: NOT_ALLOWED
    }
}
export const redirectToLogin = () => {
    return {
        type: REDIRECT_TO_LOGIN
    }
}