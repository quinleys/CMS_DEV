import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux';
import { logout } from '../../actions/authActions';
import { NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom'
class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired
    }

    render() {
        return (
         
                <div onClick={this.props.logout} className="my-2" href="/login" style={{color: "#9147ff"}}>
                    <Link to="/login">
                <ExitToAppIcon /> Logout
                </Link>
                </div>
     
        )
    }
}
export default connect(
    null,
    { logout }
)(Logout);