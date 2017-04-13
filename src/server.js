var Chat=require('./Chat');
var fs = require('fs');
var scan=require('./iptest');
var ipc=require('electron').ipcMain;
const {dialog} = require('electron');
const config=require('./config');
var db=require('./db');
var browser=null;
function sendView(req,res, filename){
    fs.readFile(__dirname + '/views/'+filename+'.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading '+filename);
                }
                res.writeHead(200);
                res.end(data);
            });
}
var router={
    "GET /__index__":function(req,res){
        sendView(req,res,'index');
    },
    "GET /___join___":function(req,res){
        sendView(req,res,'join');
    },
    "GET /___host___":function(req,res){
        sendView(req,res,'host');
    },
    "GET /___user___":function(req,res){
        sendView(req,res,'user');
    },
    "GET /__ping_chat_":function(req,res){
        res.writeHead(200);
        res.end("pong_chat "+Chat.host);
    }
};
ipc.on('host',(e,msg)=>{
    Chat.host=1;
});
ipc.on('gethosts',(e,d)=>{
    scan().then((arr)=>{
        e.sender.send('hosts', arr);
    }).catch(()=>{});
});
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
function staticFile(filename,res){
    fs.readFile(__dirname + filename,
        function (err, data) {
            if (err) {
                res.writeHead(404);
                return res.end('Error loading '+filename);
            }
            res.writeHead(200);
            res.end(data);
        });
}
var app=require("http").createServer(function (req, res) {
    //fs.appendFile('req_log.txt','\r\n---------------\r\n'+JSON.stringify(req, null, 4));
    console.log(req.method,req.url);
    if(req.url.startsWith('/static/'))
        staticFile(req.url,res);
    else{
        var router_path=router[req.method+' '+req.url];
        if(router_path==undefined){
            res.end("404");
        }else
            router_path(req,res);
    }
    //res.end("I'm "+((Chat.host)?"listening":"not listening"));
});
var io=require('socket.io')(app);
app.listen(9000);
io.on('connection', function (socket) {
  socket.on('ping_chat', function (data) {
    socket.emit('pong_chat', data);
  });
});

module.exports={
    server:app,
    browser:browser
};