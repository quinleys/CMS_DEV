import React from 'react'
import { Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    
        return (
            <Route 
            {...rest}
            render={props => {
                if(localStorage.getItem('authenticated') && localStorage.getItem('userRole') == "ROLE_USER" || localStorage.getItem('userRole') == "ROLE_ONDERAANNEMER"){
                    return <Component {...props} />
                }else{
                    return <Redirect to={
                        {
                            pathname: "/login",
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }}
            />
        )
    
}
    
