
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
    Gears$Class : {
	    	dbName:null,
	    	connection:null,
	        constructor: function(options){
	            jQuery.extend(this, $DAO.Gears$Class);
	            jQuery.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.DAO.Gears");
	            this.connection = google.gears.factory.create('beta.database');
	        },
	        execute: function(options){
	            this.logger.debug("Executing SQL: \n\t\t %s", options.sql);
	            var resultSet = this.connection.execute(options.sql);
	            if(options.callback){options.callback(resultSet);}else{resultSet.close();}
	            return this;//chain
	        },
	        executeWithParams: function(options){
	            this.logger.debug("Executing SQL: \n\t\t %s, %s", options.sql, options.params);
	            var resultSet =  this.connection.execute( options.sql, options.params );
	            if(options.callback){options.callback(resultSet);}else{resultSet.close();}
	            return this;//chain
	        },
	        begin: function(){
	            this.logger.debug("Beginning SQL Transaction %s", this);
	            this.connection.execute( "BEGIN" );
	            return this;//chain
	        },
	        commit: function(){
	            this.logger.debug("Commit SQL Transaction %s", this);
	            this.connection.execute( "COMMIT" ).close();
	            return this;//chain
	        },
	        rollback: function(){
	            this.logger.info("Rolling Back SQL Transaction %s", this);
	            this.connection.execute( "ROLLBACK" ).close();
	            return this;//chain
	        },
	        lastId: function(){
	            //doesnt chain
	            return this.connection.lastInsertRowId;
	        }
	    }
	
})(  jQuery, Claypool, Claypool.IoC );
