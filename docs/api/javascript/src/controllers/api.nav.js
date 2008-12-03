(function($, $C){
	$C.Nav$Class = {
		defaultPage	: null,//"/doc/api/core.wiki",
	    tracWiki:null,
	    constructor: function(options){
	       $.extend( this, 
	       		$C.Nav$Class,
	       		$.Logging.getLogger("Claypool.API.Controllers.Nav")
       		);$.extend(true, this, options);
	    },
	    load: function(event, mvc){
	        var _this = this;
	        var target = event.currentTarget||event.target;
	        var href = !($(target).attr('href'))?
	        	this.tracWiki.defaultUrl:$(target).attr('href');
	        //check the controller cache first
	        //no dice, go get it with the dao
	        this.tracWiki.find( href, 
	            function(text){
	                mvc.m = text;
	                mvc.v = "#api";
	                mvc.resolve(/*function(){
	                    //both views share the same model for rendering
	                    mvc.v = "#tertiaryNavView";
	                    mvc.resolve(function(){
	                        mvc.v = "#primaryNavView";
	                        mvc.resolve();
	                    });
	                }*/);
	            });
	    },
	    loadDefault: function(event, mvc){
	        //send it on through as if it had been
	        //a click on the primary nav menu.
	        event.currentTarget = jQuery('a[href='+this.defaultPage+']');
	        this.load(event, mvc);
	    }
	};
	$C.Nav           = $C.Nav$Class.constructor;
})(jQuery, API.Controllers);