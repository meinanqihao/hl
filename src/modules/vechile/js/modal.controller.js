//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
var urlTools = require("../../common/urls.js");
var dict = require("../../common/dict.js");
require("../css/vechile.less");



module.exports = ['$scope','$http','$uibModal', function ($scope,$http,$uibModal) {
	$scope.dictData = {};
	var gridObj;
	$scope.vehiclePageUrl = urlTools.getUrl("vehiclePage");
	dict.load($http,["vechile_type"],function(result){
      angular.extend($scope.dictData,result);
  });
	
	$scope.form = {
		showSearch :true,
		data:{
				orgName:null,
				vechileType:null,
				plateNo:null,
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
				orgName:null,
				vechileType:null,
				plateNo:null,
				province:"",
				city:"",
				county:""
			};
			gridObj.load(this.data);
		}
	}
	$scope.clearRelation = function(){
		var vechile = gridObj.getSelected();
		if(vechile==null){
			toaster.info("请先选择车辆");
			return;
		}
		
		if(vechile.deviceUuid==null||vechile.deviceUuid==""){
			toaster.info("该车辆未绑定设备,无需解绑");
			return;
		}
		toaster.confirm("确认解绑’"+vechile.plateNo+"‘车辆的设备关联吗?",function(flag){
			if(!flag)return;
			$http.post(urlTools.getUrl("vehicleUnBind"),{
				vechileUuid:vechile.vechileUuid,
				version:vechile.version,
				deviceUuid:vechile.deviceUuid
			}).then(function(result){
						toaster.success("设备解绑车辆成功");
		        gridObj.load();
		    });
		});
		
	} 
	//新增功能
	$scope.openRelationDlg = function(){
		var vechile = gridObj.getSelected();
		if(vechile==null){
			toaster.info("请先选择车辆");
			return;
		}
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '/modules/vechile/html/relation.html',
      controller: 'relationDevice', //在index.js里注册
      appendTo: angular.element(document.body),
      backdrop:"static",
      windowClass:"dlg-400",
      resolve: {
        vechile: function () {
          return vechile;
        }
      }
    });
    modalInstance.result.then(function(){
    	gridObj.load();
    });
  }
	
	//新增功能
	
	$scope.openVechileDlg = function(vechile){

    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '/modules/vechile/html/vechileDlg.html',
      controller: 'vechileDlgController', //在index.js里注册
      appendTo: angular.element(document.body),
      backdrop:"static",
      windowClass:"dlg-780",
      resolve: {
        vechile: function () {
          return vechile;
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
			$scope.openVechileDlg(item);
		}else{
			toaster.confirm("确定删除'"+item.plateNo+"'车辆吗？",function(flag){
				if(flag){
					//删除事件
					$http.post(urlTools.getUrl("delVehicle"),{vechileUuid:item.vechileUuid})
				      .then(function(result){
								toaster.success("删除车辆成功");
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
