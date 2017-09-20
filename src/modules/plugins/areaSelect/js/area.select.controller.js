var cityData = require("./areaData.js");

module.exports = ['$scope','$attrs', function($scope, $attrs){
  $scope.init = function(){
    $scope.cities = {};
    $scope.activeTab = "province";
    $scope.needCounty = $attrs.needCounty == "false" ? false : "true";
    var areaParamNames = $attrs.areaParamNames || "province:city:county";
    var areaParams = areaParamNames.split(":");
    $scope.provinceName = areaParams[0];
    $scope.cityName = areaParams[1];
    $scope.countyName = areaParams[2];
    if($scope.ngModel){
      $scope.aresShowName = getShowName();
    }
  }

  function getShowName(){
    var province = $scope.ngModel[$scope.provinceName] || "";
    var city = $scope.ngModel[$scope.cityName] || "";
    var county = $scope.ngModel[$scope.countyName] || "";
    return province + city + county;
  }

  $scope.init();

  $scope.areaSelectClick = function(){
    $scope.showAreaSelect = !$scope.showAreaSelect;
    $scope.showProvinceTab();
  }

  $scope.hideCities = function(){
    $scope.showAreaSelect = false;
  }

  function setCities(province, city, county){
    $scope.ngModel[$scope.provinceName] = province || '';
    $scope.ngModel[$scope.cityName] = city || '';
    $scope.ngModel[$scope.countyName] = county || '';
    $scope.aresShowName = $scope.ngModel[$scope.provinceName] + $scope.ngModel[$scope.cityName] + $scope.ngModel[$scope.countyName];
  }

  $scope.selectCounty = function($childScope){
    $scope.hideCities();
    setCities($scope.ngModel[$scope.provinceName], $scope.ngModel[$scope.cityName], $childScope["county"]);
  }

  $scope.selectCity  = function($childScope){
    setCities($scope.ngModel[$scope.provinceName], $childScope["city"]);
    $scope.showCountyTab();
  }
  $scope.selectProvince = function($childScope){
    setCities($childScope["province"]);
    $scope.showCityTab();
  }

  $scope.showProvinceTab = function(){
    $scope.activeTab = "province";
  }

  $scope.showCityTab = function(){
    setCity();
    $scope.activeTab = "city";
  }

  $scope.showCountyTab = function(){
    if($scope.needCounty){
      setCounty();
      $scope.activeTab = "county";
    }else{
      $scope.hideCities();
    }
  }

  function setCounty(){
    var province = $scope.ngModel[$scope.provinceName];
    var city = $scope.ngModel[$scope.cityName];
    var key = province + "-" + city;
    var cities = (province && city ) ? mergeCities(cityData.a[key]) : [];
    $scope.cities["counties"] = cities || [];
    if(cities.length == 0 ){
      $scope.hideCities();
    }
  }

  function setCity(){
    var province = $scope.ngModel[$scope.provinceName]
    var cities = province ? mergeCities(cityData.c[province]) : [];
    $scope.cities["cities"] = cities || [];
    $scope.cities["counties"] =  [];
  }

  function mergeCities(cities){
    if(!cities) return [];
    var allCities = [];
    var a2gCity = {key:'A-G',list:[]};
    var h2kCity =   {key:'H-K',list:[]};
    var l2sCity =   {key:'L-S',list:[]};
    var t2zCity =   {key:'T-Z',list:[]};

    var currCity;
    for(var i = 0; i < cities.length; i++){
      var city = cities[i];
      var key = city["key"];
      if('A' <= key && 'H' > key){
        currCity = a2gCity;
      }else if('H' <= key && 'K' >= key){
        currCity = h2kCity;
      }else if('L' <= key && 'S' >= key){
        currCity = l2sCity;
      }else if('T' <= key && 'Z' >= key){
        currCity = t2zCity;
      }
      currCity.list = currCity.list.concat(city.list);
    }
    addCities(allCities, a2gCity);
    addCities(allCities, h2kCity);
    addCities(allCities, l2sCity);
    addCities(allCities, t2zCity);
    return allCities;
  }

  function addCities(allCities, cities){
    if(cities.list.length > 0){
      allCities.push(cities);
    }
  }

  function setProvince(){
    $scope.cities["provinces"] =  mergeCities(cityData.p);
  }

  setProvince();

}];
