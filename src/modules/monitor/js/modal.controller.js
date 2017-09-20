//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
var urlTools = require("../../common/urls.js");
require("../css/monitor.less");

function toLineArr(history){
	var line = [];
	for(var i=0;i < history.length;i++){
		line.push([history[i].longitude*1.0/window.multiple,history[i].latitude*1.0/window.multiple]);
	}
	return line;
}

module.exports = ['$scope','$http','$timeout','$uibModal', function ($scope,$http,$timeout,$uibModal) {
	
	$scope.showDetail =false;
	$scope.carInfo = {};
	$scope.isTrue = function(flag){
		return flag==null?true:flag;
	}
	function reloadAlerm(){
	  $http.get(urlTools.getUrl("toDoAlermList"),{
	  			params:{
	  				pageSize:5,
	  				currentPage:$scope.alerm.currentPage
	  			}
	  		})
	      .then(function(result){
	      	var list = result.data.body.list;
	      	for(var i=0;i<list.length;i++){
	      		list[i].formatDt = list[i].alarmTime.formatDate("yyyy-MM-dd hh:mm:ss");
	      	}
	        $scope.alermList = list;
	        $scope.alerm.totalItems = result.data.body.itemCount;
	    });
	}
	function init(){
		$http.get(urlTools.getUrl('orgTree'))
      .then(function(result){
        var list = tools.toTree(result.data.body, 'orgUuid', 'parentOrgUuid');
        $scope.vechileList = list;
    });
    reloadAlerm();
    $(document.body).on("hasNewAlerm",function(){
    	reloadAlerm();
    });
	}
	$scope.tree = {
		toggleSelected:function(item){
			item.isSelected = !item.isSelected;
			if(item.isSelected){
				$scope.map.showCars(item.plateNo);
			}else{
				$scope.map.clearCars(item.plateNo);
			}
		},
		toggleOpn:function(item){
			if(item.orgType==null){
				//点击车辆信息
				$scope.map.localCar(item.plateNo);
				return;
			}
			item.isOpen=!item.isOpen;
			if(item.hasLoadCar==null&&(item.orgType=='company'||item.orgType=='dept')){
				item.hasLoadCar = true;
				$http.get(urlTools.getUrl('vehiclePage'),{
					params:{
						orgUuid:item.orgUuid,
						currentPage:1,
						pageSize:10000
					}
				})
	      .then(function(result){
	      	var vehicleList = result.data.body.list;
	      	for(var i=0;i < vehicleList.length;i++){
	      		vehicleList[i].orgName = vehicleList[i].plateNo;
	      	}
	      	if(angular.isArray(item.items)){
	      		item.items = item.items.concat(vehicleList);
	      	}else{
	      		item.items = vehicleList;
	      	}
	    });
			}
		},
		isOpen : function(isOpen){
			return !isOpen;
		},
		toggle:function(){
			if(this.showTree){
				this.treeWidth = '0px';
				this.mapMargin = '0';
				this.showTree = false;
			}else{
				this.treeWidth = '200px';
				this.mapMargin = '200px';
				this.showTree = true;
			}
		},
		showTree:true,
		treeWidth:'200px',
		mapMargin:"200px"
	};
	$scope.alerm = {
		currentPage:1,
		toCar:function(item){
			$scope.map.localCar(item.plateNo,true);
		},
		selectPage:function(page){
			this.currentPage = page;
			reloadAlerm();
		},
		op:function(item){
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
	    	reloadAlerm();
	    });
		}
	};
	$scope.selectCar = function(item){
		if(item.vechileUuid==null){
			
		}else{
			$scope.map.showCars(item.plateNo);
		}
	}
	$scope.search = function(val){
    return $http.get(urlTools.getUrl('searchCar'), {
      params: {
        condition: val
      }
    }).then(function(response){
    	for(var i=0;i < response.data.body.length;i++){
    		response.data.body[i].remark = "【"+response.data.body[i].plateNo+"】"+response.data.body[i].contactsName+":"+response.data.body[i].contactsPhone;
    	}
    	if(response.data.body.length==0){
    		return [{remark:"无符合条件"}];
    	}
      return response.data.body;
    });
	}
	/*******/
	$scope.dragWarnDlg = function(event){
		$('#warningEvents').css({
			'left':event.pageX+'px',
			'top':event.pageY+'px',
			'margin-left':'0px',
			'bottom':'auto'});
	}
	$scope.showList = true;
	$scope.toggleWarnDlg = function(){
		$scope.showList = !$scope.showList;
	}
	
	
	$scope.mapTools = {
		allScreen:function(){
			if($('body > div.monitorIdx-container').length == 0){
				$('<div class="map-block"/>').insertBefore($('div.monitorIdx-container'));
				$('div.monitorIdx-container').appendTo(document.body).addClass("all-screen");
				$('#warningEvents').appendTo(document.body);
				this.screenOp="退出全屏";
			}else{
				$('div.monitorIdx-container').removeClass("all-screen");
				$('div.map-block').replaceWith($('div.monitorIdx-container'));
				$('#warningEvents').insertAfter($('div.monitorIdx-container'));
				this.screenOp="全屏显示";
			}
		},
		screenOp:"全屏显示",
		startRang:function(){
			$scope.map.startRang();
		}
	}
	$scope.map = null;
	$scope.amapLoaded = function(mapObj){
		$scope.map = mapObj;
	}
	
	$scope.markClick = function(data){
		data.lastReportTime_ = data.lastReportTime.formatDate("yyyy-MM-dd hh:mm:ss");
		data.alermComments_ = data.alermComments||"无";
		angular.extend($scope.carInfo,data)
		$scope.showDetail = true;
		$scope.$apply();
	}
	
	$scope.carPanel = {
		hide:function(){
			$scope.showDetail = false;
			this.historyShow=false;
			$scope.player.clear();
		},
		historyShow:false,
		searchHistory:function(){
			//判断是否小于24小时
			var t = this.sTime.split(":");
			this.startDate.setHours(parseInt(t[0]),parseInt(t[1]),0,0);
			t = this.eTime.split(":");
			this.endDate.setHours(parseInt(t[0]),parseInt(t[1]),0,0);
			if(this.endDate.getTime() - this.startDate.getTime() > 86400000){
				toaster.info("您的轨迹查询时间超过了24小时");
				return;
			}
			$http.get(urlTools.getUrl('queryHistory'), {
	      params: {
	        plateNo: $scope.carInfo.plateNo,
	        reportTimeBegin:this.startDate.format('yyyyMMddhhmmss'),
	        reportTimeEnd:this.endDate.format('yyyyMMddhhmmss')
	      }
	    }).then(function(response){
				if(response.data.body==null||response.data.body.length==0){
					toaster.info("该车此段时间内无轨迹上报");
					return;
				}
				$scope.carPanel.progress = 0;
				$scope.carPanel.historyShow=true;
				$scope.carPanel.btnStatus="end";
				$scope.player.clear();
				$scope.player.barInit(response.data.body,$scope.carInfo);
	    });
		},
		startDate:new Date(new Date().getTime()-86400000),
		endDate:new Date(),
		sTime:"06:00",
		eTime:"06:00",
		times:["06:00","06:30","07:00","07:30","08:00","08:30","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
			"16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30",
			"23:00","23:30","00:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30"]
	}
	var playerCache ={
		times:0,
		sTime:0,
		sends:300000,
		hander:null,
		idx:0,
		workTime:0,
		status:'on'
	};
	//轨迹播放器
	$scope.player = {
		clear:function(){
			this.speed=1;
			this.progress=0;
			if(playerCache.hander!=null){
				$timeout.cancel(playerCache.hander);
				playerCache.hander = null;
			}
			if(playerCache.car!=null){
				$scope.map.remove(playerCache.line);
				$scope.map.remove(playerCache.car);
				playerCache.car=null;
			}
		},
		progress:0,
		btnStatus:"end",
		speed:1,
		barInit:function(list,car){
			playerCache.list = list;
			playerCache.carInfo = car;
			playerCache.pLen = list.length;
			playerCache.sTime = list[0].reportTime.toDate().getTime();
			playerCache.times = list[list.length-1].reportTime.toDate().getTime() - playerCache.sTime;
			playerCache.line = $scope.map.history(toLineArr(list));
			playerCache.car = $scope.map.showMarker(car,list[0].longitude,list[0].latitude);
		},
		reset:function(){
			playerCache.idx=0;
			playerCache.sTime = playerCache.list[0].reportTime.toDate().getTime();
			$scope.player.progress =0;
			playerCache.workTime = 0;
			playerCache.car.setPosition([playerCache.list[0].longitude*1.0/window.multiple,playerCache.list[0].latitude*1.0/window.multiple])
		},
		play:function(){
			//结束了，点击播放，那需要重放
			if(playerCache.idx == (playerCache.pLen-1)){
				this.reset();
				playerCache.hander = $timeout($scope.player.play,1000);
				return;
			}
			var workT = $scope.player.speed * playerCache.sends;
			
			playerCache.workTime += workT;
			playerCache.sTime += workT;
			$scope.player.progress = parseInt(playerCache.workTime*100/playerCache.times);
			
			var node = playerCache.list[playerCache.idx];
			var flag = false;
			while(playerCache.idx < playerCache.pLen&&node.reportTime.toDate().getTime() <= playerCache.sTime){
				if( playerCache.idx == (playerCache.pLen -1) || playerCache.list[playerCache.idx+1].reportTime.toDate().getTime() > playerCache.sTime){
					break;
				}else{
					flag = true;
					playerCache.idx++;
					node = playerCache.list[playerCache.idx];
				}
			}
			if(flag){
				//console.log("移动位置");
				playerCache.car.setPosition([node.longitude*1.0/window.multiple,node.latitude*1.0/window.multiple])
				if(playerCache.status=='off'){
					//console.log("上线");
					//playerCache.car.setIcon("icon/heavy-truck-1.png");
					playerCache.status = 'on';
					$scope.map.changeStatus(playerCache.car,playerCache.carInfo,"online");
				}
			}else if(playerCache.status=='on'){
				//下线,修改图标
				//console.log("下线");
				//playerCache.car.setIcon("icon/heavy-truck-2.png");
				$scope.map.changeStatus(playerCache.car,playerCache.carInfo,"offline");
				playerCache.status = 'off';
			}
			if(playerCache.idx < (playerCache.pLen -1)){
				playerCache.hander = $timeout($scope.player.play,1000);
			}else{
				playerCache.hander = null;
				$scope.player.btnStatus = "end";
			}
		},
		suspend:function(){
			if(playerCache.hander!=null){
				$timeout.cancel(playerCache.hander);
				playerCache.hander = null;
			}
		},
		up:function(){
			if($scope.player.speed < 4){
				$scope.player.speed ++;
			}
		},
		red:function(){
			if($scope.player.speed > 1){
				$scope.player.speed--;
			}
		},
		end:function(){
			this.reset();
			if(playerCache.hander!=null){
				$timeout.cancel(playerCache.hander);
				playerCache.hander = null;
			}
		}
	}
	
	init();
}];