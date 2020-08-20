import {  GET_CLIENT_PERIODS, CLIENT_LOADING} from '../actions/types';

const initialState = {
    periods: [],
    periodeLoading: false
}

export default function(state = initialState, action){

    switch(action.type){
        case GET_CLIENT_PERIODS:
            console.log(action.payload, 'reducer')
            return {
                ...state,
                periodeLoading: false,
                periods: action.payload
            }
        case CLIENT_LOADING: {
            console.log('loading')
            return {
                ...state,
                periodeLoading: true
            }
        }
        default:
            return state;
    }
}