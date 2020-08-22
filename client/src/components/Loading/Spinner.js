import React, { Component } from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import CircularProgress from '@material-ui/core/CircularProgress';
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default class Spinner extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true
        };
      }
     
      render() {
        return (
           this.props.toggle ? 
          <div className="col-12 text-center">
            <CircularProgress style={{color: "#9147FF"}} className=" m-auto" />
          </div>
          : null
        );
      }
}
