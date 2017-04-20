import React,{Component} from 'react';

const ipcRenderer = window.require('electron').ipcRenderer;

export default class Header extends Component{
    constructor(props){
        super(props);
        this.state={scaning:false};
        this.navigate=this.navigate.bind(this);
        this.scanAgain=this.scanAgain.bind(this);
    }
    componentDidMount() {
        var self=this;
        ipcRenderer.on('scan-complete', (event, arg) => {
            self.setState({scaning:false});
        });
    }
    navigate(route){
        this.props.navigate(route);
    }
    scanAgain(){
        this.setState({scaning:true});
        ipcRenderer.send('scanAgain','1');
    }
    render(){
        return (
            <div className="toolbar-actions">
                <div className="btn-group">
                    <button onClick={(e)=>{this.navigate('/')}} className="btn btn-default">
                        <span className="icon icon-home"></span>
                    </button>
                    <button onClick={(e)=>{this.navigate('/host')}} className="btn btn-default">
                        <span className="icon icon-folder"></span>
                    </button>
                    <button className={"btn btn-default "+(this.state.scaning?"active":"")} onClick={(e)=>{this.scanAgain()}}>
                        <span className="icon icon-arrows-ccw"></span>
                    </button>
                    <button className="btn btn-default active">
                        <span className="icon icon-popup"></span>
                    </button>
                    <button className="btn btn-default">
                        <span className="icon icon-shuffle"></span>
                    </button>
                </div>

                <button className="btn btn-default">
                    <span className="icon icon-home icon-text"></span>
                    Filters
                </button>

                <button className="btn btn-default btn-dropdown pull-right">
                    <span className="icon icon-megaphone"></span>
                </button>
            </div>
        );
    }
}