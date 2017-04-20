import React, {Component} from 'react';
import './Manage.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Manage extends Component {
    constructor(props,context) {
        super(props,context);
        this.state = {currentReceivers:[], chats: [],chat_txt:"",user_info:null}
        this.navigate=this.navigate.bind(this);
        this.render_chat_line=this.render_chat_line.bind(this);
        this.send_chat_text=this.send_chat_text.bind(this);
        this.scrollChatToBottom.bind(this);
        this.addChat.bind(this);
        this.state.chats.push({
          text:""
        });
    }
    navigate(route){
        this.props.navigate(route);
    }
    componentDidMount() {//after render
      var info=ipcRenderer.sendSync('get-info','1');
      var sel=ipcRenderer.sendSync('current-selected-ip');
      this.setState({currentReceivers:sel,user_info:info});
      console.log('current-selection',sel);
      ipcRenderer.on('chat-get',(e,arg)=>{
        this.addChat(arg);
        //console.log('chat',arg);
      })
    }
    componentWillUnmount() {//before destroy
    }
    scrollChatToBottom(){
      const el=this.chatList.children[this.chatList.children.length-1];
      if(el) el.scrollIntoView();
    }
    addChat(c,me){
      this.state.chats[this.state.chats.length-1]=c;
      if(me)
        this.setState({chat_txt:"",chats:this.state.chats.concat({text:""})});
      else
        this.setState({chats:this.state.chats.concat({text:""})});
      this.scrollChatToBottom();
    }
    send_chat_text(e){
      var txt=this.state.chat_txt;
      if (e.charCode === 13 && txt.trim().length>0){
        var newchat={
          sender:this.state.user_info.name,
          receivers:this.state.currentReceivers,
          text:txt,
          sent:false,
          time:new Date().toLocaleString()
        };
        ipcRenderer.sendSync('send-chat',newchat);
        this.addChat(newchat,true);
      }
    }
    render_chat_line(){
      var self=this;
      const count=this.state.chats.length-1;
      return this.state.chats.map((txt,index)=>{
        if(index==count)
          return (
              <li key={index} className="list-group-item">
                <div>
                  <strong>&nbsp;</strong>
                  <p>Last online at {new Date().toLocaleString()}</p>
                </div>
              </li>
          );
        else
          return (
            <li key={index} className="list-group-item">
              <div className={"chat_lines " + (txt.sender===self.state.user_info.name?"my_text":"his_text")}>
                <strong className="chat_text">{txt.text}</strong>
                <p>{txt.time}</p>
              </div>
            </li>
          );
      })
    }
    render() {
        var self=this;
        return (
            <div className="chat-widget-holder">
                  <ul className="list-group chat-header">
                      <li className="list-group-header">
                        <div className="media-body  pull-left">
                          <strong>You</strong>
                        </div>
                        <div className="media-body  pull-right">
                          <strong>Other</strong>
                        </div>
                      </li>
                  </ul>
                  <div className="chat_list_container">
                    <ul className="list-group list-group2 chat_list"
                        ref={(div) => {
                          self.chatList = div;
                        }}>
                      {this.render_chat_line()}
                    </ul>
                  </div>
                  <div className="chat_input">
                    <input
                        type="text"
                        value={this.state.chat_txt}
                        onChange={(e)=>{this.setState({ chat_txt: e.target.value });}}
                        onKeyPress={this.send_chat_text}
                        className="form-control pull-left"
                        placeholder="Enter Text.." />
                  </div>
            </div>
        );
    }
}

export default Manage;