Claypool.Templates={
/*
 * Claypool.Views @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   View Patterns and Technology Integration Points -
 */
};
(function($, $Log, $T){
	
	$T.Container$Class = {
		constructor: function(){
			
		},
		get: function(id){
			
		}
	};
	
	$T.Factory$Class = {
		constructor: function(){
			
		},
		updateConfig: function(){
			
		},
		create: function(){
			
		}
	};
	
	$T.View$Class = {
		constructor: function(){
			
		},
		compile: function(){
			
		},
		render : function(){
			
		}
	};
	
	/**@constructorAlias*/
	$T.Container        = $T.Container$Class.constructor;
	$T.Factory			= $T.Factory$Class.constructor;
	$T.View				= $T.View$Class.constructor;
	
})( Claypool, /*Required Modules*/
	Claypool.Logging,
	Claypool.Templates );

//Give a little bit, Give a little bit of our views to you. ;)
(function($){ 
	$.Templates = Claypool.Templates; 
})(jQuery);
