import React, {Component} from 'react';
import './App.css';
import {
  Switch,
  Route //,Link
} from 'react-router-dom';
import Home from './components/Home';
import Host from './components/Host';
import Manage from './components/Manage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
const PropTypes = require('prop-types');

const ipcRenderer = window.require('electron').ipcRenderer;

class App extends Component {
    constructor(props,context) {
        super(props,context);
        this.goto=this.goto.bind(this);
    }
    componentDidMount() {
    }
    goto(d){
        console.log(d);
        if(this.context.router.history.location.pathname==d)
            ipcRenderer.send('same-link-revisit',d);
        else
            this.context.router.history.replace(d);
    }
    render() {
        return (
            <div className="window" >
                <header className="toolbar toolbar-header">
                    <Header navigate={this.goto} />
                </header>
                <div className="window-content"  >
                    <div className="pane-group" >
                        <Sidebar navigate={this.goto} />
                        <div className="pane">
                            <Switch>
                                <Route exact path="/">
                                    <Home />
                                </Route>
                                <Route path="/host">
                                    <Host />
                                </Route>
                                <Route path="/manage">
                                    <Manage navigate={this.goto} />
                                </Route>
                            </Switch> 
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

App.contextTypes = {
   router: PropTypes.object.isRequired
};
export default App;