import React,{Component} from 'react';

const ipcRenderer = window.require('electron').ipcRenderer;

export default class Sidebar extends Component{
    constructor(props){
        super(props);
        this.state = {pings: [],availables:[]}
        this.ipClick=this.ipClick.bind(this);
        this.navigate=this.navigate.bind(this);
    }
    componentDidMount(){
      ipcRenderer.on('hosts', (event, arg) => {
          console.log(arg);
          this.setState({availables: arg});
      });
    }
    navigate(route){
        this.props.navigate(route);
    }
    ipClick(index){
      //console.log(index,this.state.availables[index]);
      ipcRenderer.sendSync('select-ip',this.state.availables[index]);
      this.navigate('/manage');
    }
    renderIps(){
      return this.state.availables.map((machine, index) => {
          return (
            <span key={index} className="nav-group-item" onClick={(e)=>{this.ipClick(index);}}>
              <span className="icon icon-signal"></span>
              {machine.name}({machine.ip})
            </span>
          );
      })
    }
    /*
    <span className="nav-group-item">
                <span className="icon icon-home"></span>
                connors
              </span>
              <span className="nav-group-item active">
                <span className="icon icon-light-up"></span>
                Photon
              </span>
              <span className="nav-group-item">
                <span className="icon icon-download"></span>
                Downloads
              </span>
              <span className="nav-group-item">
                <span className="icon icon-folder"></span>
                Documents
              </span>
              <span className="nav-group-item">
                <span className="icon icon-window"></span>
                Applications
              </span>
              <span className="nav-group-item">
                <span className="icon icon-signal"></span>
                AirDrop
              </span>
              <span className="nav-group-item">
                <span className="icon icon-monitor"></span>
                Desktop
              </span>
    */
    render(){
        return(
        <div className="pane pane-sm sidebar">
            <nav className="nav-group">
              <h5 className="nav-group-title">Friends</h5>
              {this.renderIps()}
            </nav>
          </div>
        );
    }
}