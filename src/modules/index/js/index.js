var tools = require("../../common/tools");
var toaster = require("../../common/toaster.js");
var urlTools = require("../../common/urls.js");
var tabsUrl = require("../tab.config.js");

var navListArr = [],leftMenu={};

//json转换树状结构
function transData(a, idStr, pidStr, chindrenStr){
    var r = [], id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
    for(; i < len; i++){
        leftMenu[a[i][id]] = a[i];
    }
    for(; j < len; j++){
        var aVal = a[j], hashVP = leftMenu[aVal[pid]];
        if(hashVP){
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
        }else{
            r.push(aVal);
        }
    }
    return r;
}

function contains(arr,obj) {
    var i = arr.length;
    while (i--){
        if(arr[i].tagName == obj.tagName){
            return true
        }
    }
    return false;
}
module.exports = ['$scope','$http','$uibModal','$interval', function($scope,$http,$uibModal,$interval) {
    $scope.navListArr = navListArr;
    $scope.activeLeftMenu = null;
    $scope.alermTotal = 0;
    var lastTime = null;
    function alermCount(){
    		$http.get(urlTools.getUrl("toDoAlermList"),{
		    		params:{
		    			pageSize:1,
		    			currentPage:1
		    		}
		    	})
	        .then(function(result){
	        	$scope.alermTotal = result.data.body.itemCount;
	        	if($scope.alermTotal == 0){
	        		if(lastTime!=null){
	        			$(document.body).trigger("hasNewAlerm");
	        		}
	        		lastTime = null;
	        		return;
	        	}
	        	if(lastTime!=null){
	        		var l = result.data.body.list[0].alarmTime;;
	        		if(lastTime!=l){
	        			$(document.body).trigger("hasNewAlerm");
	        		}
	        	}
	        	lastTime = result.data.body.list[0].alarmTime;
	      });
    }
    var tabObj = {
    	open:function(item){
    		var flag = false;
    		for(var i=0;i < navListArr.length;i++){
    			if(navListArr[i].id==item.id){
    				flag = true;
    				break;
    			}
    		}
    		if(!flag){
    			navListArr.push(item);
    		}
       	$scope.activeTab = item.id;
    	}
    }
    
    
    var init = function(){
    	//获取当前报警数量，获取当前用户信息
	    $http.get(urlTools.getUrl("menuList"))
	        .then(function(result){
	          var list = transData(result.data.body.menuList, 'id', 'pid', 'items');
	          $scope.leftNavlist = list;
	          if(navListArr.length==0){
	          	tabObj.open({
								id:list[0].id,
		          	tagName : list[0].text,
			          url : list[0].url,
			          closable:false,
			          tabUrl:tabsUrl[list[0].url]
		          });
		        }
	      });
	      
      	$interval(alermCount,60000);
      	
      	//获取用户基本信息
      	$http.get(urlTools.getUrl("fetLoginUser"))
	        .then(function(result){
	        	$scope.loginUser = result.data.body;
	        	
	      });
      	
      	
				alermCount();
    }
		$scope.openPwdDlg = function(){
	
	    var modalInstance = $uibModal.open({
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: '/modules/index/html/pwd.html',
	      controller: 'pwdController', //在index.js里注册
	      appendTo: angular.element(document.body),
	      backdrop:"static",
     		windowClass:"dlg-400",
	      resolve: {
	        user: function () {
	          return $scope.loginUser;
	        }
	      }
	    });
	  }
		$scope.isLeftActive = function(active){
			return active;
		}
		
		$scope.isOpen = function(isOpen){
			return isOpen!==true;
		}
		
		$scope.creatNav = function (item) {
			if(item.items==null){
				tabObj.open({
					id:item.id,
          tagName : item.text,
          url : item.url,
          closable:true,
          tabUrl:tabsUrl[item.url]
        });
			}else{
				item.isOpen=!item.isOpen;
			}
		}
		$scope.selectTab = function(idx,tabId){
        $scope.activeTab = tabId;
		}

    //点击tab栏删除按钮
    $scope.handelNav = function (idx) {
        if($scope.activeTab != navListArr[idx].id){
	        navListArr.splice(idx,1);
	        return;
        }
	      navListArr.splice(idx,1);
        $scope.activeTab = navListArr[0].id;
    }


    $scope.isActive = function(i){
      return i == $scope.activeTab;
    };

		$scope.mouseover = function(item){
			if($scope.activeLeftMenu==item)return;
			item.active = true;
		}

		$scope.mouseout = function(item){
			if($scope.activeLeftMenu==item)return;
			item.active = false;
		}
		
		
		//跳转至报警页面
		$scope.goAlerm = function(){
			$scope.creatNav({
				id:"alerm",
				text:"车辆报警",
				url:'#/index/alerm'
			})
		}
		
		//退出
		$scope.loginOut = function(){
			toaster.confirm("确定要退出系统吗？",function(flag){
				if(flag){
					$http.post(urlTools.getUrl('logout'))
           .then(function(result){
           	window.location.href='login.html';
           })
				}
			});
		}
		
		init();
}]