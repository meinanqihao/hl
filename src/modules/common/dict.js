var urlTools = require("./urls.js");
var dictUrl = urlTools.getUrl("dictUrl");
var dict = {
    load:function($http,keys,callback){
    	var entryCodes = [];
    	var resu = {};
    	
    	for(var i=0;i < keys.length;i++){
    		if(window.dictMap==null||window.dictMap[keys[i]]==null){
    			entryCodes.push(keys[i]);
    		}else{
    			resu[keys[i]] = window.dictMap[keys[i]];
    		}
    	}
    	if(entryCodes.length==0){
    		callback(resu);
    	}else{
    		window.dictMap = window.dictMap||{};
	    	$http.get(dictUrl,{params:{entryCodes:entryCodes.join(',')}}).then(function(result){
	    			var bodyData = result.data.body;
	  				for(var j=0;j < bodyData.length;j++){
	  					window.dictMap[bodyData[j].entryCode] = bodyData[j].items;
	  					resu[bodyData[j].entryCode] = bodyData[j].items || [];
	  				}
	  				callback(resu);
	  		});
    	}
    }
}
module.exports = dict;
