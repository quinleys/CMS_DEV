import React, { Component } from 'react';
import './App.css';
import Profile from './pages/Profile';
import Posts from './pages/Posts'
import AppNavbar from './components/Components/AppNavbar';
import Login from './pages/Login'
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';
import { getMaterials, getCustomers, getItems, getPeriods} from './actions/itemActions';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';
import Detail from './pages/Detail'
import Clients from './pages/Clients'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from './pages/Calender';
import Edit from './pages/Edit'
class App extends Component {
  componentDidMount(){
    store.dispatch(loadUser()); 
    store.dispatch(getMaterials());
    store.dispatch(getCustomers());
    store.dispatch(getItems());
  }

  render(){
  return (
    <Provider store={store}>
    <Router>
    <div>
      <AppNavbar />
      <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        draggable
                        />
{/*     <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <Link class="navbar-brand" to="/">Navbar</Link>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item">
      <Link to="/login">Login</Link>
      </li>
      <li class="nav-item">
      <Link to="/posts">Posts</Link>
      </li>
    </ul>
  </div>
</nav> */}
      
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
         <ProtectedRoute exact path="/profile" component={Profile} />
        <ProtectedRoute exact path="/posts" component={Posts} />
        <ProtectedRoute exact path="/posts:id" component={Detail} />
        <ProtectedRoute exact path="/posts:id/edit" component={Edit} />
        <ProtectedRoute exact path="/calendar" component={Calendar} />
        <ProtectedRoute exact path="/clients" component={Clients} />
      {/*   <ClientRoute exact path="/client/profile" component={Profile} />
        <ClientRoute exact path="/client" component={Client} />
        <ClientRoute exact path="/client/posts:id" component={Detail} /> */}
        <Route path="/login">
          <Login />
        </Route> 
        <ProtectedRoute path="*" component={Posts} ></ProtectedRoute>
       
      </Switch>
    </div>
  </Router>
  </Provider>
  );
}
}

export default App;
