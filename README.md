# angular结合webpack使用的示例工程
## <div id="construct">工程结构说明</div>
示例工程使用按模块进行代码组织，[angular代码组织方式参考](https://github.com/johnpapa/generator-hottowel)   
示例包含两个模块：login和index   
目录结构为：   
webpack.config.js webpack的配置   
package.json 插件配置   
dist 发布目录  
　|--libs 第三方插件目录  
src 源码目录
　|--entry.js webpack打包入口   
　|--app.js angularJs的入口   
　|--index.html 页面主入口   
　|--modules 子模块的目录   
　　|--login  登录模块   
　　　|--index.js 登录模块入口   
　　　|--login.routes.js 登录模块的路由配置   
　　　|--js 模块的其他js，如controller，service   
　　　　|--signin.controller.js signin的controller   
　　　　|--signout.controller.js singout的controller   
　　　|--html 模块的html   
　　　　|--signin.html signin的html   
　　　　|--signout.html signout的html   
　　|--index  首页模块   
　　　|--index.js 首页模块入口   
　　　|--index.routes.js 首页模块的路由配置   
　　　|--js 模块的其他js，如controller，service   
　　　　|--main.controller.js main的controller   
　　　|--html 模块的html   
　　　　|--main.html main的主html，在这里面会引用其他的html   
　　　　|--mainInfo.html,mainMsg.html main里的其他html   
## 模块化说明
项目使用webpack进行打包，使用模块化的方式编写代码。下面以login模块为例说明（servie/factory之类的类似处理）：   
1. 在各模块的index.js里定义angular模块，并指定路由/controller/service的配置    

```js
var angular = require('angularjs-ie8-build');
require('angular-ui-router');

//@require "./html/**/*.html"

module.exports = angular.module('base.login', ['ui.router'])
    .config(require('./login.routes.js'))
    .controller('SigninController', require('./js/signin.controller.js'))
    .controller('SignoutController', require('./js/signout.controller.js'))
    .name;
```   
2. route单独抽取为一个文件   

```js
//这里可以写其他相关代码
console.log('路由加载');
module.exports = ['$stateProvider',  function($stateProvider) {
    $stateProvider.state('signout', {
        url: '/signout',
        name: 'signout',
        templateUrl : '/modules/login/html/signout.html',
        controller: 'SignoutController'
    })
    .state('signin', {
        url: '/signin',
        name: 'signin',
        templateUrl :'/modules/login/html/signin.html',
        controller: 'SigninController'
    });
}];
```   
3. 每个controller抽取为一个文件   

```js
//这里可以写其他相关代码
console.log('controller加载');
module.exports = ['$scope','$state', function($scope, $state) {
    $scope.user = {
      name:"",
      password:""
    };

    //执行用户登录操作
    $scope.signin = function() {
        console.log($scope.user.name + " sign in");
    };
}];
```   

## 代码规范
### 代码组织方式   
所有代码按照模块化的方式进行组织，每个模块在modules下建一个目录，目录结构参考[工程结构说明](#construct)   
### html引入方式    
在工程中，统一使用webpack的ngtemplate-loader进行html的处理，具体使用方式如下：   
1. 在定义module的前面，添加注释对html进行模块化处理。[参考ngtemplate-loader](https://github.com/WearyMonkey/ngtemplate-loader)   

```   
#具体代码见文件 src/modules/login/index.js，需要添加如下注释
//@require "./html/**/*.html"
```   
2. 在需要用到html的地方，使用相对于src目录的全目录对html文件进行引用（对应在工程中就是以/modules开头的路径，如 /modules/index/html/main.html），具体如下：   
* 路由里指定的templateUrl。示例：   

```js
module.exports = ['$stateProvider',  function($stateProvider) {
    $stateProvider.state('main', {
        url: '/main',
        name: 'main',
        templateUrl: '/modules/index/html/main.html',
        controller: 'mainController'
    });
}];
```   

* html里用ng-include引入的html片段。示例：   

```html
<div>
这是首页
<div ng-include="'/modules/index/html/mainMsg.html'"></div>
<div ng-include="'/modules/index/html/mainInfo.html'"></div>
</div>
```   
### 样式引入方式
* 样式书写方式：统一用less写样式
* 样式文件存放规则：统一存放在模块下的 less 目录
* 引用方式：在模块入口js文件里使用require的方式引用样式，比如：   

```js
require("./less/login.less");
```    
所有样式文件会合并打包成 main.[md5值].css，放在 dist/css 目录下

### 文件命名方式   
1. 模块的入口文件统一命名为 index.js，直接放在模块的根目录下   
2. controller/service之类的命名，需要把controller或者service添加在文件名上，类似：login.controller.js/login.service.js

## webpack的插件说明
### url-loader
作用：解析图片等资源文件，小于指定大小的文件将直接变成base64编码写入文件   
参考：[github地址](https://github.com/webpack-contrib/url-loader)   
```
npm install url-loader --save-dev
```
注意：使用的时候需要结合publicPath使用   
### es5-shim
作用：解决IE8兼容问题   
参考：   
```
npm install es5-shim --save
```
### babel-loader
作用：解决IE8的兼容问题   
参考：[github地址](https://github.com/babel/babel-loader)   
```
npm install  babel-loader babel-core babel-preset-env --save-dev
```
### es3ify-loade
作用： 解决IE8的兼容问题   
参考：[github地址](https://github.com/sorrycc/es3ify-loader)
```
npm install es3ify-loader --save-dev
```
### babel-preset-es201
作用： 解决IE8的兼容问题   

```
npm install babel-preset-es2015 babel-preset-es2015-loose --save-dev
```
### clean-webpack-plugin
作用：清理历史编译生成的文件  
参考：[github地址](https://github.com/johnagan/clean-webpack-plugin)
```
npm install clean-webpack-plugin --save-dev
```

### html-webpack-plugin
作用：生成入口html文件   
参考：[github地址](https://github.com/jantimon/html-webpack-plugin)   
```
npm install html-webpack-plugin --save-dev
```
### extract-text-webpack-plugin
作用：抽取样式为单独的文件   
参考：[github地址](https://github.com/webpack-contrib/extract-text-webpack-plugin)   
```
npm install --save-dev extract-text-webpack-plugin
```
### html-loader
作用：解决html打包加载的问题   
参考：[github地址](https://github.com/webpack-contrib/html-loader)    
```
npm install html-loader
```   
### nptemplate-loader
作用：解决ng-include依赖html问题   
参考：[github地址](https://github.com/WearyMonkey/ngtemplate-loader)   
```
npm install ngtemplate-loader --save-dev
```   
### css-loader,style-loader
作用：css加载器   
参考：   
[github地址-css-loader](https://github.com/kevin82008/css-loader)    
[github地址-style-loader](https://github.com/webpack-contrib/style-loader)   
[github地址-less-loader](https://github.com/webpack-contrib/less-loader)   
```
npm install css-loader style-loader less-loader less --save-dev
```
### required-loader
作用：减轻require很多文件的时候的工作量，比如html的require直接用 //@require "./html/**/*.html"批量引入了   
参考：[github地址](https://github.com/shanhaichik/webpack-require-loader)   
```
npm install required-loader --save-dev
```   

## 运行
### 代码打包
* 拉取全部代码   

```
 git clone git@192.168.1.205:web/base.git
```   
* 打包
```
npm install
npm install -g webpack
webpack
```   

### 启动方式
* 当前目录打开命令行
* cd nginx-1.13.0
* 执行：start nginx.exe

### 访问方式
* 默认开启的侦听端口是80，通过 http://localhost/dist/index.html 访问系统
* 如果需要修改侦听端口，需要修改 nginx-1.13.0/conf/nginx.conf 里面 listen       80; 的80为具体的侦听端口

### 停止方式
* 当前目录打开命令行
* 执行：nginx-1.13.0/nginx.exe -s quit

## 开发说明
### 使用 angular-ui-bootstrap
[参考地址](https://github.com/angular-ui/bootstrap)
