import axios from 'axios';
import { returnErrors, clearErrors, failedProfile, returnLoadUser, returnWrongRole } from './errorActions';
import { toast } from 'react-toastify';
import { USER_LOADED, PROFILE,LOAD_FAIL,PROFILE_FAIL,UPDATE_PROFILE,  USER_LOADING, LOGIN_FAIL, AUTH_LOADING, LOGOUT_SUCCESS , LOGIN_SUCCES, LOGIN_TOKEN, NOT_LOGGEDIN } from "./types";

// check token & load user
export const loadUser = () => (dispatch) => {
    // User Loading
    dispatch({type: USER_LOADING});
    
    axios.get('https://127.0.0.1:8000/api/users/' + localStorage.getItem('id'), { headers: { Authorization: "Bearer " + localStorage.getItem('token') } })
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            console.log('we zijn hier')
            dispatch(returnLoadUser(err.response, err.response));
            dispatch({
                type: LOAD_FAIL
            })
        })
}

export const getProfile = () => (dispatch) => {
    dispatch({type: USER_LOADING});

    axios.get('https://127.0.0.1:8000/api/users/' + localStorage.getItem('id'), { headers: { Authorization: "Bearer " + localStorage.getItem('token') } })
    .then(res => dispatch({
        type: PROFILE,
        payload: res.data
    })).catch(err => {
        console.log('we zijn hier')
        dispatch(returnErrors(err.response, err.response));
        dispatch({
            type: PROFILE_FAIL
        })
    })
}
export const updateProfile = (item) => (dispatch) => {
    dispatch({type: USER_LOADING});
    console.log(item)
    axios.put('https://127.0.0.1:8000/api/users/' + localStorage.getItem('id'), item, { headers: { Authorization: "Bearer " + localStorage.getItem('token') }})
    .then(res => {
      
        dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
    })
    toast.success('🥳 Update succesvol');
}).catch( err => {
        console.log(err.response)
        dispatch(failedProfile(err.response.data.response, err.response));
        dispatch({
            type: PROFILE_FAIL
        })
    })
}
// user login
export const login = ({username, password}) => (dispatch) => {
    
    // header
    const config = {
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({username, password});
    dispatch(setAuthLoading())
    dispatch(clearErrors())
    axios.post('https://127.0.0.1:8000/api/login_check', body, config)
    .then(res => {
        console.log(res.data.token)
        console.log(res)
        dispatch({
        type: LOGIN_TOKEN,
        payload: res.data
    })})
    .catch(err => {
        console.log('we zijn hier')
        dispatch(returnErrors(err.response, err.response, 'LOGIN_FAIL'));
        dispatch({
            type: LOGIN_FAIL
        })
    }).then(() => {
        axios.get('https://127.0.0.1:8000/api/users/',{ headers: { Authorization: "Bearer " + localStorage.getItem('token')} })
        .then(res => {
            console.log(res);
            // console.log(res.data['hydra:member'])
            res.data['hydra:member'].forEach(element => {
                // console.log(element.username)
                
                if(element.username === username){
                    console.log('element',element.roles)
                    if(element.roles == 'ROLE_USER' || element.roles == "ROLE_ONDERAANNEMER"){
                        dispatch({
                            type: LOGIN_SUCCES,
                            payload: element
                        })
                    }else{
                        
                      dispatch(returnErrors('Deze app is enkel voor werknemers of onderaannemers', 'Foute role', 'LOGIN_WRONGROLE'))
                      dispatch({
                          type: LOGOUT_SUCCESS
                      })
                    }
                }
                
            });
        }).catch(err => {
           
            dispatch(returnLoadUser(err.response, err.response, 'LOGIN_FAIL'));
        })
        
    })
}

//logout user 

export const logout = () => (dispatch) => {
    console.log('log out ')
    dispatch({
 
        type: LOGIN_FAIL
    
    })
}
export const setAuthLoading = () => {
    return {
        type: AUTH_LOADING
    }
}
// Setup config headers and token
export const tokenConfig = () => (/* getState */) => {
    
    // get token from localstorage
    /* const token = getState().auth.token; */
    const token = localStorage.getItem('token')
    // Headers
    const config = {
        headers: {
            "Content-type" : "application/json"
        }
    }
    //if token, add to headers
    if(token){
        config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
} 