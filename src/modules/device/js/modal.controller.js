//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
require("../css/device.less");
var urlTools = require("../../common/urls.js");



module.exports = ['$scope','$http','$uibModal', function ($scope,$http,$uibModal) {
	$scope.orgList = null;
	var gridObj;
	$scope.devicePageUrl = urlTools.getUrl("devicePage");
	$scope.form = {
		showSearch :true,
		data:{
				terminalModelNo:null,
				simNo:null,
				manufactureId:null,
				plateNo:null,
				orgName:null,
				province:"",
				city:"",
				county:""
		},
		show:function(){
			return this.showSearch;
		},
		searchChange : function(){
			this.showSearch = !this.showSearch;
			if(this.showSearch){
				gridObj.resize(148);
			}else{
				gridObj.resize(59);
			}
		},
		query : function(){
			gridObj.load(this.data);
		},
		reset:function(){
			this.data = {
				terminalModelNo:null,
				simNo:null,
				manufactureId:null,
				plateNo:null,
				orgName:null,
				province:"",
				city:"",
				county:""
			};
			gridObj.load(this.data);
		}
	}
	
	
	//新增功能
	
	$scope.openDeviceDlg = function(device){

    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '/modules/device/html/deviceDlg.html',
      controller: 'deviceDlgController', //在index.js里注册
      appendTo: angular.element(document.body),
      backdrop:"static",
      windowClass:"dlg-780",
      resolve: {
        device: function () {
          return device;
        }
      }
    });
    modalInstance.result.then(function(){
    	gridObj.load();
    });
  }
	
	
	
	
	
	
	
	$scope.gridALink= function(name,item){
		//TODO 点击事件
		if(name=='edit'){
			$scope.openDeviceDlg(item);
		}else{
			toaster.confirm("确定删除'"+item.manufactureId+"'设备吗？",function(flag){
				if(flag){
					//删除事件
					$http.post(urlTools.getUrl("delDevice"),{deviceUuid:item.deviceUuid})
				      .then(function(result){
								toaster.success("删除设备成功");
				        gridObj.load();
				    });
				}
			});
		}
	};
	$scope.gridRow = function(row){
		row.op="<a name='edit'>编辑</a><a name='delete'>删除</a>";
		return row;
	};
	$scope.gridObj = function(grid){
		gridObj = grid;
		gridObj.load();
	}
	
}];
