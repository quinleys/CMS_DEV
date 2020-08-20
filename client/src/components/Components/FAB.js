import React, { Component } from 'react'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
export default class FAB extends Component {
    toggle = () => {

    }
    render() {
        return (
            <div>
                <Fab size="large" color="secondary" aria-label="add" className="fab" onClick={this.toggle()} >
                      <AddIcon/>
                </Fab>
            </div>
        )
    }
}
