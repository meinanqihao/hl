require("./shim.js");
var encrypt = require("./encrypt.js");
function toTree(list,idName,pidName){
	var a = {};
	for(var i=0;i < list.length;i++){
		if(a[list[i][pidName]]!=null){
			a[list[i][pidName]].items = a[list[i][pidName]].items||[];
			a[list[i][pidName]].items.push(list[i]);
			list[i].isRoot=false;
		}
		a[list[i][idName]]=list[i];
	}
	var r=[];
	for(var tmp in a){
		if(a[tmp].isRoot!==false&&a[a[tmp][pidName]]==null){
			r.push(a[tmp]);
		}else if(a[tmp].isRoot!==false){
			a[tmp].isRoot=false;
			a[a[tmp][pidName]].items = a[a[tmp][pidName]].items ||[];
			a[a[tmp][pidName]].items.push(a[tmp]);
		}
	}
	return r;
}

var tools = {
		getValue:function(obj,tmpName){
			if(tmpName.indexOf('.')>-1){
				var name = tmpName.split('.');
				var v = obj;
				for(var i=0;i<name.length;i++){
					v = v[name[i]];
					if(v==null){
						return null;
					}
				}
				return v;
			}else{
				return obj[tmpName];
			}
		},
    md5 : encrypt.md5,
    encode64:encrypt.encode64,
    toTree:toTree,
    ajaxResult:function(result,func){
    	if(result.data.success){
    		func(result.data.body);
    	}else{
    		alert(result.data.errMsg);
    	}
    },
    toPage:function(page,params){
    	var href = window.location.href.split(/[\#\?]/g)[0];
    	if(params==null){
    		window.location.href = href+page;
    	}else{
    		window.location.href = href+"?"+encodeURI(angular.toJson(params))+page;
    	}
    },
    getPageParams:function(){
    	var hrefs = window.location.href.split(/[\#\?]/g);
    	hrefs.pop();
    	hrefs.shift();
    	var params = decodeURI(hrefs.join(""));
    	if(params==""){
    		return null;
    	}else{
    		return angular.fromJson(params);
    	}
    },
	getUuid : function() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 32; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[13] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[17] = hexDigits.substr((s[17] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		return s.join("");
	},
	/**

	 把参数加到source里去
	 source的格式为：xxx{0}/xxx{1} 其中，{0}是第一个参数 {1}是第二个参数
	 params是一个数组，每个值对应source里的一个参数

	 */
	formatUrl : function(source,params){
		for(var i = 0; i < params.length; i++){
			var item = params[i];
			source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
				return item;
			});
		}

		return source;
	},
	getCountDown:function(endTime,nowTime){
		var dt = endTime - nowTime;
		if(dt < 0)return null;
		var days = Math.floor(dt/dayTime);
		var hours = Math.floor((dt%dayTime)/hourTime);
		var minutes = Math.floor((dt%hourTime)/mintue);
		var seconds = Math.floor((dt%mintue)/second);
		var times = [days,hours,minutes,seconds].join("|").replace(/^(0*\|)*/g,"").split("|");
		var result = [];
		for(var i=0,j=times.length-1;j>=0;j--,i++){
				result.unshift(names[i]);
				result.unshift(times[j]);
		}
		return result.join("");
	},

	/**
	 * @method add
	 * 数值相加
	 * @param {String} a 被加数
	 * @param {String} b 加数
	 */
	add: function (a, b) {
		var c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
	},
	/**
	 * @method sub
	 * 数值相减
	 * @param {String} a 被减数
	 * @param {String} b 减数
	 */
	sub: function (a, b) {
		var c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
	},
	/**
	 * @method sub
	 * 数值相乘
	 * @param {String} a 被乘数
	 * @param {String} b 乘数
	 */
	mul: function (a, b) {
		var c = 0,
			d = a.toString(),
			e = b.toString();
		try {
			c += d.split(".")[1].length;
		} catch (f) {
		}
		try {
			c += e.split(".")[1].length;
		} catch (f) {
		}
		return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	},
	/**
	 * @method sub
	 * 数值相除
	 * @param {String} a 被除数
	 * @param {String} b 除数
	 */
	div: function (a, b) {
		var c, d, e = 0,
			f = 0;
		try {
			e = a.toString().split(".")[1].length;
		} catch (g) {
		}
		try {
			f = b.toString().split(".")[1].length;
		} catch (g) {
		}
		return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
	},

	init:function($location){
	    tool.$location = $location;
	},
	fillObj : function(tmp1,obj){
		for(var tmp in obj){
			tmp1 = tmp1.replace(new RegExp("{{"+tmp+"}}","g"),obj[tmp]);
		}
		tmp1 = tmp1.replace(new RegExp("{{[a-zA-Z0-9\\_]+}}","g"),"");
		return tmp1;
	}

}
var dayTime = 86400000,hourTime = 3600000,mintue = 60000 ,second = 1000,names = ["秒","分","小时","天"];
module.exports = tools;
