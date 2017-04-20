function Chat(){
    this.myself="";
    this.host=1;
    this.browser=null;
    this.join=[];
    this.availables=[];
    this.blacklistIPs=[];
    this.currentSelections=[];
}
module.exports = new Chat();