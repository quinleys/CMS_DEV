import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getItems } from '../actions/itemActions';
import PropTypes from 'prop-types';
import ItemModal from '../components/Components/ItemModal';
import { Container } from 'reactstrap';
import { getMaterials, getCustomers, loadNextPage } from '../actions/itemActions';
import Spinner from '../components/Loading/Spinner';
import { ListGroup, ListGroupItem } from 'reactstrap';
import ListItem from '../components/Components/ListItem';
import PostCard from '../components/Components/PostCard'
import Alert from '@material-ui/lab/Alert';
import Pagination from "react-js-pagination";
import {Redirect} from 'react-router-dom'
import moment from 'moment'
class Clients extends Component {
    state= {
        allMaterials: this.props.materials,
        allCustomers: this.props.customers, 
        items: this.props.item,
        page: 1
    }
    componentDidMount(){
        this.props.getItems()
    }

    render() {
        const { loading } = this.props.item;

        return (
          <div>
              Clients
          </div>
        )
    }
}
Clients.propTypes = {
    item: PropTypes.object.isRequired,
    
}
const mapStateToProps = (state) => ({
    item: state.item,
    auth: state.auth,
    getMaterials: PropTypes.func.isRequired,
    getCustomers: PropTypes.func.isRequired,
    error: state.error,
    loadNextPage: PropTypes.func.isRequired,
})
export default connect(mapStateToProps, {getItems, loadNextPage})(Clients);