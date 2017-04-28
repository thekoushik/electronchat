import React,{Component} from 'react';
import Emojify from 'react-emojione';
import emojis from '../utils/emoji_icons';

class EmojiToolbar extends Component{
    constructor(props){
        super(props);
        this.state={emojipanelsel:props.emojipanelsel};
        this.render_buttons.bind(this);
    }
    render_buttons(){
        var self=this;
        return emojis.map((emo,index)=>{
                    return(
                        <button key={index}
                                className={"btn btn-large btn-default "+(self.state.emojipanelsel===index?"active":"")}
                                style={{paddingBottom:"0px",paddingLeft:"5px",paddingRight:"5px"}}
                                onClick={(e)=>{
                                    if(self.state.emojipanelsel!==index){
                                        self.props.onToolbarSelect(index);
                                        self.setState({emojipanelsel:index});
                                    }
                                }}>
                            <Emojify style={{height: 24, width: 24,backgroundImage:''}}>
                                <span className="emoji">{emo[0]}</span>
                            </Emojify>
                        </button>
                    ); 
                });
    }
    render(){
        return(
            <div className="btn-group">
                {this.render_buttons()}
            </div>
        );
    }
}
class EmojiButtonSet extends Component{
    constructor(props){
        super(props);
        this.render_set.bind(this);
    }
    shouldComponentUpdate(nextProps,nextState){
        return (this.props.style.display!==nextProps.style.display);
    }
    render_set(){
        return this.props.emojilist.map((emo,index)=>{
                return(
                    <Emojify key={index}
                            style={{margin:"2px", height: 24, width: 24,backgroundImage:''}}
                            onClick={(e)=>{this.props.onEmojiClick(emo);}}>
                        <span className="emoji">{emo}</span>
                    </Emojify>
                );
            });
    }
    render(){
        return(
            <div style={{display:this.props.style.display}}>
                {this.render_set()}
            </div>
        );
    }
}

export default class EmojiPanel extends Component{
    constructor(props){
        super(props);
        this.state={emojipanelsel:0};
        this.onEmojiClick=this.onEmojiClick.bind(this);
        this.onToolbarSelect=this.onToolbarSelect.bind(this);
        this.render_emoji_set.bind(this);
    }
    shouldComponentUpdate(nextProps,nextState) {
        return (nextState.emojipanelsel!==this.state.emojipanelsel);
    }
    onToolbarSelect(i){
        this.setState({emojipanelsel:i});
    }
    onEmojiClick(shortname){
        this.props.onEmojiClick(shortname);
    }
    render_emoji_set(){
        return emojis.map((p,index)=>{
            return(
                <EmojiButtonSet key={index} emojilist={p} style={{display: this.state.emojipanelsel===index ? 'block' : 'none' }} onEmojiClick={this.onEmojiClick} />
            );
        })
    }
    render(){
        return(
            <div className="panel panel-default">
                <div className="panel-heading">
                    <EmojiToolbar emojipanelsel={0} onToolbarSelect={this.onToolbarSelect} />
                </div>
                <div className="panel-body">
                    {this.render_emoji_set()}
                </div>
            </div>
        );
    }
}