var urlTools = require("../../../common/urls.js");
var toaster = require("../../../common/toaster.js");
var p = window.multiple;
var carInfo = "",reloadTime = 60000;
var carIcons = {
	heavy:{
		online:{
			u:"icon/heavy-truck-online-3.png",
			d:"icon/heavy-truck-online-4.png",
			l:"icon/heavy-truck-online-1.png",
			r:"icon/heavy-truck-online-2.png"
		},
		alerm:{
			u:"icon/heavy-truck-baojing-3.png",
			d:"icon/heavy-truck-baojing-4.png",
			l:"icon/heavy-truck-baojing-1.png",
			r:"icon/heavy-truck-baojing-2.png"
		},
		offline:{
			u:"icon/heavy-truck-ofline-3.png",
			d:"icon/heavy-truck-ofline-4.png",
			l:"icon/heavy-truck-offline-1.png",
			r:"icon/heavy-truck-offline-2.png"
		}
	},
	dangerous:{
		online:{
			u:"icon/dangerous-cargo-online-3.png",
			d:"icon/dangerous-cargo-online-4.png",
			l:"icon/dangerous-cargo-online-1.png",
			r:"icon/dangerous-cargo-online-2.png"
		},
		alerm:{
			u:"icon/dangerous-cargo-baojing-3.png",
			d:"icon/dangerous-cargo-baojing-4.png",
			l:"icon/dangerous-cargo-baojing-1.png",
			r:"icon/dangerous-cargo-baojing-2.png"
		},
		offline:{
			u:"icon/dangerous-cargo-ofline-3.png",
			d:"icon/dangerous-cargo-ofline-4.png",
			l:"icon/dangerous-cargo-offline-1.png",
			r:"icon/dangerous-cargo-offline-2.png"
		}
	},
	light:{
		online:{
			u:"icon/light-truck-online-3.png",
			d:"icon/light-truck-online-4.png",
			l:"icon/light-truck-online-1.png",
			r:"icon/light-truck-online-2.png"
		},
		alerm:{
			u:"icon/light-truck-baojing-3.png",
			d:"icon/light-truck-baojing-4.png",
			l:"icon/light-truck-baojing-1.png",
			r:"icon/light-truck-baojing-2.png"
		},
		offline:{
			u:"icon/light-truck-ofline-3.png",
			d:"icon/light-truck-ofline-4.png",
			l:"icon/light-truck-offline-1.png",
			r:"icon/light-truck-offline-2.png"
		}
	},
	passenger:{
		online:{
			u:"icon/passenger-car-online-3.png",
			d:"icon/passenger-car-online-4.png",
			l:"icon/passenger-car-online-1.png",
			r:"icon/passenger-car-online-2.png"
		},
		alerm:{
			u:"icon/passenger-car-baojing-3.png",
			d:"icon/passenger-car-baojing-4.png",
			l:"icon/passenger-car-baojing-1.png",
			r:"icon/passenger-car-baojing-2.png"
		},
		offline:{
			u:"icon/passenger-car-ofline-3.png",
			d:"icon/passenger-car-ofline-4.png",
			l:"icon/passenger-car-offline-1.png",
			r:"icon/passenger-car-offline-2.png"
		}
	}
}
/**
vechileType：车辆类型
direct：方向
status:状态 up,left,right,down


**/
function getStatusIcon(vechileType,status,direct){
	var typeTag;
	switch(vechileType){
		default:
			typeTag = 'heavy';
	}
	var directTag;
	switch(direct){
		case 'up':
			directTag = 'u';
			break;
		case 'left':
			directTag = 'l';
			break;
		case 'right':
			directTag = 'r';
			break;
		default:
			directTag = 'd';
			break;	
	}
	return carIcons[typeTag][status][directTag];
}

