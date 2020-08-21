import {  ADD_ITEM, GET_PERIODS, SUCCESS, GET_CUSTOMER_ITEMS, PERIODS_LOADING,FAILED_PERIODS, ITEMS_LOADING,GET_ITEM,CLEAR_ADDED,GET_ITEMS_DATE,CALENDAR_LOADING, MATERIALS_LOADING, GET_MATERIALS, GET_CUSTOMERS, FAILED_ITEMS, CUSTOMERS_LOADING, GET_ITEMS} from './types'
import axios from 'axios';
import { returnErrors, notAllowed, notFound, returnItemError, failedUpdate, redirectToLogin } from './errorActions';
import { logout } from './authActions';
import { toast } from 'react-toastify';

export const getItems = () => (dispatch) => {
    if(localStorage.getItem('id') !== null){
    dispatch(setItemsLoading());

    axios.get('https://127.0.0.1:8000/api/posts?pagination=true&itemsPerPage=10&user=' + localStorage.getItem('id') + '&order[date]=DESC', { headers: { Authorization: "Bearer " + localStorage.getItem('token') } } )
    .then(res => {
       dispatch({
           type: GET_ITEMS,
           payload: res
       })
    }).catch(err => {

        dispatch(returnErrors(err.response, err.response))
        dispatch({
            type: FAILED_ITEMS
        })
        
    })
}
};

export const getCustomerItems = (customer) => (dispatch) => {
    
    dispatch(setItemsLoading());
    axios.get('https://127.0.0.1:8000/api/posts?user=' + localStorage.getItem('id') + '&customer=' + customer ,{ headers: { Authorization: "Bearer " + localStorage.getItem('token') } } )
    .then(res => {
       dispatch({
           type: GET_CUSTOMER_ITEMS,
           payload: res.data
       })
    }).catch(err => {

        dispatch(returnErrors(err.response, err.response))
        dispatch({
            type: FAILED_ITEMS
        })
        
    })
}
export const loadNextPage = (page) => (dispatch) => {
    
    dispatch(setItemsLoading());

    axios.get('https://127.0.0.1:8000/api/posts?pagination=true&itemsPerPage=10&user=' + localStorage.getItem('id') + '&order[date]=DESC' + '&page=' + page, { headers: { Authorization: "Bearer " + localStorage.getItem('token') } } )
    .then(res => {
       dispatch({
           type: GET_ITEMS,
           payload: res
       })
    }).catch(err => {

        dispatch(returnErrors(err.response, err.response))
        dispatch({
            type: FAILED_ITEMS
        })
        
    })
};
export const getItem = id => (dispatch) => {
    dispatch(setItemsLoading());

    axios.get('https://127.0.0.1:8000/api/posts/' + id, {headers: { Authorization: "Bearer " + localStorage.getItem('token') }})
    .then(res => {
        if(res.data.user.id == localStorage.getItem('id') || localStorage.getItem('userRole') == 'ROLE_ADMIN' ){
        dispatch({
            type: GET_ITEM,
            payload: res.data
        })
    }else{
        dispatch(notAllowed())
    }
    }).catch(err => {
        if(err.response == 404){
            dispatch(notFound())
        }
        dispatch(returnErrors(err.response, err.response))
        
        dispatch({
            type: FAILED_ITEMS
        })
    })
}
export const clearAddedsuccess = () => (dispatch) => {
    return {
        type: CLEAR_ADDED
    }
}
export const addItem = item  => (dispatch) => {
    axios.post('https://127.0.0.1:8000/api/posts', item, { headers: { Authorization: "Bearer " + localStorage.getItem('token') }})
    .then(res => {
        dispatch({ 
            type: ADD_ITEM, 
            payload: res.data
        })
        dispatch(getItems())
        toast.success('🥳 Nieuwe werkbon aangemaakt!');
    }
        ).catch(err => {
            if(err.response.status == 401){
                dispatch(logout())
            }else{
            dispatch(returnItemError(err.response))}})
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    }
}
export const setCustomersLoading = () => {
    return {
        type: CUSTOMERS_LOADING
    }
}

export const setMaterialsLoading = () => {
    return {
        type: MATERIALS_LOADING
    }
}
export const setPeriodsLoading = () => {
    return {
        type: PERIODS_LOADING
    }
}
export const getPeriods = (id) => (dispatch) => {
    dispatch(setMaterialsLoading());
    axios.get('https://127.0.0.1:8000/api/customers/' + id, { headers: { Authorization: "Bearer " + localStorage.getItem('token') }})
    .then(res => {
        if(res.data.periods.length >= 1){
            dispatch({
                type: GET_PERIODS,
                payload: res.data.periods
            })
        }else{
            dispatch({
                type: GET_PERIODS,
                payload: 'no periods'
            })
        }
    }).catch(err => {
        dispatch({
            type: FAILED_PERIODS
        })
    })
}
export const editItem = (item,id) => (dispatch) => {
    axios.put('https://127.0.0.1:8000/api/posts/' + id, item, { headers: { Authorization: "Bearer " + localStorage.getItem('token')}})
    .then(res => {
        dispatch({
            type: GET_ITEM,
            payload: res.data
        })
        toast.success('🥳 Update succesvol');
    }).catch(err => {
        if(err.response == 404){
            dispatch(notFound())
        }
        dispatch(returnItemError(err.response))
        
        dispatch({
            type: FAILED_ITEMS
        })
    })

}
export const getMaterials = () => (dispatch) => {

    if(localStorage.getItem('id') !== null){
        dispatch(setMaterialsLoading());
    axios.get('https://127.0.0.1:8000/api/materials', { headers: { Authorization: "Bearer " + localStorage.getItem('token') }} )
    .then(res => dispatch({
        type: GET_MATERIALS,
        payload: res.data
    })).catch(err => {
        
        dispatch(returnErrors(err.response, err.response))
        dispatch({
            type: FAILED_ITEMS
        })
    })
    }
}

export const getCustomers = () => (dispatch) => {
    if(localStorage.getItem('id') !== null){
    dispatch(setCustomersLoading());
    axios.get('https://127.0.0.1:8000/api/customers', { headers: { Authorization: "Bearer " +  localStorage.getItem('token') }} )
    .then(res => {
        dispatch({
        type: GET_CUSTOMERS,
        payload: res.data
    })
}).catch(err => {
     if(err.response.status == 401){
        dispatch(logout())
    }else{

    
        dispatch(returnErrors(err.response, err.response))
        dispatch({
            type: FAILED_ITEMS
        })
    }
    })
}
}

export const getItemsDate = (url) => (dispatch) => {
    dispatch(setCalendarLoading());
    axios.get('https://127.0.0.1:8000/api/posts?user=' + localStorage.getItem('id') + url, { headers: { Authorization: "Bearer " + localStorage.getItem('token') }} )
    .then(res => {

        dispatch({
            type: GET_ITEMS_DATE,
            payload: res.data
        })
    }).catch( err => {
        dispatch(returnErrors(err.response, err.response))
        dispatch({
            type: FAILED_ITEMS
        })
    })
}

export const setCalendarLoading = () => (dispatch) => {
    dispatch({
        type: CALENDAR_LOADING
    })
}

