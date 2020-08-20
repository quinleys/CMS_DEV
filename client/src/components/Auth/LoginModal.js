import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Container, Button, Modal, ModalBody, ModalHeader, Form, Input, Label, FormGroup, NavLink, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class LoginModal extends Component {
    state = {
        modal: false,
        username: '',
        password: '',
        msg: null,
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
    }
    componentDidUpdate(prevProps) {
        const {error, isAuthenticated } = this.props;
        if(error !== prevProps.error){
            if(error.id === 'LOGIN_FAIL'){
                this.setState({msg: error.msg.msg })
            } else {
                this.setState({msg: null})
            }
        }

        if(this.state.modal){
            if(isAuthenticated){
                this.toggle()
            }
        }
    }

    toggle = () => {
        console.log('toggle')
        this.setState({
            modal: !this.state.modal
        })
    }

    onChange = e => {
        this.setState({ [e.target.name] : e.target.value})
    }

    onSubmit = event => {
        event.preventDefault()
        const { username, password } = this.state;

        const user = {
            username,
            password
        }
        // attempt login 
        this.props.login(user);

    }
    render() {
        return (
            <Container>
                <NavLink onClick={this.toggle} href="#">Login</NavLink>
                <Modal 
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                > 
                    <ModalHeader toggle={this.toggle}>Login</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? ( <Alert color="danger"> {this.state.msg} </Alert> ): null }
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="name">Username</Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholer="Username"
                                    className="mb-3"
                                    onChange={this.onChange}
                                />
                                <Label for="name">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="mb-3"
                                    placeholer="Password"
                                    onChange={this.onChange}
                                />
                                <Button 
                                    className="mb-2 mt-2"
                                    color="dark"
                                    block
                                > Login
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps,{login, clearErrors })(LoginModal)