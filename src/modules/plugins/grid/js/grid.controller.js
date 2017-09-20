var tools = require("../../../common/tools.js");

module.exports = ['$scope','$http','$sce',function($scope,$http,$sce) {
	$scope.decription = "未加载";
	var initData = {},formats;
	$scope.showData = false;
	$scope.isBoolean = function(b){
		return b;
	}
	var params = {
		currentPage:1,
		pageSize:20
	}
	var listData;
	
	function loadData(param){
		param!=null&&$.extend(params,param);
	  $scope.showData = false;
	  $scope.decription = "正在加载中";
		$http.get(initData.dataUrl,{params:params})
	      .then(function(result){
	      	if(!result.data.success){
	      		$scope.decription = result.data.errorMsg;
	      		return;
	      	}
	      	var rows = result.data.body.list;
	      	if(rows==null||rows.length==0){
	      		$scope.decription = "查询无记录";
	      		return;
	      	}
	      	$scope.showData = true;
	      	var tmpNode , dataList = [],tmpNode2,tmpFormat,_v;
	      	listData = [];
	      	for(var i=0;i < rows.length;i++){
	      		tmpNode = $scope.gridRow({row:rows[i]});
	      		listData.push(tmpNode);
	      		tmpNode2 = {};
	      		for(var j = 0;j<initData.text.length;j++){
	      			/*if(initData.text[j]=='checkbox'){
	      				tmpNode2[initData.text[j]]=$sce.trustAsHtml("<input type='checkbox'/>");
	      				continue;
	      			}*/
	      			_v = tools.getValue(tmpNode,initData.text[j]);
	      			if(_v==null)continue;
	      			tmpFormat = formats[initData.text[j]];
	      			if(tmpFormat!=null){
      					//格式化
    						if(tmpFormat.indexOf('date|')==0){
	      					tmpNode2[initData.text[j]]=$sce.trustAsHtml(_v.toDate().format(tmpFormat.split("date|")[1])+"" );
    						}else{
		      				switch(tmpFormat){
		      					default:
		      						tmpNode2[initData.text[j]]=$sce.trustAsHtml(_v+"" );
		      						break;
		      				}
    						}
	      			}else{
	      				tmpNode2[initData.text[j]]=$sce.trustAsHtml( _v+"" );
	      			}
	      		}
	      		dataList.push(tmpNode2);
	      	}	      	
	      	$scope.dataRows = dataList;
	      	$scope.currentPage = result.data.body.currentPage;
	      	$scope.itemCount = result.data.body.itemCount;
	      	$scope.pageTotal = result.data.body.pageTotal;
	      	$scope.totalItems = result.data.body.itemCount;
	      	selectedRow = null;
	    });
	}
	
	$scope.selectPage = function(page){
		loadData({currentPage:page});
	}
	var selectedRow = null;
	$scope.radioSelect = function(idx){
		selectedRow = listData[idx];
	}
	
	$scope.init = function(el,dataUrl,text,widths,format){
		$scope.radioName =  new Date().getTime();
		formats = format==null?{}:angular.fromJson(format);
		initData.dataUrl = dataUrl;
		initData.text = text.split(',');
		var cols = [];
		for(var i=0;i < widths.length;i++){
			cols.push({name:initData.text[i],w:widths[i]});
		}
		
		$scope.cols = cols;
		
		$(el).on('click','a[name]',function(){
			var item = listData[parseInt($(this).parent().attr('name'))];
			$scope.events({name:$(this).attr('name'),item:item});
		});
		$('.grid-thead input[type=checkbox]',el).on('click',function(){
			if($scope.dataRows==null||$scope.dataRows.length==0){
				return;
			}
			var flag = false;
			if($(this).is(':checked')){
				flag = true;
			}
			$scope.$apply(function(){
				for(var i=0;i<$scope.dataRows.length;i++){
					$scope.dataRows[i].checked = flag;
				}	
			});
		});
		
		$scope.setGrid({grid:{
			resize:function(outheight){
				$scope.outheight=outheight;
			},
			load:function(params){
				loadData(params);
			},
			getChecked:function(){
				var items = [];
				for(var i=0;i<$scope.dataRows.length;i++){
					if($scope.dataRows[i].checked){
						items.push(listData[i]);
					}
				}	
				return items;
			},
			getSelected:function(){
				return selectedRow;
			}
		}});
	}
	
	
	
}];
