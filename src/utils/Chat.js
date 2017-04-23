function Chat(){
    var browser=null;
    var appTray=null;
    var dialog=null;
    var balloonClickCallback=null;
    this.init=function(br,tr,dia){
        browser=br;
        appTray=tr;
        dialog=dia;
        appTray.on('balloon-click',()=>{
            if(balloonClickCallback) balloonClickCallback();
        });
        appTray.on('balloon-closed',()=>{
            if(balloonClickCallback) balloonClickCallback=null;
        });
    };
    /*this.setTray=function(t){
        appTray=t;
    };
    this.setBrowserWindow=function(b){
        browser=b;
    };*/
    this.showBaloon=function(title,content,cb){
        appTray.displayBalloon({title:title,content:content});
        if(cb) balloonClickCallback=cb;
    };
    this.sendToBrowserIPC=function(key,content){
        browser.webContents.send(key,content);
    };
    this.openDialog=function(opt,cb){
        if(browser==null) return;
        dialog.showOpenDialog(browser,opt,cb);
    };
    this.minimizeWindow=function(){
        browser.minimize();
    }
    this.msgbox=function(caption,message,detail){
        dialog.showMessageBox(browser,{
            type:"none",
            title:caption,
            message:message,
            detail:detail
        });
    }

    this.myself="";
    this.host=1;
    this.join=[];
    this.availables=[];
    this.blacklistIPs=[];
    this.currentSelections=[];
}
module.exports = new Chat();