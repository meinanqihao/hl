//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
var urlTools = require("../../common/urls.js");
var dict = require("../../common/dict.js");
require("../css/org.less");



module.exports = ['$scope','$http','$uibModal', function ($scope,$http,$uibModal) {
	$scope.orgList = null;
	$scope.dictData = {};
	var gridObj;
	$scope.orgGridUrl = urlTools.getUrl("orgPage");
	
	dict.load($http,["org_type"],function(result){
      angular.extend($scope.dictData,result);
  });
	$scope.form = {
		showSearch :false,
		data:{
				orgName:null,
				orgType:null,
				unitName:null
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
					orgType:null,
					unitName:null
			};
			gridObj.load(this.data);
		},
		searchMm : function(value){
			return $http.get(urlTools.getUrl("queryMmUnit"), {
	      params: {
	        address: value
	      }
	    }).then(function(response){
	      return response.data.body;
	    });
		}
	}
	
	

	$scope.tree = {
		selected:null,
		openFlag:false,
		treeClick : function(item,flag){
			if(flag){//切换收缩状态
				item.isOpen=!item.isOpen;
				this.openFlag=true;
			}else{
				//选择该组织
				this.select(item);
			}  
		},
		select:function(item){
			if(this.openFlag){
				this.openFlag =false;
				return;
			}
			if(this.selected != null){
				this.selected.isSelected=false;
			}
			this.selected = item;
			item.isSelected =true;
			if(item.orgType=="province"){
				gridObj.load({orgPath:null,province:item.orgName});
			}else{
				gridObj.load({orgPath:item.orgUuid,province:null});
			}
		},
		isOpen : function(isOpen){
			return !isOpen;
		}
	};
	//新增功能
	
	$scope.openOrgDlg = function(org){

    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '/modules/org/html/orgDlg.html',
      controller: 'orgDlgController', //在index.js里注册
      appendTo: angular.element(document.body),
      backdrop:"static",
      windowClass:"dlg-780",
      resolve: {
        org: function () {
          return org;
        }
      }
    });
    modalInstance.result.then(function(){
    	gridObj.load();
    });
  }
  
  $scope.openDeptDlg = function(dept){

    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '/modules/org/html/deptDlg.html',
      controller: 'deptDlgController', //在index.js里注册
      appendTo: angular.element(document.body),
      backdrop:"static",
      windowClass:"dlg-780",
      resolve: {
        dept: function () {
          return dept;
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
			if(item.orgType=='company'){
				$scope.openOrgDlg(item);
			}else{
				$scope.openDeptDlg(item);
			}
		}else{
			toaster.confirm("确定删除组织吗？",function(flag){
				if(flag){
					//删除事件
					$http.post(urlTools.getUrl("delOrg"),{orgUuid:item.orgUuid})
				      .then(function(result){
	       				toaster.success("删除组织成功");
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
		init();
	}
	
	function init(){
		$http.get(urlTools.getUrl("orgTree"))
	      .then(function(result){
	        var list = tools.toTree(result.data.body, 'orgUuid', 'parentOrgUuid');
	        $scope.orgList = list;
	        list[0].isOpen=true;
	        $scope.tree.select(list[0]);
	    });
	}
}];
