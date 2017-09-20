module.exports = function() {
	return {
      restrict: 'A',
      scope : {
        active: '&onActive',
        remove: '&onRemove',
        open:'&onOpen',
        tabs: '=uiTabHl'
      },
      templateUrl: '/modules/plugins/uiTab/html/index.html',
      link:function(scope, element, attrs, ctrl, transclude){
      	 element.addClass('ui-tab-hl');
      	 console.log(attrs);
      },
      controller:'uiTab'      
  }
};
