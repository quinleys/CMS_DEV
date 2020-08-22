import React, { Component, Fragment } from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
  } from 'reactstrap';
import LoginModal from '../Auth/LoginModal';
import Logout from '../Auth/Logout';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PersonIcon from '@material-ui/icons/Person';
import { Divider } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import { logout } from '../../actions/authActions';
class AppNavbar extends Component {
    state = {
        isOpen: false,
        menu: false,
        achor: null,
    }
    componentWillUnmount(){
        this.setState = {
            isOpen: false
        }
    }
       
    
    static propTypes = {
        auth: PropTypes.object.isRequired
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    handleClick = (e) => {
        this.setState({
            achor: e.currentTarget
        })
        this.togglemenu()
    }
    togglemenu = () => {
        
        this.setState({
            menu: !this.state.menu
        })
    }
    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <Fragment>
                <div className="d-none d-md-block">
                <NavItem button className="my-auto" onClick={(e) => this.handleClick(e)}>
                
                    <AccountCircleIcon className="my-auto purple" />
                  
                </NavItem>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.achor}
                    keepMounted
                    open={this.state.menu}
                    onClose={() => this.togglemenu()}
                    >
                    <MenuItem className="my-2" onClick={() => this.togglemenu()}> <Link to="/profile"> <PersonIcon /> Profiel</Link></MenuItem>
                    <MenuItem className="my-2" onClick={() => this.togglemenu()}> <Link to="/calendar"> <TodayIcon /> Kalender</Link></MenuItem>
                    <MenuItem onClick={() => this.togglemenu(), () => this.props.logout() }><Logout /></MenuItem>
                    </Menu>
                    </div>
                    <div className="d-sm-block d-md-none">
                    <NavItem className="my-2">
                    <NavLink  href="/profile">
                    
                        <h6><AccountCircleIcon className="my-auto"/>  Profiel</h6>
                        
                        </NavLink>
                        </NavItem>
                        <Divider />
                        <NavItem className="my-2">
                    <NavLink  href="/calendar">
                    
                        <h6><TodayIcon className="my-auto"/>  Kalender</h6>
                        
                        </NavLink>
                        </NavItem>
                        <Divider />
                       
                      <Logout onClick={() => this.togglemenu(), () => this.props.logout() } />
                   
                    </div>
            </Fragment>
        )

        return (
            
            <Navbar color="dark" dark expand="md" className="mb-2">
                <Container>
                <NavbarBrand href="/">CMS-DEV</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        { isAuthenticated ? authLinks : null}
                    </Nav>
                </Collapse>
                </Container>
            </Navbar>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps,  { logout })(AppNavbar)