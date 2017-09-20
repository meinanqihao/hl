var mapIdx = 0;

module.exports = ['$document', function($document) {
    return {
        restrict: 'A',
        scope : {            
            loaded : '&loaded',
            markClick:'&markClick'
        },
        template : '<div class="amap-container"></div>',
        link:function(scope, element, attrs, ctrl, transclude){
        	var mapId = 'map'+mapIdx;
        	mapIdx++;
        	element.children(":first").attr('id',mapId);
        	var map =new AMap.Map(mapId,{
	            resizeEnable: true,
	            zoom: 10
	        });
        	scope.init(map);
        	AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.Geolocation','AMap.OverView'],function(){
					    //创建并添加工具条控件
					    map.addControl(new AMap.ToolBar({direction : false}));
					    map.addControl(new AMap.Scale());
					   // map.addControl(new AMap.Geolocation());
					    map.addControl(new AMap.OverView({isOpen:true}));
					    
					});					
        },
      	controller:require("./amap.controller.js")
    }
}];
