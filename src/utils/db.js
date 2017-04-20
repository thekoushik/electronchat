const config=require('./config');
var Datastore = require('nedb')
  , db = new Datastore({ filename: config.databaseFilePath, autoload: true });
function ORM(){
    var self=this;
    this.db=db;
    this.find=function(obj,cb){
        self.db.find(obj,cb);
    }
    this.findOne=function(id,cb){
        self.db.findOne({ _id: id },cb);
    }
    this.save=function(obj,cb){
        self.db.insert(obj,cb);
    }
    this.update=function(id,obj,cb){
        self.db.update({_id:id},{$set:obj},{upsert:true},cb);
    };
    this.find({username:config.computerName},(e,d)=>{
        if(d.length==0)
            self.save({username:config.computerName,photo:""});
    });
}
module.exports=new ORM();