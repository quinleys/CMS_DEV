import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCustomerItems } from '../actions/itemActions';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, FormGroup, Form,Input, Label
  } from 'reactstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'react-moment';
import Alert from '@material-ui/lab/Alert';
import  { getProfile, updateProfile } from '../actions/authActions';

class Profile extends Component {
    
    state = {
        items: this.props.item,
        transportkost: 0,
        uurtarief: 0,
        hoursWeekly: 0,
        customersWeekly: 0,
        hoursworked: null,
        data: [],
        hoursMonthly: 0,
        makeData: true,
        customersMonthly: 0,
        client: null,
        loaded: false,
        today: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    }
    static propTypes = {
        auth: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        item: PropTypes.object.isRequired,
        updateProfile: PropTypes.func.isRequired
    }
    componentDidMount = () => {
        this.props.getProfile()
    }
    setItem = (item) => {
        /* console.log('setItem', item) */
        if(this.state.items.length == 0 ){
            this.setState({
                items: [...this.state.items, item]
            })
            
        }else{
            this.state.items.forEach(i => {
                if( i.id == item.id){
                    console.log('gelijk')
                }
            })
           /*  this.state.items.forEach(i => {
                console.log(i.id, item.id)
                 if(i.id !== item.id){
                    this.setState({
                        items: [...this.state.items, item]
                    })
                }
            }); */
        }

    }
    setHoursWeekly = () => {
        this.props.item.items.forEach(item => {
            let date = item.date.split('T')[0]
            for (var i = 0; i < 1; i++ ){
                let todayDate = this.state.today - i
                let longDate = this.state.year + "-" + this.state.month + "-" + todayDate
                longDate = '2020-06-29'
                /* console.log(typeof date, typeof longDate)
                console.log(longDate) */
                if( date === longDate  /* '2020-08-08' */){
                    /* this.setState({
                        
                        hoursWeekly: this.state.hoursWeekly
                    }) */
                    this.setItem(item)
                }
            }
        });
    }

    

/*     componentDidUpdate(){
        this.setHoursWeekly()
       setHoursMonthly()
        setCustomersMonthly() 
    }*/
    setCorrect = () => {
        
        if(this.props.auth.profile.id){

        this.setState({
            uurtarief: this.props.auth.profile.uurtarief,
            transportkost: this.props.auth.profile.transportkost
           
        }, function(){
            this.setState({
                loaded: true
            })
        })

    }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    onChangeClient = (e) => {
        if(e.target.value !== ""){

        
        this.setState({
            client: e.target.value,
            makeData: true,
        })

        this.props.getCustomerItems(e.target.value)
    }
    }
    onSubmit = (e) => {
        e.preventDefault();
        let item = {
            "uurtarief" :  parseInt(this.state.uurtarief),
            "transportkost": parseInt(this.state.transportkost)
        }
        
        this.props.updateProfile(item)
    }
    calcStats = () => {
       console.log('calc that shit', this.state.data)
       this.setState({
                hoursworked: 0
            }, function(){
            console.log('calc stats', this.state.data)
            let uren = 0
            this.state.data.map(m => {
                let endDate = new Date(m.end);
                let startDate = new Date (m.start)
                console.log(endDate, startDate, endDate - startDate, m.end)
                uren = uren + (endDate - startDate)
                console.log('uurkes',uren, this.state.hoursworked + uren)
        

                this.setState({
                    hoursworked: this.convertMS(uren)
                }, function(){
                    console.log(this.state.hoursworked)
                })
            })
            })
        }
    

  convertMS = ( milliseconds )  => {
      var day, hour, minute, seconds;
      seconds = Math.floor(milliseconds / 1000);
      minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      hour = Math.floor(minute / 60);
      minute = minute % 60;
      day = Math.floor(hour / 24);
      hour = hour % 24;
      return {
          day: day,
          hour: hour,
          minute: minute,
          seconds: seconds
      };
  }
  setCustomerItems = () => {
    console.log('Setcustomeritem')
    this.setState({
        data: [],
        prevItems: this.props.item.customerItems
    }, function(){
        if(this.state.makeData){
            console.log(this.props.item.customerItems['hydra:member'], 'customeritems')
            this.props.item.customerItems['hydra:member'].map(m => {
              let item = {
                "id" : m.id,
                "title" : m.title,
                'start' : m.date.split('T')[0] + 'T' + m.start ,
                "end": m.date.split('T')[0] + 'T' + m.stop ,
                "period": m.period,
                'customer' : m.customer
              }
              if(this.state.data.includes(item)){
                console.log('inside incluse')
                this.setState({data: this.state.data.filter(function(m) { 
                    return m !== item
                })});
              }else{
                this.setState(previousState => ({
                    data: [...previousState.data, item]
                }));
              }
              
            },
           
             this.setState({
               makeData: false
             }, function(){
                 console.log('go to calc stats')
              this.calcStats()
             })
          
            )
          
          }
    })

}
    render() {
        const { isAuthenticated, user, profile } = this.props.auth;
        const { items } = this.props.item;
        return (
            <div>
                {console.log(this.props.item,'item')}
            { this.state.prevItems !== this.props.item.customerItems && !this.props.item.itemloading && !this.props.item.customerloading && this.props.item.customerItems['hydra:totalItems'] >= 0 && this.state.makeData ?  this.setCustomerItems() : null }
            <div class="container">
                { this.props.auth.loading ? 'loading ...' : 
                 !this.state.loaded ? <div> {this.setCorrect()} loading... </div>: 
                <div>
                      <Card>
                          {console.log(profile, 'profile')}
                        <CardBody>
                         {console.log(this.props.error)}
                         <h4>Profiel</h4>
                        <CardTitle>Email: { user ? <strong>{user.email? ` ${user.email}` : ` ${user[0].name}` }</strong> : <strong>  {localStorage.getItem('username')} </strong>}</CardTitle>
                        <CardTitle>Gebruikersnaam: { user ? <strong>{user.username? ` ${user.username}` : ` ${user[0].name}` }</strong> : <strong>  {localStorage.getItem('username')} </strong>}</CardTitle>
                        <CardTitle>Voornaam: { user ? <strong>{user.firstName? ` ${user.firstName}` : ` ${user[0].name}` }</strong> : <strong>  {localStorage.getItem('username')} </strong>}</CardTitle>
                        <CardTitle>Familienaam: { user ? <strong>{user.firstName? ` ${user.lastName}` : ` ${user[0].name}` }</strong> : <strong>  {localStorage.getItem('username')} </strong>}</CardTitle>
                        {localStorage.getItem('userRole') == "ROLE_ONDERAANNEMER" ?
                        <Form onSubmit={this.onSubmit}>
                            {this.props.error.profile ? <Alert>{this.props.error.profile}</Alert> : null }
                                                
                            <FormGroup>
                                <Label>Uurtarief</Label>
                            <Input
                                    type="number"
                                    name="uurtarief"
                                    id="uurtarief"
                                    value={this.state.uurtarief}
                                    placeholer="add pauze"
                                    className="mb-2"
                                    max={500}
                                    onChange={this.onChange}
                                />
                                 <Label>Transportkost</Label>
                                  <Input
                                    type="number"
                                    name="transportkost"
                                    max={500}
                                    id="transportkost"
                                    value={this.state.transportkost}
                                    placeholer="add pauze"
                                    className="mb-2"
                                    onChange={this.onChange}
                                    
                                />
                            </FormGroup>
                            <Button  className={this.props.auth.profile.uurtarief == this.state.uurtarief &&  this.props.auth.profile.transportkost == this.state.transportkost  ? 'd-none' : 'w-100 btn btn-primary'}>
                                                        Save
                                                </Button>
                        </Form>
                        : null }
                        </CardBody>
                    </Card>
                  {/*   <Tabs>
                <TabList>
                <Tab>Deze Week</Tab>
                <Tab>Deze Maand</Tab>
                <Tab>Per Klant</Tab>
                </TabList>
                    <TabPanel>
                        <h2>Deze week</h2>
                        <h2>Totale uren: {this.state.hoursWeekly}</h2>
                        <h2>Totaal aantal klanten: {this.state.customersWeekly}</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>Deze maand</h2>
                        <h2>Totale uren: {this.state.hoursMonthly}</h2>
                        <h2>Totaal aantal klanten: {this.state.customersMonthly}</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>Per Klant</h2>
                    </TabPanel>
            </Tabs> */}
            </div>
            }   
            <Card className="my-3">
            {this.props.item.itemloading ? 'loading' :
                <CardBody>
                   
            <Label for="customer">Klanten</Label>
                                <Input type="select" name="customer" id="customer" className="mb-2" onChange={this.onChangeClient} required>
                                    {console.log(this.props.item.customers['hydra:member'])}
                                    <option value="" >Kies een klant ...</option>
                                  {this.state.customer == "" ?  <option value="" >Kies een klant ...</option>: null}
                                  { this.props.item.customers && this.props.item.customers['hydra:totalItems'] >= 1 ? this.props.item.customers['hydra:member'].map(item => {
                                    return(<option key={item.id} value={item.id} >{item.name} {console.log(item)}</option>)
                                }) : <option>Loading...</option> }  
            </Input>
            { this.state.hoursworked !== null  ? this.state.customer !== "" ?
            <div>
            <p> Dagen: {this.state.hoursworked.day} Uren: {this.state.hoursworked.hour} Minuten: {this.state.hoursworked.minute} Seconds: {this.state.hoursworked.seconds} </p>
            <p>Aantal taken: {this.props.item.customerItems['hydra:totalItems'] }</p>
            </div>
                : "0" : null }
            </CardBody>
            }
            </Card>
            </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    item: state.item,
    error: state.error,
})
export default connect(mapStateToProps,{ getProfile, updateProfile , getCustomerItems })(Profile)