import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { getItem, getCustomers , editItem, getPeriods, clearItem} from '../actions/itemActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  Button, Form, Input, Label, FormGroup } from 'reactstrap';
import Select from 'react-select'
import Switch from '@material-ui/core/Switch';
import Spinner from '../components/Loading/Spinner'
import moment from 'moment';
import Card from '@material-ui/core/Card';
import {Redirect} from 'react-router-dom'
import Alert from '@material-ui/lab/Alert';
class Edit extends Component {
    state = {
        modal: false,
        title: '',
        description: '',
        finished: false,
        transport: 0,
        pauze: 0,
        customer: 0,
        materials: [],
        loaded: false,
        loading: true,
        start: 0,
        period: 0,
        errormsg: "",
        stop: 10,
        date: '2020-08-08',
        allMaterials: this.props.item.materials,
        allCustomers: this.props.item.customers,
        loadedcustomers: false,
    }
    componentDidMount(){
        let id = this.props.match.params.id
        var splitstr = id.split(':');
        let final = splitstr.slice(0)
        this.setState({
            id: final[1],
            loading: true,
        }, function(){
            this.props.getItem(final[1])
        })
        
    } 
    componentWillUnmount(){
        this.setState({
            modal: false,
            title: '',
            description: '',
            finished: false,
            transport: 0,
            pauze: 0,
            customer: 0,
            materials: [],
            loaded: false,
            loading: true,
            start: 0,
            period: 0,
            errormsg: "",
            stop: 10,
            date: '2020-08-08',
            allMaterials: this.props.item.materials,
            allCustomers: this.props.item.customers,
            loadedcustomers: false,
        })
        this.props.clearItem()
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
    loadCustomers = () => {
        if(this.props.item.materials[0] && this.props.item.customers[0]){
            this.setState({
                allMaterials: this.props.item.materials[0]['hydra:member'],
                allCustomers: this.props.item.customers[0]['hydra:member']
            }, function(){
                this.setState({
                    loadedcustomers: true
                })
               
            })
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
    setCorrect = () => {
        if(this.props.item.item["@type"] == "Post"){
            console.log(this.props.item.item.customer.id)
        this.setState({
            title: this.props.item.item.title,
            description: this.props.item.item.description,
            date: moment(this.props.item.item.date).format('YYYY-MM-DD'),
            start: this.props.item.item.start,
            stop: this.props.item.item.stop,
            transport: this.props.item.item.transport,
            finished: this.props.item.item.finished,
            customer: this.props.item.item.customer.id,
            pauze: this.props.item.item.pauze,
            
        }, function(){
            if(this.props.item.item.period){
                this.setState({
                    period: this.props.item.item.period.id
                })
              
            }
            if(this.props.item.item.materials){
                this.props.item.item.materials.map(m => {
                    let item = "/api/materials/" + m.id;
                    if(this.state.materials.includes(item)){
                        this.setState({materials: this.state.materials.filter(function(filter) { 
                            return filter !== item
                        })});
                      
                    }else{
                        this.setState(previousState => ({
                            materials: [...previousState.materials, item]
                        }))
                    }
                })
            }
            this.props.getPeriods(this.state.customer)
            if(this.state.materials.length >=1){
                this.setState({
                    loaded: true,
                    loading: false
                })
            }
        
        })

    }
    }
    onSubmit = event => {
        event.preventDefault()
        this.setState({
            errormsg: ''
        }, function(){
            let start;
            let pauze 
            let end 
            if(this.state.start.length != 8){
                start = new Date(this.state.date  + 'T' + this.state.start + ':00')
            }else {
                start = new Date(this.state.date + 'T' + this.state.start)
            }
            if(this.state.pauze.length != 8){
                pauze  = new Date (this.state.date + 'T' + this.state.pauze + ':00')
            } else {
                pauze = new Date (this.state.date + 'T' + this.state.pauze )
            }
            if(this.state.stop.length != 8){
               end = new Date(this.state.date  + 'T' + this.state.stop + ':00')
            } else {
                end = new Date(this.state.date  + 'T' + this.state.stop )
            }
      
        let calc = end - start
        let newpauze = pauze - new Date( this.state.date + 'T' + '00:00:00')
        if(calc,newpauze,  calc > newpauze ){


        let newItem;
        if(this.state.period !== 0 ){
        newItem = {
            
            title: this.state.title,
            description: this.state.description,
            finished: this.state.finished,
            transport: this.state.transport,
            pauze: this.props.item.item.pauze == this.state.pauze ? this.state.pauze : this.state.pauze + ":00",
            date: this.state.date,
            start: this.props.item.item.start == this.state.start ? this.state.start  : this.state.start+ ":00",
            stop: this.props.item.item.stop == this.state.stop ? this.state.stop  : this.state.stop+ ":00",
            customer: '/api/customers/' + this.state.customer,
            period: 'api/periods/' + this.state.period,
            materials: this.state.materials,
            user: '/api/users/' + localStorage.getItem('id'),}
        }else{
            newItem = {
            
                title: this.state.title,
                description: this.state.description,
                finished: this.state.finished,
                transport: this.state.transport,
                pauze: this.props.item.item.pauze == this.state.pauze ? this.state.pauze : this.state.pauze + ":00",
                date: this.state.date,
                start: this.props.item.item.start == this.state.start ? this.state.start  : this.state.start+ ":00",
                stop:  this.props.item.item.stop == this.state.stop ? this.state.stop  : this.state.stop+ ":00",
                customer: '/api/customers/' + this.state.customer,
                materials: this.state.materials,
                user: '/api/users/' + localStorage.getItem('id'),}
        }
    
        this.props.editItem(newItem, this.state.id); 
    }else{
        this.setState({
            errormsg: 'U moet meer werken dan pauze nemen.'
        })
    }
})
}
    
    onToggle = () => {
        this.setState({
            finished: !this.state.finished
        })
    }
    onChange = (e) => {
         let name = e.target.name
        if(e.target.name == 'transport' ){
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
    render() {
        return (
            this.props.auth.isAuthenticated == false ? <Redirect to ="/login" /> :
            <Container>
                {this.props.item.loading  && this.state.loading &&  this.props.item.customersloading && this.props.item.item.materials ? <Spinner/> : 
             this.props.error.notAllowed ? 'NOT ALLOWED' : 
             !this.state.loaded  && this.state.loading? <div> {this.setCorrect()} <Spinner/> </div>: 
            <div>
              {this.props.item.item.customers && !this.loadedcustomers  ? this.loadCustomers() : null}
              <Card className="p-3 my-3" style={{ color: "white"}}>
              {this.props.error.itemError ? <Alert  severity="error"> {this.props.error.itemError.data['hydra:description']} </Alert> : null }
                {this.state.errormsg !== '' ? <Alert  severity="error"> {this.state.errormsg} </Alert> : null }
                <Form onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="col">
                    <h4>Bewerk</h4>
                    </div>
                    <div className="col text-right">
                    <Switch
                    checked={this.state.finished}
                    onChange={this.onToggle}
                    name="checkedA"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                </div>
                </div>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={this.state.title}
                                    id="title"
                                    placeholer="add title"
                                    onChange={this.onChange}
                                    required
                                    className="mb-2"
                                />
                                <Label for="description">Uitgevoerde Activiteiten</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    placeholer="add description"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                    required
                                    className="mb-2"
                                />
                                <FormGroup>
                                    <Label for="date">Date</Label>
                                    <Input
                                    type="date"
                                    name="date"
                                    value={this.state.date}
                                    onChange={this.onChange}
                                    required
                                    id="date"
                                    placeholder="date placeholder"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="start">Start</Label>
                                    <Input
                                    type="time"
                                    name="start"
                                    value={this.state.start}
                                    onChange={this.onChangeTime}
                                    max={this.state.stop}
                                    required
                                    id="start"
                                    placeholder="time placeholder"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="stop">Stop</Label>
                                    <Input
                                    type="time"
                                    name="stop"
                                    value={this.state.stop}
                                    onChange={this.onChangeTime}
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
                                    value={this.state.transport}
                                    placeholer="add transport"
                                    onChange={this.onChange}
                                    required
                                    className="mb-2"
                                    
                                /> 
                                <Label for="pauze">Pauze</Label>
                                <Input
                                    type="time"
                                    name="pauze"
                                    id="pauze"
                                    value={this.state.pauze}
                                    placeholer="add pauze"
                                    onChange={this.onChange}
                                    required
                                    className="mb-2"
                                    
                                />
                                <Label for="customer">Customer</Label>
                                <Input type="select" name="customer" id="customer" className="mb-2" value={this.state.customer} onChange={this.onChange}>
                                  { this.props.item.customers && this.props.item.customers['hydra:totalItems'] >= 1 ? this.props.item.customers['hydra:member'].map(item => {
                                    return(<option key={item.id} value={item.id} >{item.name}</option>)
                                }) : <option>Loading...</option> }  
                                </Input>
                                <Label for="period">Periode</Label>
                                <Input type="select" disabled={this.state.customer == "" || this.props.item.periods == 'no periods'} name="period" id="period" value={this.state.period} className="mb-2" onChange={this.onChange}>
                                    {this.state.period == 0 ? <option value="">Kies een periode</option> : null}
                                  { !this.props.item.periodsloading && this.props.item.periods.length >= 1 && this.props.item.periods !== 'no periods' ? this.props.item.periods.map(item => {
                                    return(<option key={item.id} value={item.id} >{item.title}</option>)
                                }) :  this.props.item.periods == 'no periods' ? <option>Geen periodes</option> : <option>Selecteer een klant...</option> }  
                                </Input>
                               <Label for="materials">Benodigdheden</Label>
                            
                               { this.props.item.materials && this.props.item.materials['hydra:totalItems'] >= 1 ?
                               <Select options={this.props.item.materials['hydra:member']} 
                                        isMulti
                                        defaultValue={this.props.item.item.materials.length > 0 && this.props.item.item.materials.map(m =>  this.props.item.materials['hydra:member'][m.id -1 ] )}
                                        getOptionLabel ={(material)=>material.name}
                                        getOptionValue ={(material)=>material.id}
                               
                                        onChange={this.selectChange}
                                        />
                                        : null }
                                <Button 
                                    className="mb-2 mt-3"
                                    color="dark"
                                    block
                                    disabled={
                                        this.state.title == this.props.item.item.title && 
                                        this.state.description == this.props.item.item.description &&
                                        this.state.date == this.props.item.item.date &&
                                        this.state.start == this.props.item.item.start &&
                                        this.state.stop == this.props.item.item.stop &&
                                        this.state.pauze == this.props.item.item.pauze &&
                                        this.state.transport == this.props.item.item.transport
                                    
                                    }
                                >Pas aan!
                                </Button>
                            </FormGroup>
                        </Form>
                        </Card>
            </div>
            }
           
            </Container>
        )
    }
}
const mapStateToProps = (state) => ({
    auth: PropTypes.object.isRequired,
    item: state.item,
    error: state.error,
    getItem: PropTypes.func.isRequired,
    edit:PropTypes.func.isRequired
})
export default connect(mapStateToProps, {clearItem, getItem ,editItem,getPeriods, getCustomers}) (Edit);