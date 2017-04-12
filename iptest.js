var exec = require('child_process').exec;
var os = require('os');
var async= require('async');
var request = require('request');
const TIMEOUT=100;
var scanNetwork=function(){
    return new Promise(function(resolve,reject){
        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces)
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal)
                    addresses.push(address.address);
            }
        if(addresses.length>0){
            const addr=addresses[0];
            const ip=addr.split('.');
            var availables=[];
            var tasks=[];
            for(var i=1;i<255;i++){
                var str_ip=ip[0]+"."+ip[1]+"."+ip[2]+"."+i;
                if(str_ip==addr) continue;
                tasks.push((function(strip){
                    return function(cb){
                        /*exec("ping "+strip+" -n 1 -w 2", (error, stdout, stderr) => {
                            if(stdout.indexOf("Reply from")>0){
                                availables.push(strip);
                            }
                            cb();
                        });*/
                        request({url:'http://'+strip+':9000/ping_chat',timeout:TIMEOUT},(err,resp,body)=>{
                            if(!err){
                                if(body.trim()==='pong_chat 1')
                                    availables.push(strip);
                            }
                            cb();
                        });
                    };
                })(str_ip));
            }
            async.parallel(tasks,function(err, results){
                console.log("End",availables);
                resolve(availables);
            });
        }else{
            console.log("Nop");
            reject(new Error("No Network"));
        }
    });
}
module.exports=scanNetwork;