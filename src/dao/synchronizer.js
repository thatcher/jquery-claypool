
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
     Synchronizer$Interface : {
	        // if dirtyRecords is null, the method is expected to determine
	        //  which records have changed since the timestamp and provide 
	        //  those records as as array to the callback.  Otherwise it
	        //  is expected to provide any logic to update the dirty records
	        //  in its own storage implementation
	        synchronize: function(dirtyRecords, timestamp, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	
})(  jQuery, Claypool, Claypool.IoC );
