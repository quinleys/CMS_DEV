import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Container, Button, Form, Input, Label, FormGroup, Card, CardBody  } from 'reactstrap';
import PropTypes from 'prop-types';
import { login } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import Alert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router-dom';
class Login extends Component {
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
        auth: PropTypes.object.isRequired
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
            
            <Container className="h-100">
 {localStorage.getItem('userRole') ==  'ROLE_USER' || localStorage.getItem('userRole') ==  'ROLE_ONDERAANNEMER'? <Redirect to ="/"/> : null }  
 {this.props.auth.isAuthenticated && localStorage.getItem('userRole') == "ROLE_USER" || localStorage.getItem('userRole') ==  'ROLE_ONDERAANNEMER' ?<Alert severity="success">You are logged in!</Alert> : null } 
                        
                        <div className="row align-items-center">
                            <div className="col-12">
                                <Card>
                                    <CardBody>
                                    {this.props.error.id == 'LOGIN_FAIL' ? ( <Alert severity="error"> {this.props.error.msg.data.message} </Alert> ): null }
                                    {this.props.error.id == 'LOGIN_WRONGROLE' ? ( <Alert severity="error"> {console.log(this.props.error.msg)} </Alert> ): null }
                        <h1>Aanmelden</h1>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholer="Username"
                                    className="mb-3"
                                    required
                                    onChange={this.onChange}
                                />
                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="mb-3"
                                    required
                                    placeholer="Password"
                                    onChange={this.onChange}
                                />
                                <Button 
                                    className="my-3"
                                    color="primary"
                                    block
                                    disabled={this.props.auth.isLoading}
                                > {this.props.auth.isLoading ? 'Loading...' : 'Login' }
                                </Button>
                            </FormGroup>
                        </Form>
                        </CardBody>
                        </Card>
                        </div>
                        </div>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth,
    error: state.error
});

export default connect(mapStateToProps,{login, clearErrors })(Login)