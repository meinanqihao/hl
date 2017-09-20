var tipDlg = require("./toaster.js");
var commonRules = {
	showErr:function(info){
		tipDlg.warning(info);
	},
	/*不能为空*/
	notNull:function(rule,value,fieldName){
		if(value==null||value==''){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"不能为空"));
			return false;
		}
		return true;
	},
	/*数字英文组合且大于6位额密码验证*/
	passwordone:function(rule,value,fieldName){
		if(!(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,})$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"必须为数字、字母、且大于6位"));
			return false;
		}
		return true;
	},
	/*大于6位且不为空的密码验证*/
	passwordnum:function(rule,value,fieldName){
		if(!(/^[^\s]{6,}$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"密码长度不能小于6位"));
			return false;
		}
		return true;
	},
	/*邮箱*/
	email:function(rule,value,fieldName){
		if(!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"不符合邮箱格式"));
			return false;
		}
		return true;
	},
	/*手机及固话*/
	phone:function(rule,value,fieldName){
		if(!(/^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"不符合规则"));
			return false;
		}
		return true;
	},
	phoneNumber:function(rule,value,fieldName){
		if(!(/^0\d{2,3}-?\d{7,8}$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"为区号+号码的格式"));
			return false;
		}
		return true;
	},
	mobile:function(rule,value,fieldName){
		if(!(/1^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"不符合移动电话格式"));
			return false;
		}
		return true;
	},
	/*身份证*/
	IdCard:function(rule,value,fieldName){
		if(!(/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"错误"));
			return false;
		}
		return true;
	},
	/*中文*/
	chinese:function(rule,value,fieldName){
		if(!(/^[\u0391-\uFFE5]+$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"必须为汉字"));
			return false;
		}
		return true;
	},
	/*银行卡号*/
	bankNo:function(rule,value,fieldName){
		if(!(/^(([0-9]{1,100}-[0-9]{1,100}|[0-9]{1,100}))$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"不符合银行卡格式"));
			return false;
		}
		return true;
	},
	/*证件号码*/
	certCode:function(rule,value,fieldName){
		if(!(/^(([a-zA-Z0-9]{1,100}-[a-zA-Z0-9]{1,100}|[a-zA-Z0-9]{1,100}))$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"输入必须数字或字母格式！"));
			return false;
		}
		return true;
	},
	/*正整数*/
	positiveInteger:function(rule,value,fieldName){
		if(!(/^[1-9]*[1-9][0-9]*$/.test(value))){
			//提示信息
			commonRules.showErr(fieldName+(rule.desc||"必须是正整数！"));
			return false;
		}
		return true;
	}




}
/*
*
* key:["字段名",{type:,desc:}]
*
*/

module.exports = {
	valid:function(rules,values,callback){
		var flag = true,ruleList;
		for(var key in rules){
			ruleList = rules[key];
			for(var i=1;i<ruleList.length;i++){
				flag = commonRules[ruleList[i].type](ruleList[i],values[key],ruleList[0]);
				if(!flag){
					break;
				};
			}
			if(!flag){
				break;
			};
		}
		return flag;
	},
	validField:function(rule,value){
		var flag = true;
		for(var i=1;i<rule.length;i++){
			flag = commonRules[rule[i].type](rule[i],value,rule[0]);
			if(!flag){
				break;
			};
		}
		return flag;
	}
};