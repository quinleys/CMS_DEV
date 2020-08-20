import axios from 'axios';
import { CLIENT_LOADING, GET_CLIENT_PERIODS } from "./types"
import { returnErrors } from './errorActions';

export const getPeriods = () => (dispatch) => {
    console.log('client_id',localStorage.getItem('client_id'))
    dispatch({type: CLIENT_LOADING})
    axios.get('https://127.0.0.1:8000/api/periods?customer=' + localStorage.getItem('client_id') ,{ headers: { Authorization: "Bearer " + localStorage.getItem('token') } })
    .then(res => {
        console.log(res.data)
        dispatch({
            type: GET_CLIENT_PERIODS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(returnErrors(err.response))
    })
}