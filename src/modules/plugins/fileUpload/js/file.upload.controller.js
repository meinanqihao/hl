/**
 * Created by kevin on 2017/6/2.
 */

var tools = require("../../../common/tools.js");

var remoteUrls = {
    queryAction: '{0}/action/hletong/file/{1}/query', //{0}对应的是fileGroupId参数
    uploadAction: '{0}/action/hletong/file/{1}/upload',//{0}对应的是uploadId参数
    progressAction: '{0}/action/hletong/file/getProgress',
    deleteAction: '{0}/action/hletong/file/deleteFile',
    downAction: '{0}/action/hletong/file/download'
}

var options = {
    uploadMode:"single",
    uploadPrefix : "",
    isPublic: false
}


module.exports = ['$scope', '$element', '$interval', '$http','$attrs', function ($scope, $element, $interval, $http, $attrs) {
    //allFiles:当前已经上传的附件列表，格式：{ fileId : 'a', fileName : '测试文件名', fileSrc : '附件路径，需要是可用直接访问得到的附件'}
    $scope.allFiles = [];
    $scope.uniqueId = tools.getUuid();
    $scope.attrs = {
        fileUploadMode : $attrs["fileUploadMode"] || options.options ,
        fileUploadPrefix : $attrs["fileUploadPrefix"] || options.uploadPrefix,
        isPublic : $attrs["fileUploadPublic"] || false
    };
    var publicPrefix = $scope.attrs.isPublic ? "/public" : "";
    //需要熬上传的文件，只有上传完成才从这里面移除。每次上传的都是第一个，移除直接移除第一个
    $scope.needUploadingFiles = [
        {
            needShow: true,
            uniqueId: tools.getUuid()
        }
    ];
    $scope.getUploadAction = function (uniqueId) {
        return tools.formatUrl(remoteUrls.uploadAction, [publicPrefix,uniqueId]);
    }
    if($scope.ngModel){
        $scope.uploadGroupId = $scope.ngModel;
        $http.get(tools.formatUrl(remoteUrls.queryAction,[publicPrefix, $scope.ngModel]),{
            params:{
                "file_group_id" : $scope.ngModel
            }
        }).then(function(result){
            var data = result.data.list;
            angular.forEach(data, function(fileInfo, i){
                var currFile = {
                    fileId: fileInfo["file_id"],
                    fileSrc: tools.formatUrl(remoteUrls.downAction,[publicPrefix]) + "?file_id=" + fileInfo["file_id"],
                    fileName : fileInfo["file_name"]
                };
                $scope.allFiles.push(currFile);
             });
        });
    }
    $scope.uploadFiles = function () {
        if (!$scope.uploadFlag && $scope.needUploadingFiles.length > 1) {
            $scope.resetIFrame();
            $scope.uploadFlag = true;
            $scope.currUploadFileInfo = $scope.needUploadingFiles[0];
            $element.querySelectorAll("#form" + $scope.currUploadFileInfo["uniqueId"])[0].submit();
        } else if ($scope.uploadFlag) {
            $scope.setProgress();
        } else {
            $interval.cancel($scope.timer);
            $scope.timer = null;
        }
    }

    $scope.resetIFrame = function () {
        var frame = window.frames["uploadTargetIFrame"+$scope.uniqueId];
        try {
            frame.document.designMode = "on";
            frame.document.open();
            frame.document.write("<HTML><body><div name='emptyDiv'></div></body></HTML>");
            frame.document.close();
        } catch (e) {
            angular.element(frame.document.body).append("<div name='emptyDiv'></div>");
        }
    }

    $scope.deleteFile = function($childScope){
        var fileId = $childScope.oneFile.fileId;
        var deleteAction = tools.formatUrl(remoteUrls.deleteAction ,[publicPrefix]);
        var params = {"file_id": fileId};
        $http.delete(deleteAction,{params: params}).then(function(result){
            deleteOneFile($scope.allFiles, fileId);
        });
    }
    function deleteOneFile(allFiles, fileId){
        angular.forEach(allFiles,function(item, i){
            if(item.fileId == fileId){
                allFiles.splice(i, 1);
                return false;
            }
        });
    }
    /**
    上传完成之后设置为已上传
     */
    $scope.setProgress = function () {
        var currUploadFile = $scope.currUploadFileInfo;
        var result = $scope.getResult();
        if(result.status == "success" && currUploadFile.uniqueId == $scope.needUploadingFiles[0].uniqueId){
            var currFile = $scope.needUploadingFiles.shift();
            var fileInfo = result.file_info;
            var fileId = fileInfo["file_id"];
            $scope.ngModel = fileInfo["file_group_id"];
            $scope.uploadGroupId = $scope.ngModel;
            currFile["fileSrc"] = tools.formatUrl(remoteUrls.downAction,[publicPrefix]) + "?file_id=" + fileId;
            currFile["fileId"] = fileId;
            //如果是single，上传的时候需要删除原来的图片
            if($scope.attrs.fileUploadMode == "single"){
                $scope.allFiles = [];
            }
            $scope.allFiles.push(currFile);
            $scope.uploadFlag = false;
            //触发下上传下一个文件
            $scope.uploadFiles();
        }
    }

    $scope.getResult = function () {
        var frame = window.frames["uploadTargetIFrame"+$scope.uniqueId];
        var content = frame.document.body.innerHTML;
        var result;
        try {
            result = JSON.parse(content);
            if ("object" != typeof result) {
                result = JSON.parse(result);
            }
        } catch (e) {
            result = {"status": 'failure', "errorMsg": "解析异常"};
        }

        return result;
    }

    $scope.addToNeedUpload = function (fileInfo) {
        $scope.needUploadingFiles.push(fileInfo);
    }
    //标识当前是否正在上传
    $scope.uploadFlag = false;

    //每次上传的都是最后数组的最后一个
    $scope.uploadFile = function (element) {
        var fileElement = angular.element(element);
        var filePath = fileElement.val();
        var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1);
        var currUploadObj = $scope.needUploadingFiles[$scope.needUploadingFiles.length - 1];
        angular.extend(currUploadObj, {
            filePath: filePath,
            fileName: fileName,
            needShow: false
        });
        $scope.needUploadingFiles.push({
            needShow: true,
            uniqueId: tools.getUuid()
        });
        if (!$scope.timer) {
            $scope.timer = $interval(function () {
                $scope.uploadFiles();
            }, 500);
        }

    }


}];
