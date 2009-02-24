
/*
 * Claypool @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-09-27 13:17:28 -0400 (Sat, 27 Sep 2008) $
 * $Rev: 273 $
 */



/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
	/**
	 * @constructor
	 */
    Publisher$Interface : {
	        create: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        replace: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        update: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        _delete: function(id, callback){//reserved word 'delete'
	            throw new $.MethodNotImplementedError();
	        }
	    },
	
})(  jQuery, Claypool, Claypool.IoC );
