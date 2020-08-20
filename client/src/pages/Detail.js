import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { getItem, getCustomers , editItem, getPeriods} from '../actions/itemActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  Button, Form, Input, Label, FormGroup } from 'reactstrap';
import Select from 'react-select'
import Switch from '@material-ui/core/Switch';
import Spinner from '../components/Loading/Spinner'
import moment from 'moment';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom'
class Detail extends Component {
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
        this.props.getItem(final[1])
        this.setState({
            id: final[1]
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
            start: 0,
            period: 0,
            errormsg: "",
            stop: 10,
            date: '2020-08-08',
            allMaterials: this.props.item.materials,
            allCustomers: this.props.item.customers,
            loadedcustomers: false,
        })
       
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
        console.log('select', e)
        if(e){
            this.setState({
                materials: []
            },function(){
                console.log('eee', e)
                e.map( m => {
                    console.log('mmm',m)
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
        console.log('set correct',this.props.item.item)
        if(this.props.item.item["@type"] == "Post"){
            console.log('set correct 2',this.props.item.item)
            console.log('period', this.props.item.item.period)
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
            console.log(this.props.item.item.customer.id, 'id customer')
            this.props.getPeriods(this.props.item.item.customer.id)
            this.setState({
                loaded: true
            })
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
        console.log(start , 'start')
        let end = new Date(this.state.date  + 'T' + this.state.stop + ':00')
        let calc = end - start
        let newpauze = pauze - new Date( this.state.date + 'T' + '00:00:00')

        console.log('calc' , calc,newpauze,  calc > newpauze)
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
        console.log([e.target.name],e.target.value)
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
                console.log('this.getPeriods')
            }
        })
        }
    }
    render() {
        return (
            <Container>
                {console.log(this.props.item.item.id, this.state.id, this.props.item.item)}
                {this.props.item.loading  && this.props.item.customersloading && this.props.item.item.id == this.state.id  ? <Spinner/>: 
             this.props.error.notAllowed ? 'NOT ALLOWED' : 
             !this.state.loaded? <div> {this.setCorrect()} <Spinner/> </div>: 
            <div>
              {this.props.item.item.customers && !this.loadedcustomers  ? this.loadCustomers() : null}
              <Card className="p-3 my-3" style={{ color: "white"}}>
              {this.props.error.itemError ? <Alert  severity="error"> {this.props.error.itemError.data['hydra:description']} </Alert> : null }
                {this.state.errormsg !== '' ? <Alert  severity="error"> {this.state.errormsg} </Alert> : null }
              
                    <div className="row">
                        <div className="col">
                    <h4>Werkbon</h4>
                    </div>
                    <div className="col text-right">
                        <Link to={`/posts:${this.state.id}/edit`}>
                        <Button className="btn btn-primary">Bewerk</Button>
                        </Link>
                    <Switch
                    checked={this.state.finished}
                    onChange={this.onToggle}
                    name="checkedA"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                </div>
                </div>
                {console.log(this.state.date)}
                            <FormGroup>
                                <Label for="item">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={this.state.title}
                                    id="title"
                                    placeholer="add title"
                                    onChange={this.onChange}
                                    disabled
                                    className="mb-2"
                                />
                                <Label for="item">Uitgevoerde Activiteiten</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    placeholer="add description"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                    disabled
                                    className="mb-2"
                                />
                                <FormGroup>
                                    <Label for="date">Date</Label>
                                    <Input
                                    type="date"
                                    name="date"
                                    value={this.state.date}
                                    onChange={this.onChange}
                                    disabled
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
                                    onChange={this.onChange}
                                    disabled
                                    id="start"
                                    placeholder="time placeholder"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="start">Stop</Label>
                                    <Input
                                    type="time"
                                    name="stop"
                                    value={this.state.stop}
                                    onChange={this.onChange}
                                    disabled
                                    id="stop"
                                    placeholder="time placeholder"
                                    />
                                </FormGroup>
                                <Label for="item">Transport (in km)</Label>
                                <Input
                                    type="number"
                                    name="transport"
                                    id="transport"
                                    value={this.state.transport}
                                    placeholer="add transport"
                                    onChange={this.onChange}
                                    disabled
                                    className="mb-2"
                                    
                                /> 
                                <Label for="item">Pauze</Label>
                                <Input
                                    type="time"
                                    name="pauze"
                                    id="pauze"
                                    value={this.state.pauze}
                                    placeholer="add pauze"
                                    onChange={this.onChange}
                                    disabled
                                    className="mb-2"
                                    
                                />
                                <Label for="customer">Customer</Label>
                                <Input type="select" name="customer" disabled id="customer" className="mb-2" value={this.state.customer} onChange={this.onChange}>
                                    {console.log(this.props.item.customers['hydra:member'])}
                                  { this.props.item.customers && this.props.item.customers['hydra:totalItems'] >= 1 ? this.props.item.customers['hydra:member'].map(item => {
                                    return(<option key={item.id} value={item.id} >{item.name}</option>)
                                }) : <option>Loading...</option> }  
                                </Input>
                                <Label for="period">Periode</Label>
                                {console.log("periods",this.props.item.periods, this.state.customer)}
                                {console.log(this.state.period, this.state.customer)}
                                <Input type="select" disabled name="period" id="period" value={this.state.period} className="mb-2" onChange={this.onChange}>
                                    {this.state.period == 0 ? <option value="">Kies een periode</option> : null}
                                  { !this.props.item.periodsloading && this.props.item.periods.length >= 1 && this.props.item.periods !== 'no periods' ? this.props.item.periods.map(item => {
                                    return(<option key={item.id} value={item.id} >{item.title}</option>)
                                }) : <option>Selecteer een klant...</option> }  
                                </Input>
                               <Label for="materials">Benodigdheden</Label>
                               {console.log(this.props.item.item.materials,'materials')}
                               { this.props.item.materials && this.props.item.materials['hydra:totalItems'] >= 1 ?
                               <Select options={this.props.item.materials['hydra:member']} 
                                        isMulti
                                        defaultValue={this.props.item.item.materials.length > 0 && this.props.item.item.materials.map(m =>  this.props.item.materials['hydra:member'][m.id -1 ] )}
                                        getOptionLabel ={(material)=>material.name}
                                        getOptionValue ={(material)=>material.id}
                                        isDisabled={true}
                                   
                                        />
                                        : null }
                                
                            </FormGroup>
                 
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
export default connect(mapStateToProps, { getItem ,editItem,getPeriods, getCustomers}) (Detail);