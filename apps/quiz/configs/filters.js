
(function($){

    var log;
    
    $.filters([{

        id        : "#exampleControllerFilter",
        target    : "Example.Controllers.*",
        before    : "([a-z]*)",
        advice    : function(event){
            log = log||$.logger('Example.Filters');
			var invocation = arguments[arguments.length-1];
            log.debug( 'Filtering invocation before %s %s', invocation.target, invocation.method);
		}
		
	}]);
	
})(jQuery);