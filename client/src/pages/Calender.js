import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { ViewState } from '@devexpress/dx-react-scheduler';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
  MonthView,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AllDayPanel,
  AppointmentTooltip,
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import Grid from '@material-ui/core/Grid';
import Room from '@material-ui/icons/Room';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import moment from 'moment'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getItemsDate } from '../actions/itemActions';
import { connect } from 'react-redux';
import Spinner from '../components/Loading/Spinner';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
const schedulerData = [
  { startDate: '2020-08-16T09:45', endDate: '2020-08-16T11:00', title: 'Meeting' },
  { startDate: '2020-08-16T12:00', endDate: '2020-08-16T13:30', title: 'Go to a gym' },
];
const style = theme => ({
    todayCell: {
        backgroundColor: fade(theme.palette.primary.main, 0.1),
        '&:hover': {
          backgroundColor: fade(theme.palette.primary.main, 0.14),
        },
        '&:focus': {
          backgroundColor: fade(theme.palette.primary.main, 0.16),
        },
      },
      weekendCell: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        '&:hover': {
          backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
        '&:focus': {
          backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
      },
      today: {
        backgroundColor: fade(theme.palette.primary.main, 0.16),
      },
      weekend: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
      },
    header: {
        backgroundColor: '#9147ff',
      },
    commandButton: {
    color: 'white'
  },
  textCenter: {
      textAlign: 'center'
  }
  });
  const Content = withStyles(style, { name: 'Content' })(({
    children, appointmentData, classes, ...restProps
  }) => (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <Grid container alignItems="center" style={{ color: 'black'}}>
        <Grid item xs={2} className={classes.textCenter}>
          <Room className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <span>{appointmentData.customer.name}</span>
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  ));
  const Header = withStyles(style, { name: 'Header' })(({
    children, appointmentData, classes, ...restProps
  }) => (
    <AppointmentTooltip.Header
      {...restProps}
      appointmentData={appointmentData}
      className={classes.header} 
    >
      <IconButton
        /* eslint-disable-next-line no-alert */
        onClick={() =>  window.location.replace("http://localhost:3000/posts:"+ appointmentData.id)}

      >
       <VisibilityIcon style={{ color: 'white'}} />
      </IconButton>
    </AppointmentTooltip.Header>
  ));
  const CommandButton = withStyles(style, { name: 'CommandButton' })(({
    classes, ...restProps
  }) => (
    <AppointmentTooltip.CommandButton {...restProps} className={classes.commandButton} />
  ));
const TimeTableCellBase = ({ classes, ...restProps }) => {
    const { startDate } = restProps;
    const date = new Date(startDate);
    if (date.getDate() === new Date().getDate()) {
      return <WeekView.TimeTableCell {...restProps} className={classes.todayCell} />;
    } if (date.getDay() === 0 || date.getDay() === 6) {
      return <WeekView.TimeTableCell {...restProps} className={classes.weekendCell} />;
    } return <WeekView.TimeTableCell {...restProps} />;
  };
  
  const TimeTableCell = withStyles(style, { name: 'todayCell' })(TimeTableCellBase);
  
  const DayScaleCellBase = ({ classes, ...restProps }) => {
    const { startDate, today } = restProps;
    if (today) {
      return <WeekView.DayScaleCell {...restProps} className={classes.todayCell}/>;
    } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
      return <WeekView.DayScaleCell {...restProps} className={classes.weekend} />;
    } return <WeekView.DayScaleCell {...restProps} />;
  };
  const DayScaleCell = withStyles(style, { name: 'todayCell' })(DayScaleCellBase);
