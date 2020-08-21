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
class Posts extends Component {
    state= {
        allMaterials: this.props.materials,
        allCustomers: this.props.customers, 
        items: this.props.item,
        page: 1
    }
    componentDidMount(){
        this.props.getItems()
    }
    loadNextPage = e => {
        console.log(e);
        this.setState({
            page: e
        })
        this.props.loadNextPage(e);
       /*  let page = this.props.item.page.current_page + 1;
        this.setState({
            pageUrl: e
        })
        console.log(this.state.filterUrl + '?&page=' + e)
        if(this.state.filterUrl == '' ){
            this.props.getItems(this.state.filterUrl + '?page=' + e )
        }else {
            this.props.getItems(this.state.filtersrl + '&page=' + e )
        } */


        
    }
    render() {
        const { loading } = this.props.item;

        return (
          
            this.props.auth.isAuthenticated == false ? <Redirect to ="/login" /> :
                !loading && this.props.item.items.status == 200  && this.props.item.customers !== [] ?
                <Container>
                    {  console.log('auth', this.props.auth.isAuthenticated) }
                    <ItemModal />
                    <div className="row">
                        <div className="col-12">
                        <h1>Werkbonnen</h1>
                        </div>
                        </div>
                            {this.props.error.updateError ? <Alert>{this.props.error.updateError}</Alert> : null }
                            {this.props.item.items && this.props.item.items.data["hydra:member"].map((m, i) => {
                            console.log('m', m.finished)
                        return(
                            <PostCard id={m.id} date={m.date} customer={m.customer.name} finished={m.finished} title={m.title} description={m.description} materials={m.materials}/>
                        )})}  
                        {this.props.item.items.data["hydra:totalItems"] == 0 ? <p>Geen werkbonnen</p>: null}
                     {this.props.item.items.data["hydra:totalItems"] > 10 ? 
                     <div className="col-12">
                     <Pagination
                     activePage={this.state.page}
                     itemsCountPerPage={10}
                     totalItemsCount={this.props.item.items.data["hydra:totalItems"]}
                     pageRangeDisplayed={5}
                     onChange={this.loadNextPage.bind(this)}
                     itemClass="page-item"
                     linkClass="page-link"
                     /> 
                     </div>
                    : null }
                   
                </Container>
                :  <div><Spinner /> {console.log('log',this.props.item.items)}</div>
        )
    }
}
Posts.propTypes = {
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
export default connect(mapStateToProps, {getItems, loadNextPage})(Posts);