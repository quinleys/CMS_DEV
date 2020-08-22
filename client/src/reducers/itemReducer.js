import { GET_ITEMS,FAILED_PERIODS,CLEAR_ITEM,CUSTOMERS_LOADING, GET_CUSTOMER_ITEMS, GET_PERIODS, PERIODS_LOADING, CLEAR_ADDED,MATERIALS_LOADING, ADD_ITEM, GET_ITEM, ITEMS_LOADING, GET_CUSTOMERS, GET_MATERIALS, FAILED_ITEMS, CALENDAR_LOADING, GET_ITEMS_DATE } from '../actions/types'


const initialState = {
    items: [],
    item: [],
    customers: [],
    customerItems: [],
    materials: [],
    loading: false,
    customersloading: false,
    materialsloading: false,
    addedSucces: false,
    periodsloading: false,
    calendarloading: false,
    calendarItems: [],
    periods: [],
    succes: false,
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_ITEMS:
            return {
                ...state,
                items: action.payload,
                addedSucces: false,
                loading: false,
            };
        case CLEAR_ITEM: 
            return{
                ...state,
                item: [],
                loading: false
            }
        case ADD_ITEM:
            return {
                ...state,
                addedSucces: true,
                loading: false,
                succes: true,
            };
        case GET_CUSTOMER_ITEMS:
            return {
                ...state,
                loading: false,
                customerItems: action.payload
            }
        case ITEMS_LOADING:
            return {
                ...state,
                addedSucces: false,
                loading:true,
                succes: false,
            };
            case CLEAR_ADDED:
                return {
                    addedSucces: false,
                }
        case CUSTOMERS_LOADING: 
        return {
            ...state,
            customersloading: true
        }
        case GET_PERIODS: 
        return {
            ...state,
            periods: action.payload
        }
        case MATERIALS_LOADING:
            return{
                ...state,
                materialsloading: true,
            }
        case GET_ITEM:
            return {
                ...state,
                item: action.payload,
                addedSucces: false,
                loading: false
            }
        case PERIODS_LOADING: 
        return {
             ...state,
             periodsloading: true
        }
        case FAILED_PERIODS:
            return {
                ...state, 
                periodsloading: false,
            }
        case GET_CUSTOMERS:
            return {
                ...state,
                customers: action.payload
,                customersloading: false,
            }
        case GET_MATERIALS:
            return {
                ...state,
                materials: action.payload,
                materialsloading: false,
            }
        case FAILED_ITEMS:
            return{
                ...state,
                addedSucces: false,
                loading:false,
                succes: false,
            }
        case GET_ITEMS_DATE:
            return{
                ...state,
                calendarItems: action.payload,
                loading: false
            }
        case CALENDAR_LOADING:
            return {
                ...state,
                calendarItems: [],
                calendarloading: true
            }

        default:
            return state;
    }
}