class Calender extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentDate: moment().format("YYYY-MM-DDTHH:mm"), 
            data: [],
            makeData: true,
            currentViewName: 'Day',
            hoursworked: 0,
            hourspauze: 0,
        }
    }
    componentDidMount(){
        console.log(this.state.currentDate, 'datum')
        let startdate = moment(this.state.currentDate).subtract(1, 'days').format('YYYY-MM-DD');
        let enddate = moment(this.state.currentDate).add(1, 'days').format('DD-MM-YYYY');
        let url = '&date[strictly_after]=' + startdate + '&date[strictly_before]=' + enddate
        this.props.getItemsDate(url)
    }
    currentViewNameChange = (currentViewName) => {
        console.log(this.state.currentViewName, currentViewName)
        this.setState({ currentViewName: currentViewName }, function(){
          if(this.state.currentViewName == 'Week'){
            let beginWeek =   moment(this.state.currentDate).startOf('week').format('YYYY-MM-DD') ;
            let endWeek =   moment(this.state.currentDate).endOf('week').format('YYYY-MM-DD') ;
            let url = '&date[after]=' + beginWeek + '&date[before]=' + endWeek
            this.props.getItemsDate(url) 

          }else if (this.state.currentViewName == "Month"){
            let beginmonth =   moment(this.state.currentDate).startOf('month').format('YYYY-MM-DD');
            let endmonth =  moment(this.state.currentDate).endOf('month').format('YYYY-MM-DD');
            let url = '&date[after]=' + beginmonth + '&date[before]=' + endmonth
            this.props.getItemsDate(url) 
          }
          this.setState({
            makeData: true
        })
        })
      

      };
    setCorrect = () => {
        console.log(this.state.currentDate, 'datum2')
        this.setState({
            data: []
        }, function(){
            if(this.state.makeData){

                this.props.item.calendarItems['hydra:member'].map(m => {
/*                   let endtime = moment(m.date).format('YYYY-MM-DD') + 'T' +  m.stop).diff(moment(m.pauze));
                  console.log(endtime,"endtime", m.stop, m.pauze) */
                  let calcpauze = new Date (moment(m.date).format('YYYY-MM-DD') + 'T' + m.pauze);
                  let calcStart = new Date(moment(m.date).format('YYYY-MM-DD') + 'T' + m.stop)
                  let hours = calcStart.setHours(calcStart.getHours() + calcpauze.getHours())
                  console.log(calcStart.getHours() + calcpauze.getHours())
                  let minutes = calcStart.setMinutes(calcStart.getMinutes() + calcpauze.getMinutes())
                  console.log(calcStart.getMinutes() , calcpauze.getMinutes())
                  console.log(hours + minutes)
                  let total = hours + minutes
                  let item = {
                    "id" : m.id,
                    "title" : m.title,
                    "zerodate": moment(m.date).format('YYYY-MM-DD') + 'T' +'00:00:00',
                    "startDate": moment(m.date).format('YYYY-MM-DD') + 'T' + m.start,
                    "endDate": moment(m.date).format('YYYY-MM-DD') + 'T' + m.stop,
                    "pauze": moment(m.date).format('YYYY-MM-DD') + 'T' + m.pauze,
                    "calcstart": moment(m.date).format('YYYY-MM-DD') + 'T' + new Date(calcStart).toISOString().slice(11, -1) ,
                    "period": m.period,
                    'customer' : m.customer,
                  }
                  if(this.state.data.includes(item)){
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
                  this.calcStats()
                 })
              
                )
              
              }
        })

    }

    currentDateChange = (currentDate) => {
        console.log(this.state.currentDate,currentDate, 'datum 3')
        let date = moment(currentDate).format('YYYY-MM-DD')
        console.log(date, 'date 3')
        let startdate = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
        let enddate = moment(date).add(1, 'days').format('DD-MM-YYYY');
        
        
        this.setState({ currentDate : date });

         if(this.state.currentViewName == 'Week'){
             console.log('viewname is week')
          let beginWeek =   moment(currentDate).startOf('week').format('YYYY-MM-DD');
          let endWeek =   moment(currentDate).endOf('week').format('YYYY-MM-DD');
          let url = '&date[after]=' + beginWeek + '&date[before]=' + endWeek
        this.props.getItemsDate(url)
          this.setState({
            makeData: true,
          })
         }else if (this.state.currentViewName == "Day"){

            console.log('get new data')
            let url = '&date[strictly_after]=' + startdate + '&date[strictly_before]=' + enddate
            this.props.getItemsDate(url)

            this.setState({
                makeData: true,
              })
         }else if (this.state.currentViewName == "Month"){

            let beginmonth =   moment(currentDate).startOf('month').format('YYYY-MM-DD');
            let endmonth =  moment(currentDate).endOf('month').format('YYYY-MM-DD');
            let url = '&date[after]=' + beginmonth + '&date[before]=' + endmonth
            this.props.getItemsDate(url)

            this.setState({
                makeData: true,
              })
         }
      };
      calcStats = () => {
          if(!this.state.makeData){

         
          this.setState({
              hoursworked: 0,
              hourspauze: 0
          }, function(){
            console.log('calc stats', this.state.data)
            let uren = 0
            let pauze = 0
            this.state.data.map(m => {
                console.log(m)
              /*   console.log(m.calcstart.addHours(m.calcpauze.getHours()),'calc pauze') */
                uren = uren + moment(m.endDate).diff(moment(m.calcstart))
                pauze = pauze + moment(m.pauze).diff(moment(m.zerodate))
                console.log('PAUZE',m.pauze, moment(m.pauze), pauze)
               console.log(m.calcstart, m.endDate)
                console.log(pauze, 'pauze')
                console.log('uurkes',uren, this.state.hoursworked + uren)
                console.log(moment(uren).format('H-m-s'))
                console.log(moment(pauze).format('H-m-s'))
                this.setState({
                    hoursworked: this.convertMS(uren),
                    hourspauze: this.convertMS(pauze),
                }, function(){
                    console.log('states after fix', this.state.hoursworked, this.state.hourspauze)
                })
            })
          })
        }
      }

    convertMS = ( milliseconds )  => {
      console.log(milliseconds)
        var day = 0, hour = 0, minute = 0, seconds = 0;
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
    render() {

        return (
            <Container>
                 { this.props.item.calenderLoading && !this.props.item.calendarItems ? <Spinner /> : 
                 <div> 
                     <div className="my-3">
                        <h4>Statistieken</h4>
                    { this.state.currentViewName == "Day" || this.state.currentViewName == "Week" || this.state.currentViewName =="Month"? 
                    <div>
                        Uren gewerkt {this.state.currentViewName == "Day" ? "deze dag" : this.state.currentViewName == "Week" ? "deze week" : this.state.currentViewName == "Month" ? "deze maand" : null } : { this.state.hoursworked == 0 ? 0 : `${this.state.hoursworked.day} dagen ${this.state.hoursworked.hour}uren ${this.state.hoursworked.minute}minuten ${this.state.hoursworked.seconds} seconden`}
                        
                        <p>Pauze : {this.state.hourspauze.hour} uren {this.state.hourspauze.minute} minuten</p>
                        </div>
                    : null }
                    </div>     
                <Paper>
                    { this.props.item.calendarItems['hydra:totalItems'] >= 0 && this.state.makeData ?  this.setCorrect() : null }
                    {console.log('data',this.state.data, 'date', this.state.currentDate,)}
                    { this.state.makeData && this.state.data ? <Spinner /> :
                   
                    <Scheduler
                    data={this.state.data}
                    height={660}
                    >
                    <ViewState
                        defaultCurrentDate={this.state.currentDate}
                        defaultCurrentViewName={this.state.currentViewName}
            onCurrentViewNameChange={this.currentViewNameChange}
            onCurrentDateChange={this.currentDateChange}
                    />
                    
                    <DayView
                        startDayHour={4}
                        endDayHour={24}
                        timeTableCellComponent={TimeTableCell}
                        dayScaleCellComponent={DayScaleCell}
                    />

                 <WeekView
                  startDayHour={9}
                  endDayHour={24}
                  timeTableCellComponent={TimeTableCell}
                  dayScaleCellComponent={DayScaleCell}
                />
                             <MonthView />     
                        <Toolbar className="test" />
                        <DateNavigator />
                        <ViewSwitcher /> 
                        <Appointments style={{backgroundColor: "red" }}/>
                        <AppointmentTooltip
                          headerComponent={Header}
                          contentComponent={Content}
                          commandButtonComponent={CommandButton}
                          showCloseButton/>

                    </Scheduler>
                    
                    }
                </Paper>
                </div>
                   } 
            </Container>
        )
    }
}
Calender.propTypes = {
    item: PropTypes.object.isRequired,
    
}
const mapStateToProps = (state) => ({
    item: state.item,
    error: PropTypes.object.isRequired,
    getItemsDate: PropTypes.func.isRequired,
})
export default connect(mapStateToProps, {getItemsDate })(Calender);