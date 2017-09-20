//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
require("../css/alerm.less");
var urlTools = require("../../common/urls.js");
var dict = require("../../common/dict.js");


module.exports = ['$scope','$http','$uibModal', function ($scope,$http,$uibModal) {
	$scope.dictData = {};
	var gridObj;
	$scope.alermPageUrl = urlTools.getUrl("alermPage");
	dict.load($http,["alarm_type"],function(result){
      angular.extend($scope.dictData,result);
  });
	
	$scope.form = {
		showSearch :true,
		data:{
				alarmType:null
		},
		show:function(){
			return this.showSearch;
		},
		searchChange : function(){
			this.showSearch = !this.showSearch;
			if(this.showSearch){
				gridObj.resize(113);
			}else{
				gridObj.resize(61);
			}
		},
		query : function(){
			gridObj.load(this.data);
		},
		reset:function(){
			this.data = {
				alarmType:null
			};
			gridObj.load(this.data);
		}
	}
	
	
	//新增功能
	
	$scope.openOpDlg = function(item){//单个处理
		if(item==null){
			//批量处理
			item = gridObj.getChecked();
			if(item.length==0){
				toaster.info("请先选择需要处理的报警记录");
				return;
			}
		}
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '/modules/alerm/html/alermDlg.html',
      controller: 'alermDlgController', //在index.js里注册
      appendTo: angular.element(document.body),
      backdrop:"static",
      resolve: {
        item: function () {
          return item;
        }
      }
    });
    modalInstance.result.then(function(){
    	gridObj.load();
    });
  }
	
	
	
	
	
	
	
	$scope.gridALink= function(name,item){
		$scope.openOpDlg(item);
	};
	$scope.gridRow = function(row){
		//TODO 待处理状态
		if(row.disposeTime==null){
			row.op="<a name='edit'>处理</a>";
		}
		return row;
	};
	$scope.gridObj = function(grid){
		gridObj = grid;
		gridObj.load();
	}
	
}];
