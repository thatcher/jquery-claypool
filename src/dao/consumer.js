
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
    Consumer$Interface : {
	        //Generic Query interface to get entire records
	        find: function(id, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        findAll: function(callback){
	            throw new $.MethodNotImplementedError();
	        },
	        findBy: function(criteria, params, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	Searcher$Interface : {
	        //Think OpenSearch, for getting paged result sets
	        search: function(query, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        suggest: function(query, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
})(  jQuery, Claypool, Claypool.IoC );
