var tools = require("../../common/tools.js");
var toaster = require("../../common/toaster.js");
var dict = require("../../common/dict");
module.exports = ['$scope','$state','$document','$uibModal','$http', function($scope, $state,$document,$uibModal,$http) {
    $scope.info = "这是js里设置的值";

    //tab示例
    $scope.model = {
      name:'tabs'
    };

    /*//富文本编辑
    $scope.testText = "测试文本<br>this is <div>test</div>";*/


    $scope.getAreaValue = function(){
        console.log("未自定义省市县的名称" + angular.toJson($scope.testModel1));
        console.log("自定义省市县的名称" + angular.toJson($scope.testModel2));
    };
    //areaSelect示例
    $scope.testModel2 = {
      "provinceName":"湖南省",
      "cityName":"邵阳市",
      "countyName":"隆回县",
        "otherParams" : {
            id:"test",
            name:"test"
        }
    };

    $scope.setAreaValue = function(){
        $scope.testModel1 = {
            "province":"江苏省",
            "city":"镇江市",
            "county":"润州区"
        };
    };

    $scope.testModel1 = {
      "province":"湖南省",
      "city":"邵阳市",
      "county":"洞口县"
    };


    //轮播图示例
    $scope.myInterval = 2000;
    var slides = $scope.slides = [];
    $scope.addSlide = function () {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: require('../images/1.jpg'),
            id:'1'
        });
        slides.push({
            image: require('../images/2.jpg'),
            id:'2'
        });
        slides.push({
            image: require('../images/3.jpg'),
            id:'3'
        });
        slides.push({
            image: require('../images/4.jpg'),
            id:'4'
        });
    };
    $scope.addSlide();

    $scope.clickImage = function(event){
      console.log(event);
    };

    //下拉列表示例
    $scope.pepoles = {
      'select':[{id:1,name:'kevin'},{id:2,name:'alex'},{id:3,name:'wang'}]
    };

    //弹出窗口示例
    $scope.animationsEnabled = true;
    $scope.items =  ['item1', 'item2', 'item3'];


    $scope.openModal = function(size){
      var parentElem = angular.element($document[0].querySelector('.modal-demo '));

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: '/modules/demo/html/modalContent1.html',
        controller: 'modalController', //在index.js里注册
        size: size,
        appendTo: parentElem,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    };
    var a = tools.md5("888888");

    var b = tools.md5("王虎888888");


    //附件上传
    $scope.testFileUploadModel = "123sdafdsfdsf34";
    $scope.testFileUploadModel2 = "123dsfdasfadsf45";

    //分页
    $scope.currentPage = 1;
    $scope.totalItems = 50;
    $scope.maxSize = 2;

    //http请求
    $scope.requestParam = '{"paramKey":"paramValue"}';
    $scope.getRequestUrl = "/action/public/listFloorRecommend";
    $scope.postRequestUrl = "/action/public/login/permission";
    $scope.sendGetRequest = function(){
        var params = angular.fromJson($scope.requestParam);
        $http.get($scope.getRequestUrl,{params:params}).then(function(result){
            $scope.requestResult = angular.toJson(result.data);
        });
    };

    $scope.sendPostRequest = function(){

        var params = angular.fromJson($scope.requestParam);
        $http.post($scope.postRequestUrl,params).then(function(result){
            $scope.requestResult = angular.toJson(result.data);
        });
    };

    //消息提示
    $scope.showSuccessMsg = function(){
        toaster.success('这是提示的信息');
        toaster.success("标题",'这是提示的信息');
    };
    $scope.showInfoMsg = function(){
        toaster.info("消息", "调用提示信息");
        toaster.info("调用提示信息，无标题");
    };

    $scope.showWarningMsg = function(){
        toaster.warning("警告","调用警告");
        toaster.warning("调用警告，无标题");
    };

    $scope.showErrorMsg = function(){
        toaster.error("错误","调用失败");
        toaster.error("调用失败，无标题");
    };
    //confirm 弹出窗口确认
    $scope.showConfirmMsg = function(){
        var confirmWindow = toaster.confirm("确认提交么<br/>a");
        confirmWindow.result.then(function(data){
            toaster.info(angular.toJson(data));
        });

       // toaster.confirm("你是真的要提交么，不能后悔了");
    };
    
    //数据字典
    $scope.dictData = {};
    /**初始化字典项*/
    dict.load($http,["pay_type","product_type"],function(result){
        angular.extend($scope.dictData,result);
    });
    $scope.testDict1 = {dict1:'xx',dict1_:"我是空的了",id:'a', name:'b'};
    $scope.testDict2 = {};
    $scope.getDictValue = function(){
        var id1 = $scope.testDict1.dict1;
        var id2 = $scope.testDict2.dict2;
        alert(angular.toJson($scope.testDict1));
    }

    $scope.setDictValue = function(){
        $scope.dictData["pay_type"] = [{itemCode:'xxx',itemName:"我是空的xxx"}];
        $scope.testDict1.dict1 = 'xxx';
        $scope.testDict1.dict1_ = "我是空的xxx";
    };


    $scope.dictChange = function(oldValue, newValue){
        alert("新选择的字典值:" + newValue);
    }

    //日期区间
    $scope.dateRegion = {
        testBegin1:"20170521",
        testEnd1:"20170610",
        testBegin2:"20170522",
        testEnd2:"20170620",
        testBegin3:"20170523",
        testEnd3:"20170630"
    };
    $scope.openBegin = function(){
        $scope.dateRegion.opened = true;
    }

    $scope.getTime = function(){
        toaster.info( $scope.dateRegion.testBegin1 + ":" + $scope.dateRegion.testEnd1);
    }

    $scope.setDateRegion = function(){
        $scope.dateRegion.testBegin1 = "20100625";
        $scope.dateRegion.testEnd1 = "20170730";
    }

    $scope.clearDateRegion = function(){
        $scope.dateRegion.testBegin1 = null;
        $scope.dateRegion.testEnd1 = null;
    }
}];
