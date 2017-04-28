import React,{Component} from 'react';

export class EmojiPanel extends Component{
    constructor(props){
        super(props);
        this.state={emojipanelsel:0};
    }
    shouldComponentUpdate(nextProps,nextState) {
        return true;
        /*return (nextProps.ids !== this.props.ids
             || nextProps.data !== this.props.data);*/
    }
    render(){
        return(
            <div>
                awd
            </div>
        );
    }
}