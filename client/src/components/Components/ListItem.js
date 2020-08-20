import React, { Component } from 'react'
import { ListGroupItem, Button, UncontrolledCollapse,} from 'reactstrap';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export default class ListItem extends Component {
    state = {
        dropdownOpen: false,

    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    render() {
        return (
                <ListGroupItem key={this.props.id}>
                    <p className="inline">{this.props.title}</p>
                    <Button color="dark" id="toggler">
                    <ArrowDropDownIcon />
                    </Button>
                    <UncontrolledCollapse toggler="#toggler">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni, voluptas debitis
                        similique porro a molestias consequuntur earum odio officiis natus, amet hic, iste sed
                        dignissimos esse fuga! Minus, alias.
                    </UncontrolledCollapse>
                </ListGroupItem>
        )
    }
}
