import React, { Component } from 'react'
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import {Link} from 'react-router-dom'
import Switch from '@material-ui/core/Switch';
import { editItem } from '../../actions/itemActions'
import Spinner from '../Loading/Spinner'
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
class PostCard extends Component {
  constructor(props){
    super(props)
    this.state = {
      toggle: this.props.finished
    }
   
  }
  toggle = () => {
    this.setState({
      toggle: !this.state.toggle
    },function(){
      let item = { "finished" : this.state.toggle}
      this.props.editItem(item, this.props.id)
    })
  }
    render() {
        return (
          <div className="col-12">
     
            <Card className='my-3' >
          
              {this.props.item.loading ? <Spinner /> : 
              <div> 
            <CardContent>
              <div className="row">
                <div className="col-8 my-auto">
              <Typography  className="my-auto" color="textSecondary" gutterBottom>
               { moment(this.props.date).format("YYYY-MM-DD")}
              </Typography>
              </div>
              <div className="col-4 text-right" >
              <Switch
                checked={this.state.toggle}
                onChange={this.toggle}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              </div>
              </div>
              <Typography variant="h5" component="h2">
              {this.props.title}
              </Typography>
              <Typography  color="textSecondary">
              {this.props.customer}
              </Typography>
           
              <Typography variant="body2" component="p" className="mt-2">
            {this.props.materials.length == 0 ?  <Chip className="mr-1" label={'Geen materialen'}  /> : null}
               {this.props.materials.map(m => 
                   <Chip className="mr-1" label={m.name}  />
                )}
              </Typography>
            </CardContent>
            <CardActions>
            <Link className="w-100 text-white" to={{
                  pathname: `/posts:${this.props.id}`,
                                                    
                 }}>
              <Button className="w-100 text-white" variant="contained" startIcon={<VisibilityIcon />}size="small">Bekijk</Button>
              </Link>
            <Link className="w-100 text-white" to={{
                  pathname: `/posts:${this.props.id}/edit`,
                                                    
                 }}>
              <Button className="w-100 text-white" variant="contained" startIcon={<EditIcon />}size="small">Pas aan</Button>
              </Link>
            </CardActions>
            </div>
            }
          </Card>
      </div>
        )
    }
}

const mapStateToProps = state => ({
  item: state.item,
  auth: state.auth,
  error : state.error,
});
export default connect(mapStateToProps, { editItem })(PostCard)