import React, {Component} from 'react';
import {Link} from 'react-router-dom';
//import './Home.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Host extends Component {
    constructor(props,context) {
        super(props,context);
        this.state = {pings: []}
    }

    componentDidMount() {//after render
      ipcRenderer.on('incoming_ping', (event, arg) => {
          console.log(arg);
          //this.setState({pings: this.state.pings.concat(arg)});
      });
    }
    componentWillUnmount() {//before destroy
    }

    render() {
        return (
            <table className="table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Kind</th>
                  <th>Date Modified</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Link to="/">bars.scss</Link></td>
                  <td>Document</td>
                  <td>Oct 13, 2015</td>
                  <td>connors</td>
                </tr>
                <tr>
                  <td>base.scss</td>
                  <td>Document</td>
                  <td>Oct 13, 2015</td>
                  <td>connors</td>
                </tr>
              </tbody>
            </table>
        );
    }
}

export default Host;