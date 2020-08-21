import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addItem,clearAddedsuccess, getPeriods} from '../../actions/itemActions';
import Spinner from '../Loading/Spinner'
import {  Button, Modal, ModalBody, ModalHeader, Form, Input, Label, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import Select from 'react-select'
import moment from 'moment';
class ItemModal extends Component {
    state = {
        modal: false,
        title: '',
        description: '',
        finished: false,
        transport: 0,
        pauze: "00:30",
        customer: 0,
        materials: [],
        errormsg: '',
        period: '',
        start: 0,
        stop: 10,
        date: moment().format("YYYY-MM-DD"),
        start: moment().format('HH:mm'),
        stop: moment().add(2, 'hours').format('HH:mm')
/*         allMaterials: this.props.item.materials,
        allCustomers: this.props.item.customers, */
    }
    static propTypes = {
        auth: PropTypes.object.isRequired,
        item: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired
    }
    componentWillUnmount(){
        this.props.clearAddedsuccess()
        this.setState({
            modal: false,
            title: '',
            description: '',
            finished: false,
            transport: 0,
            pauze: 0,
            customer: 0,
            materials: [],
            errormsg: '',
            period: '',
            start: 0,
            stop: 10,
            date: moment().format("YYYY-MM-DD"),
            start: moment().format('HH:mm'),
            stop: moment().add(2, 'hours').format('HH:mm')
        })
    }

    toggle = () => {

        this.setState({
            modal: !this.state.modal
        })
        this.props.clearAddedsuccess()
        /* this.loadCustomers() */
    }
    onChange = e => {
        let name = e.target.name
        if(e.target.name == 'transport'){
            let value = parseInt(e.target.value)
            this.setState({
               [e.target.name]: value
            })
        }else if (e.target.name == "pauze"){
            let value = e.target.value
            this.setState({
                [e.target.name]: value
             })
        }else{
        this.setState({ [e.target.name] : e.target.value}, function(){
            if(name == 'customer'){
                this.props.getPeriods(this.state.customer)
                
            }
        })
        
    }
    }
    onChangeTime = e => {
        
        let value = e.target.value
        let name = e.target.name
        if(name == 'start'){
            if(value > this.state.stop){
                this.setState({
                    errormsg: 'Start tijd moet vroeger zijn dan stop tijd!'
                })
            }else{
                this.setState({
                    [name]: value
                })
            }
        }else  if(name == 'stop'){
            if(value < this.state.start){
                this.setState({
                    errormsg: 'Stop tijd moet later zijn dan start tijd!'
                })
            }else{
                this.setState({
                    [name]: value
                })
            }
        }
    }
    selectChange = (e) => {
        if(e){
           
            this.setState({
                materials: []
            },function(){
                e.map( m => {
                    let item = "/api/materials/" + m.id;
                    if(this.state.materials.includes(item)){
                        this.setState({materials: this.state.materials.filter(function(filter) { 
                            return filter !== item
                        })});
                      
                    }else{
                        this.setState(previousState => ({
                            materials: [...previousState.materials, item]
                        }))
                }})
            
            })
        }
    }
    onSubmit = event => {
        event.preventDefault()
        this.setState({
            errormsg: ''
        }, function(){
        let start = new Date(this.state.date  + 'T' + this.state.start + ':00')
        let pauze = new Date (this.state.date + 'T' + this.state.pauze + ':00')
        let end = new Date(this.state.date  + 'T' + this.state.stop + ':00')
        let calc = end - start
        let newpauze = pauze - new Date( this.state.date + 'T' + '00:00:00')
        if(calc,newpauze,  calc > newpauze ){
        let newItem;
        if(this.state.period !== ""){
        newItem = {
            
            title: this.state.title,
            description: this.state.description,
            finished: this.state.finished,
            transport: this.state.transport,
            pauze: this.state.pauze + ':00',
            date: this.state.date,
            start: this.state.start + ':00',
            stop: this.state.stop + ':00',
            customer: '/api/customers/' + this.state.customer,
            period: 'api/periods/' + this.state.period,
            materials: this.state.materials,
            user: '/api/users/' + localStorage.getItem('id'),
        }
    }else{
        newItem = {
            
            title: this.state.title,
            description: this.state.description,
            finished: this.state.finished,
            transport: this.state.transport,
            pauze: this.state.pauze + ':00',
            date: this.state.date,
            start: this.state.start+ ':00',
            stop: this.state.stop  + ':00',
            customer: '/api/customers/' + this.state.customer,
            materials: this.state.materials,
            user: '/api/users/' + localStorage.getItem('id'),
        }
    }
        this.props.addItem(newItem);  
    }else{
        this.setState({
            errormsg: 'U moet meer werken dan pauze nemen.'
        })
    }
})
       /*  this.toggle(); */ 
    }
    render() {
        const { loading, customersloading, materialsloading } = this.props.item;
        
        return (
            loading && customersloading  && materialsloading && this.props.item.customers.length > 0 ? <Spinner /> : 
            
            <div>
                
  <Fab size="large" color="secondary" aria-label="add" className="fab" onClick={this.toggle} >
                      <AddIcon/>
                </Fab>
                <Modal 
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                > 
                    <ModalHeader toggle={this.toggle}>Voeg taak toe</ModalHeader>
                    <ModalBody>
                        {this.props.error.itemError ? <Alert  severity="error"> {this.props.error.itemError.data['hydra:description']} </Alert> : null }
                        {this.state.errormsg !== '' ? <Alert  severity="error"> {this.state.errormsg} </Alert> : null }
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholer="add title"
                                    required
                                    value={this.state.title}
                                    onChange={this.onChange}
                                    className="mb-2"
                                />
                                <Label for="description">Uitgevoerde Activiteiten</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    required
                                    placeholer="add description"
                                    onChange={this.onChange}
                                    value={this.state.description}
                                    className="mb-2"
                                />
                                <FormGroup>
                                    <Label for="date">Date</Label>
                                    <Input
                                    type="date"
                                    name="date"
                                    required
                                    onChange={this.onChange}
                                    value={this.state.date}
                                    id="date"
                                    placeholder="date placeholder"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="start">Start</Label>
                                    <Input
                                    type="time"
                                    name="start"
                                    onChange={this.onChangeTime}
                                    value={this.state.start}
                                    max={this.state.stop}
                                    id="start"
                                    required
                                    placeholder="time placeholder"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="stop">Stop</Label>
                                    <Input
                                    type="time"
                                    name="stop"
                                    onChange={this.onChangeTime}
                                    value={this.state.stop}
                                    min={this.state.start}
                                    required
                                    id="stop"
                                    placeholder="time placeholder"
                                    />
                                </FormGroup>
                                <Label for="transport">Transport (in km)</Label>
                                <Input
                                    type="number"
                                    name="transport"
                                    id="transport"
                                    required
                                    value={this.state.transport}
                                    placeholer="add transport"
                                    onChange={this.onChange}
                                    className="mb-2"
                                    parse={value => parseInt(value, 10)}
                                /> 
                                <Label for="pauze">Pauze (in min)</Label>
                                <Input
                                    type="time"
                                    name="pauze"
                                    id="pauze"
                                    value={this.state.pauze}
                                    placeholer="add pauze"
                                    required
                                    onChange={this.onChange}
                                    className="mb-2"
                                    
                                />
                                <Label for="customer">Klanten</Label>
                                <Input type="select" name="customer" id="customer" className="mb-2" onChange={this.onChange} required>
                                   
                                  {this.state.customer == "" ?  <option value="" >Kies een klant ...</option>: null}
                                  { !this.props.item.customersloading && this.props.item.customers && this.props.item.customers['hydra:totalItems'] >= 1 ? this.props.item.customers['hydra:member'].map(item => {
                                    return(<option key={item.id} value={item.id} >{item.name} </option>)
                                }) : <option>Loading...</option> }  
                                </Input>
                                <Label for="period">Periode</Label>
                                
                                <Input type="select" disabled={this.state.customer == "" || this.props.item.periods == 'no periods'} name="period" id="period" className="mb-2" onChange={this.onChange} >
                                {this.props.item.periods.length > 0 ? <option value="">Selecteer een periode...</option> : null }
                                  { !this.props.item.periodsloading && this.props.item.periods.length >= 1 && this.props.item.periods !== 'no periods' ? this.props.item.periods.map(item => {

                                    return(<option key={item.id} value={item.id} >{item.title}</option>)
                                }) : this.props.item.periods == 'no periods' ? <option>Geen periodes</option> : <option>Selecteer een klant...</option> }  
                                </Input>
                               <Label for="materials">Benodigdheden</Label>
                              
                              { this.props.item.materials && this.props.item.materials['hydra:totalItems'] >= 1 ?
                               <Select options={this.props.item.materials['hydra:member']} 
                                        isMulti
                                        getOptionLabel ={(material)=>material.name}
                                        getOptionValue ={(material)=>material.id}
                               
                                        onChange={this.selectChange}
                                        />
                                        : null }
                                <Button 
                                    className="mb-2 mt-3"
                                    color="dark"
                                    block
                                    disabled={this.state.title == '' || this.state.description == '' ||  this.state.date == null ||  this.state.start == null}
                                >Voeg toe
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
                </div>
            
        )
    }
}

const mapStateToProps = state => ({
    item: state.item,
    auth: state.auth,
    error : state.error,
});

export default connect(mapStateToProps, { addItem, clearAddedsuccess, getPeriods })(ItemModal)