function getStatus(car){
	if(car.alermComments!=null&&car.alermComments!=''){
		return 'alerm';
	}
	if(car.lastReportTime - new Date().getTime() > 60000){
		return 'offline';
	}
	return 'online';
}
module.exports = ['$scope','$http','$interval',function($scope,$http,$interval) {
	var mapObj = null;	
	var carMap = {};
	var reload = function(){
		var plateNos = [];
		for(var tmp in carMap){
			plateNos.push(tmp);
		}
		if(plateNos.length==0)return;
		$http.get(urlTools.getUrl("queryVehicle"), {
      params: {
        plateNos: plateNos
      }
    }).then(function(result){
	     	var carList = result.data.body;
	     	if(carList==null||carList.length==0){
	     		toaster.info("未接收到车辆上报地址");
	     		return;
	     	}
	     	for(var i=0;i<carList.length;i++){
	     		if(carMap[carList[i].plateNo]!=null){
	     			carMap[carList[i].plateNo].setPosition(new AMap.LngLat(carList[carList.length-1].longitude*1.0/p,carList[carList.length-1].latitude*1.0/p));
	     			carMap[carList[i].plateNo].setExtData(carList[i]);	     			
	     			carMap[carList[i].plateNo].setIcon(getStatusIcon(carList[i].vechileType,getStatus(carList[i]),'left'));
	     			continue;
	     		}
	     	}
    });
	};
	$scope.init=function(amap){
		mapObj = amap;
  	$scope.loaded({mapObj:{  		
  		showCars:function(plateNos){//显示车辆
  			if(!angular.isArray(plateNos)){
  				plateNos = [plateNos];
  			}
  			$http.get(urlTools.getUrl("queryVehicle"), {
		      params: {
		        plateNos: plateNos
		      }
		    }).then(function(result){
			     	var carList = result.data.body;
			     	if(carList==null||carList.length==0){
			     		toaster.info("未接收到车辆上报地址");
			     		return;
			     	}
			     	for(var i=0;i<carList.length;i++){
			     		if(carMap[carList[i].plateNo]!=null){
			     			carMap[carList[i].plateNo].setPosition(new AMap.LngLat(carList[carList.length-1].longitude*1.0/p,carList[carList.length-1].latitude*1.0/p));
			     			carMap[carList[i].plateNo].setExtData(carList[i]);
			     			continue;
			     		}
			     		carMap[carList[i].plateNo] = new AMap.Marker({
			     				icon:getStatusIcon(carList[i].vechileType,getStatus(carList[i]),'left'),
									position: [carList[i].longitude*1.0/p,carList[i].latitude*1.0/p],
									title: carList[i].plateNo+"["+carList[i].contactsName+":"+carList[i].vechileType_+"]",
									map: mapObj,
									extData:carList[i],
									offset : new AMap.Pixel(-18,-18)
							});
							carMap[carList[i].plateNo].on('click',function(e){
								$scope.markClick({data:e.target.G.extData});
					    });
			     	}
			     	//移动到最后一辆车的位置
			     	mapObj.setCenter(new AMap.LngLat(carList[carList.length-1].longitude*1.0/p,carList[carList.length-1].latitude*1.0/p));
		    });
  		},
  		startRang:function(){//测距
  			mapObj.plugin(["AMap.RangingTool"],function(){ 
				     var ruler = new AMap.RangingTool(mapObj,);  
				     ruler.on('end',function(){ruler.turnOff();});
				     ruler.turnOn();
				});
  		},
  		localCar:function(plateNo,flag){//flag:true ，如果找不到就加载并显示
  			//地图移动到对应的车辆上面
  			if(carMap[plateNo]!=null){
  				mapObj.setCenter(carMap[plateNo].getPosition());
  			}else if(flag===true){
  				this.showCars(plateNo);
  			}
  		},
  		clearCars:function(){
  			if(arguments.length==0){
  				for(var tmp in carMap){
  					mapObj.remove(carMap[tmp]);
  					delete carMap[tmp];
  				}
  			}else{
  				for(var i=0;i < arguments.length;i++){
  					if(carMap[arguments[i]]==null)continue;
  					mapObj.remove(carMap[arguments[i]]);
  					delete carMap[arguments[i]];
  				}
  			}
  		},
  		history:function(lineArr){
  			mapObj.setCenter(new AMap.LngLat(lineArr[0][0],lineArr[0][1]));
  			
  			return new AMap.Polyline({
            map: mapObj,
            path: lineArr,
            strokeColor: "#0000ff",//线颜色
            strokeOpacity: 1,//线透明度
            strokeWeight: 3,//线宽
            strokeStyle: "solid"//线样式
        });
  		},
  		remove:function(controller){
  			mapObj.remove(controller);
  		},
  		showMarker:function(car,longitude,latitude){
  			return new AMap.Marker({
  					icon:getStatusIcon(car.vechileType,getStatus(car),'left'),
						position: [longitude*1.0/p,latitude*1.0/p],
						title: car.plateNo,
						map: mapObj,
						offset : new AMap.Pixel(-18,-18)
				});
  		},
  		changeStatus:function(marker,car,status,direct){
  			marker.setIcon(getStatusIcon(car.vechileType,status,direct||'left'));
  		}
  	}});
  	
  	$interval(reload,reloadTime);
	}
}];
