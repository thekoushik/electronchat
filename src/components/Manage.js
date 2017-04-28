import React, { Component } from 'react';
import './Manage.css';
import Emojify,{emojify} from 'react-emojione';
import emojis from '../utils/emoji_icons';

const ipcRenderer = window.require('electron').ipcRenderer;
const options = {
    convertShortnames: true,
    //convertUnicode: true,
    //convertAscii: true,
    style: {
        backgroundImage: '',// 'url("images/emojione.sprites.png")',
        height: 24,
        margin: 4,
    },
    output:''
};

class Manage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { currentReceivers: [], chats: [], chat_txt: "", user_info: null, emojipanel:false,emojipanelsel:0 }
        this.navigate = this.navigate.bind(this);
        this.render_chat_line = this.render_chat_line.bind(this);
        this.send_chat_text = this.send_chat_text.bind(this);
        this.scrollChatToBottom.bind(this);
        this.addChat.bind(this);
        this.state.chats.push({
            text: ""
        });
        this.render_emoji_panel.bind(this);
        this.render_emoji_li.bind(this);
    }
    navigate(route) {
        this.props.navigate(route);
    }
    componentDidMount() { //after render
        var info = ipcRenderer.sendSync('get-info', '1');
        var sel = ipcRenderer.sendSync('current-selected-ip');
        this.setState({ currentReceivers: sel, user_info: info });
        //console.log('current-selection', sel);
        ipcRenderer.on('chat-get', (e, arg) => {
            this.addChat(arg);
            //console.log('chat',arg);
        });
        ipcRenderer.on('chat-send-result', (e, arg) => {
            console.log('chat-result', arg);
        });
        ipcRenderer.on('same-link-revisit',(e,msg)=>{
            var sel = ipcRenderer.sendSync('current-selected-ip');
            this.setState({ currentReceivers: sel });
            console.log('load/reload data for ',sel);
        });
    }
    componentWillUnmount() { //before destroy
    }
    scrollChatToBottom() {
        if (this.chatList) {
            const el = this.chatList.children[this.chatList.children.length - 1];
            if (el) el.scrollIntoView();
        }
    }
    addChat(c, me) {
        this.state.chats[this.state.chats.length - 1] = c;
        if(me)
            this.setState({ chat_txt: "", chats: this.state.chats.concat({ text: "" }) });
        else
            this.setState({ chats: this.state.chats.concat({ text: "" }) });
        this.scrollChatToBottom();
    }
    send_chat_text(e) {
        var txt = this.state.chat_txt;
        if (e.charCode === 13 && txt.trim().length > 0 && this.state.currentReceivers.length>0) {
            var newchat = {
                sender: this.state.user_info.name,
                sender_ip: this.state.user_info.ip,
                receivers: this.state.currentReceivers,
                text: txt,
                sent: false,
                time: new Date().toLocaleString()
            };
            ipcRenderer.send('send-chat', newchat);
            this.addChat(newchat, true);
        }
    }
    render_emoji_li(i){
        var self=this;
        return i.map((emo,index)=>{
            return (
                <Emojify key={index}
                         style={{margin:"2px", height: 24, width: 24,backgroundImage:''}}
                         onClick={(e)=>{
                            this.setState({ chat_txt: self.state.chat_txt+emo });
                         }}>
                    <span className="emoji">{emo}</span>
                </Emojify>
            );
        });
    }
    //ref={(div) => {self.emojiList[index] = div;}}
    render_emoji_panel(btn){
        var self=this;
        return emojis.map((image,index)=>{
            if(btn)
                return(
                    <button key={index}
                            className={"btn btn-large btn-default "+(self.state.emojipanelsel==index?"active":"")}
                            style={{paddingBottom:"0px",paddingLeft:"5px",paddingRight:"5px"}}
                            onClick={(e)=>{
                                if(self.state.emojipanelsel!=index)
                                    self.setState({emojipanelsel:index});
                            }}>
                        <Emojify style={{height: 24, width: 24,backgroundImage:''}}>
                            <span className="emoji">{image[0]}</span>
                        </Emojify>
                    </button>
                );
            else
                return(
                    <div className={ self.state.emojipanelsel==index ? "" : "hidden_true" }
                         key={index}>
                        {this.render_emoji_li(image)}
                    </div>
                );
        });
    }
    render_chat_line() {
        var self = this;
        const count = this.state.chats.length - 1;
        return this.state.chats.map((txt, index) => {
            if (index == count)
                return (
                    <li key={index} className="list-group-item" >
                        <div>
                            <strong> &nbsp; </strong>
                            <p> Last online at { new Date().toLocaleString() } </p>
                        </div>
                    </li>
                );
            else
                return (
                    <li key = { index } className = "list-group-item" >
                        <div className = { "chat_lines " + (txt.sender_ip === self.state.user_info.ip ? "my_text" : "his_text") } >
                            <strong className = "chat_text emoji" > { emojify(txt.text,options) } </strong>
                            <p> { txt.time } </p>
                        </div>
                    </li>
                );
        });
    }
    render() {
        var self = this;
        return (
            <div className="chat-widget-holder">
                <ul className="list-group chat-header">
                    <li className="list-group-header">
                        <div className="media-body pull-left">
                            <strong> You </strong>
                        </div>
                        <div className="media-body pull-right">
                            <strong> Other </strong>
                        </div>
                    </li>
                </ul>
                <div className="chat_list_container">
                    <ul className="list-group list-group2 chat_list" ref={(div) => {self.chatList = div;}}>
                        { this.render_chat_line() }
                    </ul>
                </div>
                <div className="chat_input">
                    <span className={"emoji_panel_drawer icon "+ (this.state.emojipanel?"icon-up-circled":"icon-down-circled") } onClick={(e)=>{this.setState({emojipanel:!this.state.emojipanel});}} ></span>
                    <div className={"toolbar panel panel-default hidden_"+ this.state.emojipanel }>
                        <div className="panel-heading">
                            <div className="btn-group">
                                {this.render_emoji_panel(true)}
                            </div>
                        </div>
                        <div className="panel-body">
                            {this.render_emoji_panel()}
                        </div>
                    </div>
                    <input type="text"
                        value={ this.state.chat_txt }
                        onChange={(e) => { this.setState({ chat_txt: e.target.value }); }}
                        onKeyPress={ this.send_chat_text }
                        className="form-control pull-left"
                        placeholder="Enter Text.."/>
                </div>
            </div>
        );
    }
}

export default Manage;