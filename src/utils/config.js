const app=require('electron').app;
var path=require('path');
var fs=require('fs');
var os=require('os');

function Config(){
    var self=this;
    this.innerPORT=9000;
    this.myIP="";
    this.storagePath=app.getPath('userData');
    this.databaseFileName="Database.db";
    this.databaseFilePath=path.join(this.storagePath,this.databaseFileName);
    this.storeFolder=path.join(this.storagePath,"/store");
    this.computerName=os.hostname();

    if(!fs.existsSync(this.storeFolder))
        fs.mkdir(this.storeFolder);
    this.newStoreFile=function(filename){
        return path.join(self.storeFolder,filename);
    }
    this.getFileNameFromFullPath=function(filepath){
        return path.basename(filepath);
    }
    /*this.createChatUnit=function(receivers,txt,sender){
        if(!sender) sender=this.computerName;
        return {
            sender:sender,
            receivers:receivers,
            text:txt,
            sent:false
        };
    }*/
}
module.exports=new Config();