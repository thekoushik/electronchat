var util=require('util'),
    http=require('http');

var LISTEN_PORT=9000;

function MyServer(){
      http.Server.call(this, this.handle);
}
util.inherits(MyServer, http.Server);

MyServer.prototype.handle=function(req, res){
      res.end("Hello from server started by Electron app!");
};

MyServer.prototype.start=function(){
    this.listen(LISTEN_PORT, function(){
            console.log('Listening for HTTP requests on port %d.', LISTEN_PORT)
    });
};

MyServer.prototype.stop=function(){
    this.close(function(){
        console.log('Stopped listening.');
    });
};

module.exports=MyServer;