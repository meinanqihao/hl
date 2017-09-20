var calc = function(arr){
	var i=0;
	for(var m=0;m<arr.length;m++){
		i+=parseInt(arr[m]);
	}
	return i;
}

module.exports = function() {
	return {
      restrict: 'A',
      transclude: true,
      scope : {
        events : '&onEvents',
        gridRow: '&onHandle',
        setGrid: '&grid',
        outheight: '=outheight'
      },
      templateUrl: '/modules/plugins/grid/html/index.html',
      link:function(scope, element, attrs, ctrl, transclude){
      	 element.addClass('grid-table');
         var widths = attrs.widths.split(',');
         var tds = element.find('td');
         $('.grid-thead td',element).each(function(idx,item){
           	$(item).width(parseInt(widths[idx])-1+'px');
         });
				 $('table',element).width(calc(widths));
       
         $('.grid-body',element).on('scroll',function(){
         		$('.grid-thead > table',element).css('left',-$(this).scrollLeft());
         });
         scope.init(element,attrs.loadurl,attrs.text,widths,attrs.format);
      },
      controller:'gridTable'      
  }
};
