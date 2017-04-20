var Chat=require('./Chat');
var fs = require('fs');
const config=require('./config');
var scan=require('./iptest');
const request = require('request');
const querystring = require('querystring');
var ipc=require('electron').ipcMain;
const {dialog} = require('electron');
var db=require('./db');
var browser=null;
var router={
    "POST /__chat_":function(req,res){
        var queryData="";
        req.on('data', function(data) {
            queryData += data;
            /*if(queryData.length > 1e6) {
                queryData = "";
                res.writeHead(413, {'Content-Type': 'text/plain'}).end();
                req.connection.destroy();
            }*/
        });
        req.on('end', function() {
            Chat.browser.webContents.send('chat-get', querystring.parse(queryData));
            res.writeHead(200);
            res.end("sent");
        });
    },
    "GET /__ping_chat_":function(req,res){
        var ip=req.connection.remoteAddress.split(":").pop();
        Chat.browser.webContents.send('incoming_ping', ip);
        res.writeHead(200);//,{'Content-Type': 'application/json'});
        res.end("pong_chat,"+Chat.host+","+config.computerName);
    }
};
ipc.on('asynchronous-message', (event, arg) => {
    event.sender.send('asynchronous-reply', 'pong')
});
ipc.on('synchronous-message', (event, arg) => {
    event.returnValue = 'pong'
});
ipc.on('host',(e,msg)=>{
    Chat.host=1;
});
ipc.on('select-ip',(e,msg)=>{
    Chat.currentSelections=[msg];
    e.returnValue=1;
});
ipc.on('get-info',(e,msg)=>{
    e.returnValue={name: config.computerName};
})
ipc.on('send-chat',(e,msg)=>{
    request.post({
        url:'http://'+msg.receivers[0].ip+':'+config.innerPORT+'/__chat_',
        form: {sender:msg.sender,text:msg.text,time:msg.time}
    },(err,resp,body)=>{
        if(!err){
            if(body.trim()=="sent")
                console.log('sent');
        }else{
            console.log('not sent');
        }
    });
    e.returnValue=1;
});
ipc.on('current-selected-ip', (event, arg) => {
    event.returnValue = Chat.currentSelections;
});
ipc.on('scanAgain',(e,arg)=>{
    scan().then((arr)=>{
        Chat.availables=arr;
        e.sender.send('hosts', arr);
        e.sender.send('scan-complete','1');
    }).catch(()=>{
        Chat.availables=[];
        e.sender.send('hosts',null);
        e.sender.send('scan-complete','1');
    });
})
ipc.on('fetchuser',(e,d)=>{
    db.find({username:config.computerName},(er,d)=>{
        if(d.length>0){
            e.sender.send('user',d[0]);
        }
    });
})
ipc.on('userphoto',(e,d)=>{
    if(Chat.browser==null) return;
    dialog.showOpenDialog(Chat.browser,{
        filters: [{ name: 'Images', extensions: ['png','jpg','bmp'] }],
        properties: ['openFile']
    },function(paths){
        if(paths){
            //Chat.browser.minimize();
            var file=config.newStoreFile(config.getFileNameFromFullPath(paths[0]));
            db.find({username:config.computerName},(e,d)=>{
                if(d.length>0){
                    if(d[0].photo!="")
                        fs.unlinkSync(d[0].photo);
                    fs.createReadStream(paths[0]).pipe(fs.createWriteStream(file));
                    d[0].photo=file;
                    db.update(d[0]._id,d[0]);
                }
            });
        }
    });
});
var app=require("http").createServer(function (req, res) {
    console.log(req.method,req.url);
    var router_path=router[req.method+' '+req.url];
    if(router_path==undefined){
        res.end("404");
    }else
        router_path(req,res);
});
//var io=require('socket.io')(app);
app.listen(config.innerPORT);
/*io.on('connection', function (socket) {
  socket.on('ping_chat', function (data) {
    socket.emit('pong_chat', data);
  });
});
*/
module.exports={
    server:app,
    browser:browser
};