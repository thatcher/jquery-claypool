
(function($){
        
        /*
 	Script: JStORM.js
 	        Contains the main namespace for JStORM and connection/model management
 	
 	License:
 	        MIT-style license.
*/

/*
  Class: JStORM
  	the main namespace for JStORM. Also provides connection/model management
 */
var JStORM = 
{
	/*
	 a dictionary from model name to class
	*/
	_models:{},
	_introspections:{},
	/*
	 a dictionary from connection name to options
	 */
	connections:{},
	/*
	 a list of all open connections
	 */
	openConnections:[],
	/*
	 if true debug logging will be enabled
	 */
	debug:true,
	version:'0.3beta',
	/*
	 Function: getConnectionParams
	 	return the connection options by connection name
	 Parameters:
	 	connName - connection name
	 Returns:
	 	the connection options by connection name
	 */
	getConnectionParams:function(connName)
	{
		return JStORM.connections[connName];
	},
	/*
	  Function: getConnection
	  	return a new connection by connection name
	  Parameters:
	  	connName - connection name
	  Returns:
	  	a new connection by connection name
	 */
	getConnection:function(connName)
	{
		var connParams = JStORM.getConnectionParams(connName);
		var conn = new JStORM[connParams.PROVIDER].Connection();
		conn.open(connParams);
		conn.transactionDepth = 0;
		JStORM.openConnections.push(conn);
		return conn;
	},
	/*
	  Function: getIntrospection
	  	return an introspection object for a connection by its name
	  Parameters:
	  	connName - connection name
	  Returns:
	  	an introspection object for a connection by its name
	 */
	getIntrospection:function(connName)
	{
		var connParams = JStORM.getConnectionParams(connName);
		if(!JStORM._introspections[connName])
			JStORM._introspections[connName] = new JStORM[connParams.DIALECT].Introspection(connName);
		return JStORM._introspections[connName];
	},
	/*
	 Function: closeAllConnections
	  	close all the open connections
	 */
	closeAllConnections:function()
	{
		while(JStORM.openConnections.length)
			JStORM.openConnections.pop().close();
	},
	/*
		taken from mootools
	 */
	extend:function(src, add)
	{
		if (!add)
		{
			add = src;
			src = this;
		}
		for (var property in add) src[property] = add[property];
		return src;
	},
	/*
		internal
	*/
	each:function(arr,fn)
	{
		for(var i=0,l=arr.length;i<l;i++)
			fn(arr[i]);
	}
};

/**
 * log a message with available logging module
 */
JStORM.debug = false;
JStORM.log = (function(){
	if(JStORM.debug && typeof window === "object" && window.console && window.console.log)
		return function(args){
		    var res = args;
			if(typeof(args) != "string" && args.length)
				var res =Array.prototype.join.apply(args,[","]);
		    console.log(res);
	    };
	else if (JStORM.debug && typeof Jaxer === "object")
	{
		return function(args)
		{
			var res = args;
			if(typeof(args) != "string" && args.length)
				var res =Array.prototype.join.apply(args,[","]);
			Jaxer.Log.info(res);
		};
	}else if(JStORM.debug) {   
    		return function(args) {
    			var res = args;
    			if(typeof(args) != "string" && args.length){
    				var res =Array.prototype.join.apply(args,[","]);
				}
    			print(res);
    		};
	}
	else
		return function(){};	
})();
/*
 	Script: JStORM.Events.js
 	        Contains a event manager for JStORM
 	
 	License:
 	        MIT-style license.
*/
/*
 Class: JStORM.Events
 	a simple event manager
 Constructor:
 */
JStORM.Events = function()
{
	this.$events = {};
}
JStORM.Events.prototype = 
{
	/*
	 Function: addListener
	 	add an event listener
	 Parameters:
	 	name - the name of the event
	 	fn - callback function
	 */
	addListener:function(name,fn)
	{
		this.$events[name] = this.$events[name] || [];
		this.$events[name].push(fn);
		return this;	
	},
	/*
	 Function: removeListener
	 	remove an event listener
	 Parameters:
	 	name - the name of the event
	 	fn - callback function
	 */
	removeListener:function(name,fn)
	{
		if(this.$events[name])
			this.$events[name].remove(fn);
		return this;
	},
	/*
	 Function: fireEvent
	 	fire an event
	 Parameters:
	 	name - the name of the event
	 	args - arguments for event listeners
	 	bind - binding for event listeners
	 */
	fireEvent:function(name,args,bind)
	{
		var listeners = this.$events[name];
		if(listeners)
			for(var i=0,ln=listeners.length;i<ln;i++)
				listeners[i].apply(bind || this,args || [])
		return this;
	}
};

/*
  Function: wrapFunction
  	wrap a function with a onBefore/onAfter events
  Parametrs:
  	fn - function to wrap
  	name - name of the event
  	object - the event manager
  Returns:
  	a wrapped function
 */
JStORM.Events.wrapFunction=function(fn,name,object)
{
	return function()
	{
		object.fireEvent("onBefore"+name,[this]);
		var ret = fn.apply(this,arguments);
		object.fireEvent("onAfter"+name,[this]);
		return ret;
	};
};
/*
 	Script: JStORM.Field.js
 	        contains a class used to describe a field in a model 
 	
 	License:
 	        MIT-style license.
*/

/*
 Class: JStORM.Gears.ResultSet
 	represent a field in a model
 Constructor:
 Parameters:
 	options - options of a field:
 		columnName - name of the column in the database
 		relatedColumnName - name of the column in the related model (if this is a relation)
 		relationType - either ManyToOne or OneToMany
 		type - type of the field
    maxLength - max length of the field (apply to String only)
 		isPrimaryKey - is this field a primary key?
 		allowNull - true to enable null values in this field
 */
JStORM.Field = function(options)
{
	this.columnName = options.columnName;
	this.relatedColumnName = options.relatedColumnName;
	this.relatedModel = function()
	{
		return JStORM._models[options.relatedModel];
	};
	this.relationType = options.relationType;
	this.eager = !!options.eager;
	this.isRelation = !!this.relationType;
	this.type = this.isRelation ? "Integer" : options.type;
	this.maxLength = options.maxLength;
	this.isPrimaryKey = options.isPrimaryKey;
	this.allowNull = options.allowNull;
};

JStORM.Field.prototype.getSqlType = function()
{
	 
	return JStORM.Field.TypeToSql[this.type](this);
};

JStORM.Field.TypeToSql =
{
	"Long":function()
	{
		return 'LONG';
	},
	"Integer":function()
	{
		return 'INTEGER';
	},
	"Float":function()
	{
		return 'REAL';
	},
	"String":function(field)
	{
		return 'VARCHAR(' + field.maxLength +')';
	}
};
/*
 	Script: JStORM.Model.js
 	        Contains the JStORM.Model meta-class used to describe a model
 	
 	License:
 	        MIT-style license.
*/

/*
 	Class: JStORM.Model
  		a meta-class used to describe a model
  	Constructor:
  	Parameters:
  		options - a dictionary of the following:
  			name - name of the model
  			connection - name of the connection
  			fields - a dictionary between field names and instances of JStORM.Field
*/
JStORM.Model = function(options)
{
	if(!options || !options.name || !options.fields || !options.connection)
		throw new Error("no name/fields/connection were supplied");
	/*
	 Class: JStORM.Model.model
	 	this is the class of each model, created by the meta-class
	 Constructor:
	 Parameters:
	 	valuesOrRowID - either the id of a row in the table to retrieve or 
	 	an object to populate the new instance
	*/
	var model = function(valuesOrRowID)
	{
		var instance = this;
		if(valuesOrRowID)
		{
			if(typeof(valuesOrRowID) == "number")
			{
				this.setPkValue(valuesOrRowID);
				this.refresh();
				return;
			}
			else
			{
				JStORM.extend(this,valuesOrRowID);
			}
		}
		JStORM.each(model._meta.relations,function(relation)
		{   
		    var rmodel = relation.relatedModel();
		    JStORM.log("ManyToOne relation " + rmodel._meta.tableName);
			if(relation.relationType == "ManyToOne")
			{   
			    JStORM.log("Lazy Loading ManyToOne relation " + rmodel._meta.tableName);
				instance[relation.fieldName] = new JStORM.Query( rmodel ).
					filter(relation.relatedColumnName + " = ?",function(){
			            JStORM.log("Loaded ManyToOne instance " + instance.getPkValue());
					    return instance.getPkValue();
				    });
			}
		});
	};
	
	model.prototype =
	{
		/*
		 Function: save
		 	save the instance into the database (does INSERT/UPDATE)
		 */
		save:function()
		{
			return this._updateInsert(this._isPkSet(this));
		},
		/*
		 Function: remove
		 	remove the instance from database (using DELETE)
		 */
		remove:function()
		{
			model.removeByPk(this.getPkValue());
		},
		/*
		 Function: refresh
		 	retrieve the instance from database
		 */
		refresh:function()
		{
			if(this._isPkSet())
				JStORM.extend(this,model.getByPk(this.rowid));
			return this;
		},
		/*
		 Function: getPkValue
		 	return the value of the primary key
		 Returns:
		 	the value of the primary key
		 */
		getPkValue:function()
		{
			return this[model._meta.pk.fieldName];
		},
		/*
		 Function: setPkValue
		 	set the value of the primary key
		 */
		setPkValue:function(pkValue)
		{
			this[model._meta.pk.fieldName] = pkValue;
			return this;
		},
		_isPkSet:function()
		{
			return !!this[model._meta.pk.fieldName];
		},
		_updateInsert:function(update)
		{
			var query = update ? model._sql.getUpdateSql() : model._sql.getInsertSql();

			var values = [],self = this;
			JStORM.each(model._meta.fields,function(field)
			{
				var value = self[field.fieldName];
				if(typeof(value) == "undefined")
					values.push(null);
				else
					values.push(value);
			});
			JStORM.each(model._meta.relations,function(relation)
			{
				var value = self[relation.fieldName];
				if(relation.relationType == "OneToMany")
				{
					if(typeof(value) == "number" || (!value && relation.allowNull))
						values.push(value);
					else if(value.getPkValue)
						values.push(value.getPkValue());
					else
						throw new Error("value of related model can be a model instance,or a id(integer)");
				}
			});			
			if(update)values.push(this.getPkValue());
			var conn = model.getConnection();
			conn.executeNonQuery(query,values);			
			if(!update)this.rowid = conn.getLastInsertId();
			return this;
		}
	};
	//add static methods
	JStORM.extend(model,this);
	//add events support
	JStORM.extend(model,new JStORM.Events);
	for(var i in model.prototype)//add events to save,remove,refresh
		if(i.charAt(0) != "_")//wrap only public functions
			model.prototype[i] = JStORM.Events.wrapFunction(model.prototype[i],i.charAt(0).toUpperCase()+i.substring(1),model);

	//add meta data
	model._meta = new JStORM.ModelMetaData(model,options);
	//add sql generator
	model._sql = new JStORM.Sql(model._meta);
	//add getBy and removeBy for each fields
	//for(var i=0,l = model._meta.fields.length;i<l;i++)
	//{
	//	var field = model._meta.fields[i];
	//	model["getBy" + field.fieldName] = JStORM.curry(model.getByFieldValue,model,field.fieldName);
	//	model["removeBy" + field.fieldName] = JStORM.curry(model.removeByFieldValue,model,field.fieldName);
	//}
	
	//register model
	JStORM._models[options.name] = model;
	return model;
};
JStORM.Model.prototype = {
	/*
	 Function: all
	 	return a JStORM.Query for the model without filtering
	 Returns:
	 	a JStORM.Query for the model without filtering
	 */
	all: function(){
		return new JStORM.Query(this);
	},
	/*
	 Function: filter
	 	return a JStORM.Query for the model with filtering
	 Parameters:
	 	sql - the sql whereClause
	 	params - bind parameters
	 Returns:
	 	a JStORM.Query for the model with filtering
	 */
	filter: function(sql,params){
		var query = this.all();
		return query.filter.apply(query, arguments);
	},
	/*
	 Function: remove
	 	remove all the rows that match the filter
	 Parameters:
	 	sql - the sql whereClause
	 	params - bind parameters
	 */
	remove: function(sql,params){
		var query = this.all();
		query.filter.apply(query, arguments).remove();
	},
	/*
	 Function: getByFieldValue
	 	return the first row where the fieldName = fieldValue
	 Parameters:
	 	fieldName - the name of the field
	 	fieldValue - the value of the field
	 Returns:
	 	the first row where the fieldName = fieldValue
	 */
	getByFieldValue: function(fieldName, fieldValue){
		return this.filter(this._meta.tableName + "." + fieldName + " = ?", fieldValue).first();
	},
	/*
	 Function: getByPk
	 	return the row by the primary key
	 Parameters:
	 	pkValue - value of primary key
	 Returns:
	 	the row by the primary key
	 */
	getByPk: function(pkValue){
		return this.getByFieldValue(this._meta.pk.fieldName, pkValue);
	},
	/*
	 Function: removeByFieldValue
	 	remove all rows where the fieldName = fieldValue
	 Parameters:
	 	fieldName - the name of the field
	 	fieldValue - the value of the field
	 */
	removeByFieldValue: function(fieldName, fieldValue){
		return this.filter(this._meta.tableName + "." + fieldName + " = ?", fieldValue).remove();
	},
	/*
	 Function: removeByPk
	 	remove the row by the primary key
	 Parameters:
	 	pkValue - value of primary key
	 */
	removeByPk: function(pkValue){
		this.removeByFieldValue(this._meta.pk.fieldName, pkValue);
	},
	/*
	 Function: getConnection
	 	return the connection for this model
	 Returns:
	 	the connection for this model
	 */
	getConnection: function(){
		if (!this._connection) {
			this._connection = JStORM.getConnection(this._meta.connName);
		}
		return this._connection;
	},
	/*
	 Function: dropTable
	 	drop the table that this model is abstracting
	 */
	dropTable: function(){
		if(this.doesTableExist())
			this.getConnection().executeNonQuery(this._sql.getDropTableSql());
	},
	/*
	 Function: createTable
	 	create the table that this model is abstracting
	 */
	createTable: function(){
		if(!this.doesTableExist())
			this.getConnection().executeNonQuery(this._sql.getCreateTableSql());
	},
	/*
	 Function: doesTableExist
	 	return true if the table is already created
	 */
	doesTableExist:function(){
		return JStORM.getIntrospection(this._meta.connName).doesTableExist(this._meta.tableName);
	},
	/*
	 Function: transaction
	 	run a function in a transaction
	 Parameters:
	 	fn - function to run
	 	bind - bind for the function
	 */
	transaction: function(fn, bind){
		var conn = this.getConnection();
		try {
			if (conn.transactionDepth <= 0) 
				conn.begin();
			conn.transactionDepth++;
			fn.apply(bind || this, []);
		} 
		catch (e) {
			conn.transactionDepth = 0;
			conn.rollback();
			throw e;
		}
		conn.transactionDepth = Math.max(0, conn.transactionDepth - 1);
		if (conn.transactionDepth <= 0) 
			conn.commit();
		
	},
	_newFromResultSet: function(result, relationPrefix){
		var cls = this;
		//create a new instance of the this class
		var instance = new cls();
		
		//every model has a primary key. Set the value from the result
		instance.setPkValue(result.getByFieldName(relationPrefix + "_" + this._meta.pk.columnName));
		
		JStORM.each(cls._meta.fields, function(field){
			instance[field.fieldName] = result.getByFieldName(relationPrefix + "_" + field.fieldName)
		});
		
		JStORM.each(cls._meta.relations, function(relation){
			if (relation.relationType == "OneToMany") {
				var relatedModel = relation.relatedModel();
				if (relatedModel == cls) 
					instance[relation.fieldName] = new relatedModel().setPkValue(result.getByFieldName(relationPrefix + "_" + relation.columnName));
				else 
					instance[relation.fieldName] = relatedModel._newFromResultSet(result, relationPrefix + "_" + relation.columnName)
			}
		});
		return instance;
	}
	/*
	 TODO: load,
	 */
};
/*
 	Script: JStORM.ModelMetaData.js
 	        contains a class used to describe a model's metadata 
 	
 	License:
 	        MIT-style license.
*/
/*
 Class: JStORM.ModelMetaData
 	represents a field in a model
 Constructor:
 Parameters:
 	modelClass - the class of the model
 	options - options of the model:
 		name - the name of the model
 		connection - the name of the connection
 		fields - the fields of the model
 */
JStORM.ModelMetaData = function(modelClass,options)
{
	this.modelClass = modelClass;
	this.tableName = options.name;
	this.connName = options.connection;
	this.fields = [];
	this.relations = [];
	//go over field
	for(var fieldName in options.fields)
	{
		var field = options.fields[fieldName];
		field.fieldName = fieldName;
		field.columnName = field.columnName ? field.columnName : fieldName;
		field.sqlType = field.getSqlType();
		if(field.isPrimaryKey)
		{
			this.pk = field;
		}
		else
		{
			if(field.isRelation)
				this.relations.push(field);
			else
				this.fields.push(field);
		}
	}
	//if there is no primary key, add rowid
	if(!this.pk)
	{
		this.pk = new JStORM.Field({columnName:"rowid",isPrimaryKey:true,type:"Integer"});
		this.pk.fieldName = "rowid";
		if(JStORM.getConnectionParams(this.connName).DIALECT){
		    this.pk.sqlType = JStORM[JStORM.getConnectionParams(this.connName).DIALECT].Sql.defaultPkSql;
		}	
	}
};

/*
 	Script: JStORM.Query.js
 	        contains a class used to query over models
 	
 	License:
 	        MIT-style license.
*/

/*
  Class: JStORM.Query
  	a class used to query over models
  Constructor:
  Parameters:
  	modelClass - the class of the model
 */

JStORM.Query = function(modelClass)
{
	this.modelClass = modelClass;
	this._meta = modelClass._meta;
	this._sql = modelClass._sql;
	this._whereClause = [];
	this._orderBy = [];
	this._params = [];
	this._limit = 0;
	this._offset = 0;
	this._result = null;
};

JStORM.Query.prototype = 
{
	/*
	 Function: filter
	 	return a new Query instance filtered by whereClause
	 Parameters:
	 	whereClause - a sql where clause
	 Returns:
	 	a new Query instance filtered by whereClause
	 */
	filter:function(whereClause)
	{
		var clone = this._clone();
		clone._whereClause.push("("+whereClause+")");
		this._extendArrayFromArg(clone._params,arguments,1);
		return clone;
	},
	/*
	 Function: orderBy
	 	return a new Query ordered by columns
	 Parameters:
	 	a list of columns to order by
	 Returns:
	 	a new Query ordered by columns
	 */
	orderBy:function()
	{
		var clone = this._clone();
		this._extendArrayFromArg(clone._orderBy,arguments);
		return clone;
	},
	/*
	 Function: orderBy
	 	return a new Query limited to return n rows
	 Parameters:
	 	limit - how many rows to be returned 
	 Returns:
	 	a new Query limited to return n rows
	 */
	limit:function(limit)
	{
		var clone = this._clone();
		clone._limit = limit;
		return clone;
	},
	/*
	 Function: offset
	 	return a new Query with a row offset of n rows
	 Parameters:
	 	offset - the row offset 
	 Returns:
	 	a new Query with a row offset of n rows
	 */
	offset:function(offset)
	{
		var clone = this._clone();
		clone._offset = offset;
		return clone;
	},
	/*selectRelated:function()
	{
		
		
	},*/
	/*
	 Function: count
	 	return the number of rows that match the query
	 Parameters:
	 Returns:
	 	the number of rows that match the query
	 */
	count:function()
	{
		return this._executeScalar(this._sql.getCountSql(this._whereClause));
	},
	/*
	 Function: remove
	 	remove all the rows that match the query
	*/
	remove:function()
	{
		this._executeNonQuery(this._sql.getDeleteSql(this._whereClause));
	},
	/*
	 	Function: first
	 		return the first row as instance of the model class
	 	Returns:
	 		the first row as instance of the model class
	 */
	first:function()
	{
		var first = this.next();
		this.close();
		return first;
	},
	/*
	 Function: next
	 	return the next row as instance of the model class
	 Returns:
	 	the next row as instance of the model class
	*/	 
	next:function()
	{
		if(!this._result)
		{
			//execute the query
			this._result = this._execute(this._sql.getSelectSql(
				this._whereClause,this._orderBy,this._limit,this._offset
			));
		}
		
		if (this._result.next())
			return this.modelClass._newFromResultSet(this._result,this._meta.tableName);
		else {
			this.close();
			return false;
		}
	},
	/*
	 Function: close
	 	close the inner result set
	 */
	close:function()
	{
		if (this._result)
		{
			this._result.close();
			//make result null if we want to run the query again
			this._result = null;
		}
	},
	/*
	 Function: each
	 	apply fn on each row (as a model instance) returned by query
	 Parameters:
	 	fn - function to apply on each row
	 	bind - the binding for the function
	 */
	each:function(fn,bind)
	{
		var current;
		while(current = this.next())fn.apply(bind || this,[current]);
	},
	/*
	 Function: toArray
	 	return the rows returned by the query as a array of model instances
	 Returns:
	 	the rows returned by the query as a array of model instances
	 */
	toArray:function()
	{
		var arr = [];
		this.each(arr.push,arr);
		return arr;
	},
	///////////////////////////////////
	/// private functions          ///
	/////////////////////////////////
	_getConnection:function()
	{
		return this.modelClass.getConnection()
	},
	_execute:function(sql)
	{
		return this._getConnection().execute(sql,this._getParams());
	},
	_executeScalar:function(sql)
	{
		return this._getConnection().executeScalar(sql,this._getParams());
	},
	_executeNonQuery:function(sql)
	{
		return this._getConnection().executeNonQuery(sql,this._getParams());
	},
	_extendArrayFromArg:function(arr,args,offset)
	{
		arr.push.apply(arr,Array.prototype.slice.apply(args,[offset ? offset : 0]));
	},
	_getParams:function()
	{
		var params = [];
		for(var i=0,l=this._params.length;i<l;i++)
			params.push(typeof(this._params[i]) == "function" ? this._params[i]() : this._params[i]);
		return params;
	},
	_clone:function()
	{
		var clone = new JStORM.Query(this.modelClass);
		clone._whereClause = this._whereClause; 
		clone._orderBy = this._orderBy;
		clone._params = this._params;
		clone._limit = this._limit;
		clone._offset = this._offset;
		return clone;
	}
};
/*
 	Script: JStORM.Sql.js
 	        contains code for sql generation
 	
 	License:
 	        MIT-style license.
*/
JStORM.Sql = function(metaData)
{
	this._meta = metaData;
};
JStORM.Sql.prototype =
{
	getDeleteSql:function(whereClause)
	{
		var sql = ["DELETE FROM ",this._meta.tableName];
		if (whereClause.length > 0)
		{
			sql.push(" WHERE ");
			sql.push(whereClause.join(" AND "))
		}
		return sql.join("");
	},
	getCountSql:function(whereClause)
	{
		var sql = ["SELECT COUNT(",this._meta.pk.columnName,") AS c FROM ",this._meta.tableName];
		if (whereClause.length > 0)
		{
			sql.push(" WHERE ");
			sql.push(whereClause.join(" AND "))
		}
		return sql.join("");
	},
	getSelectSql:function(whereClause,orderBy,limit,offset)
	{
		var sql = [
			"SELECT ",this._fieldsSelect(this._meta.tableName)," FROM ",this._meta.tableName,this._joinSelect(this._meta.tableName)
		];	
		if(whereClause.length > 0)
		{
			sql.push(" WHERE ");
			sql.push(whereClause.join(" AND "));
		}
		if(orderBy.length > 0)
		{
			sql.push(" ORDER BY ");
			sql.push(orderBy.join(","));
		}
		if(limit != 0)
		{
			sql.push(" LIMIT ");
			sql.push(limit);
		}
		if(limit != 0 && offset != 0)
		{
			sql.push(" OFFSET ");
			sql.push(offset);
		}
		return sql.join("");
	},
	getCreateTableSql:function()
	{
		var query = ["CREATE TABLE ",this._meta.tableName,"("];
		
		query.push(this._meta.pk.columnName," ",this._meta.pk.sqlType,",")
		JStORM.each(this._meta.fields,function(field)
		{
			query.push(field.columnName," ",field.sqlType,",");
		});
		//TODO: add foreign key constraint and not null if needed, default
		JStORM.each(this._meta.relations,function(relation)
		{
			if(relation.relationType == "OneToMany")
				query.push(relation.columnName," ",relation.sqlType,",");
		});
		query = query.splice(0,query.length-1);
		query.push(")");
		return query.join("");
	},
	getDropTableSql:function()
	{
		return "DROP TABLE " + this._meta.tableName;
	},
	getInsertSql:function()
	{
		return ["INSERT INTO ",this._meta.tableName," (",
			this._fields(),
			") VALUES (",
			this._values(),")"].join("");

	},
	getUpdateSql:function()
	{
		return ["UPDATE ",this._meta.tableName," SET ",this._fieldsValue()," WHERE ",this._meta.pk.columnName," = ?"].join("");
	},
	_fieldsSelect:function(relationPrefix)
	{
		var fields = [];
		var self  = this;
		fields.push(relationPrefix + "." + this._meta.pk.columnName + " AS " + relationPrefix + "_" + this._meta.pk.fieldName );
		
		JStORM.each(this._meta.fields,function(field){
			fields.push(relationPrefix + "." + field.columnName + " AS " + relationPrefix + "_" + field.fieldName );
		});
		JStORM.each(this._meta.relations,function(relation){
			if (relation.relationType == "OneToMany")
			{
				var relatedModel = relation.relatedModel();
				if(relatedModel == self._meta.modelClass)
					fields.push(relationPrefix + "." + relation.fieldName  + " AS " + relationPrefix + "_" + relation.fieldName);
				else
					fields.push(relatedModel._sql._fieldsSelect(relationPrefix + "_" + relation.fieldName));
			}
		});
		
		return fields.join(",");
	},
	_fieldsValue:function()
	{
		var fields = [];
		var self  = this;
		JStORM.each(this._meta.fields,function(field){
			fields.push(field.columnName + " = ?");
		});
		JStORM.each(this._meta.relations,function(relation){
			if(relation.relationType == "OneToMany")
				fields.push(relation.columnName  + " = ?");
		});
		
		return fields.join(",");
	},
	_fields:function()
	{
		var fields = [];
		var self  = this;
		JStORM.each(this._meta.fields,function(field){
			fields.push(field.columnName);
		});
		JStORM.each(this._meta.relations,function(relation){
			if(relation.relationType == "OneToMany")
				fields.push(relation.columnName);
		});
		
		return fields.join(",");
	},
	_values:function()
	{
		var fields = [];
		var self  = this;
		JStORM.each(this._meta.fields,function(field){
			fields.push("?");
		});
		JStORM.each(this._meta.relations,function(relation){
			if(relation.relationType == "OneToMany")
				fields.push("?");
		});
		
		return fields.join(",");
	},
	_joinSelect:function(relationPrefix)
	{
		var sql = [];
		var cls = this._meta.modelClass;
		JStORM.each(this._meta.relations,function(relation)
		{
			if(relation.relationType == "OneToMany")
			{
				var relatedModel = relation.relatedModel();
				if (relatedModel != cls)
				{
					var relatedName = relationPrefix + "_" + relatedModel._meta.tableName;
					sql.push(" LEFT JOIN ");
					sql.push(relatedModel._meta.tableName);
					sql.push(" AS ")
					sql.push(relatedName);
					sql.push(" ON ");
					sql.push(relatedName);
					sql.push(".");
					sql.push(relatedModel._meta.pk.columnName);
					sql.push(" = ");
					sql.push(relationPrefix);
					sql.push(".");
					sql.push(relation.columnName);
					sql.push(relatedModel._sql._joinSelect(relationPrefix + "_" + relation.fieldName));
				}
			}
		});
		return sql.join("");
	}
};

/*
 	Script: JStORM.Null.js
 	        support for Null dialect 
 	
 	License:
 	        MIT-style license.
*/
JStORM.SQNull = {};
JStORM.SQNull.Introspection = function(connName){};
JStORM.SQNull.Introspection.prototype = 
{
	doesTableExist:function() {
	    return true;
	}
};

JStORM.SQNull.Sql = { defaultPkSql:"" };

/*
 	Script: JStORM.MySQL.js
 	       support for MySQL dialect
 	License:
 	        MIT-style license.
*/
JStORM.MySQL = {};
/*
 Class: JStORM.MySQL.Introspection
 	a class that provides introspection for a connection to MySQL
 Constructor:
 Parameters:
 	connName - the connection name
 */
JStORM.MySQL.Introspection = function(connName)
{
	this.conn = JStORM.getConnection(connName);
};
JStORM.MySQL.Introspection.prototype = 
{
	/*
		Function: doesTableExist
			return true if all the tables asked for exist. Otherwise return false
		Parameters:
			a list of table names
		Returns:
			true if all the tables asked for exist, otherwise false
	 */
	doesTableExist:function()
	{
		var result = this.conn.execute("SHOW TABLES");
		var tableNames = {};
		while (result.next())
			tableNames[result.getByFieldPos(0)] = true;
			
		for(var i=0,l=arguments.length;i<l;i++)
			if(!tableNames[arguments[i].toLowerCase()])
				return false;
		return true;
	}
};

JStORM.MySQL.Sql =
{
	defaultPkSql:"INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT "
};

/*
 	Script: JStORM.SQLite.js
 	        support for SQLite dialect 
 	
 	License:
 	        MIT-style license.
*/
JStORM.SQLite = {};
/*
 Class: JStORM.SQLite.Introspection
 	a class that provides introspection for a connection to SQLite
 Constructor:
 Parameters:
 	connName - the connection name
 */
JStORM.SQLite.Introspection = function(connName)
{
	this.sqliteMasterModel = new JStORM.Model({
		name:"sqlite_master",
		fields:
		{
			type:new JStORM.Field({type:"String"}),
			name:new JStORM.Field({type:"String"}),
			tbl_name:new JStORM.Field({type:"String"}),
			rootpage:new JStORM.Field({type:"Integer"}),
			sql:new JStORM.Field({type:"String"})
		},
		connection:connName
	});
	
	//HACK:AIR has a bug that there is no sqlite_master table!
	if(JStORM.getConnectionParams(connName).PROVIDER == "AIR")
	{
		this.conn = this.sqliteMasterModel.getConnection();
		this.doesTableExist = this._doesTableExistAirHack;
	}
};
JStORM.SQLite.Introspection.prototype = 
{
	/*
		Function: doesTableExist
			return true if all the tables asked exist. Otherwise return false
		Parameters:
			a list of table names
		Returns:
			true if all the tables asked exist, otherwise false
	 */
	doesTableExist:function()
	{
		var argsLength = arguments.length;
		var qmarks = [];
		//used instead of ["table"].concat(arguments) since it doesn`t work as expected
		var vals = ["table"];
		for(var i=0;i<argsLength;i++)
		{
			qmarks.push("?");
			vals.push(arguments[i]);	
		}
		var query = ["sqlite_master.type =? AND sqlite_master.name IN (",qmarks.join(","),")"].join("");
		vals = [query].concat(vals);
		return this.sqliteMasterModel.filter.apply(this.sqliteMasterModel,vals).count() == argsLength;
	},
	_doesTableExistAirHack:function()
	{
		try
		{
			this.conn.conn.loadSchema(air.SQLTableSchema);
		}
		//this happens when there are no tables in the database
		catch(e)
		{
			return false;
		}
		var tables = this.conn.conn.getSchemaResult().tables;
		var tableNames = {};
		tables.forEach(function(table)
		{
			tableNames[table.name] = true;
		});
		
		for(var i=0,l=arguments.length;i<l;i++)
			if(!tableNames[arguments[i]])
				return false;
		return true;
	}
};

JStORM.SQLite.Sql =
{
	defaultPkSql:"INTEGER NOT NULL PRIMARY KEY "
};

/*
 	Script: JStORM.SQLServer.js
 	        support for SQL Server dialect (T-SQL)
 	License:
 	        MIT-style license.
 */
JStORM.SQLServer = {};
/*
 Class: JStORM.SQLServer.Introspection
 	a class that provides introspection for a connection to SQL Server
 Constructor:
 Parameters:
 	connName - the connection name
 */
JStORM.SQLServer.Introspection = function (connName) {
	this.sysObjects = new JStORM.Model({
		name:"sys.objects",
		fields:
		{
			objectId:new JStORM.Field({type:"Integer",isPrimaryKey:true,columnName:"object_id"}),
			name:new JStORM.Field({type:"String"}),
			type:new JStORM.Field({type:"String"}),
			parent: new JStORM.Field({
				relationType: "OneToMany",
				relatedModel: "sys.objects",
				allowNull: true,
				columName:"parent_object_id"
			})
		},
		connection:connName
	});
};
JStORM.SQLServer.Introspection.prototype =
{
	/*
		Function: doesTableExist
			return true if all the tables asked exist. Otherwise return false
		Parameters:
			a list of table names
		Returns:
			true if all the tables asked exist, otherwise false
	 */
	doesTableExist : function ()
	{
    	var argsLength = arguments.length;
		var qmarks = [];
		//U is for User table
		var vals = ["U"];
		for(var i=0;i<argsLength;i++)
		{
			qmarks.push("?");
			vals.push(arguments[i]);	
		}
		var query = ["type = ? AND name IN (",qmarks.join(","),")"].join("");
		vals = [query].concat(vals);
		return this.sysObjects.filter.apply(this.sysObjects,vals).count() == argsLength;
 	}
};

JStORM.SQLServer.Sql =
{
	beginTransactionSql : "BEGIN TRANSACTION ",
	defaultPkSql : "INTEGER NOT NULL IDENTITY ",
	getLastInsertIdSql : "SELECT @@IDENTITY "
};


/*
 	Script: JStORM.Access.js
 	        support for Access dialect
 	License:
 	        MIT-style license.
 */

JStORM.Access = {};
/*
 Class: JStORM.Access.Introspection
 	a class that provides introspection for a connection to Access
 Constructor:
 Parameters:
 	connName - the connection name
 */
JStORM.Access.Introspection = function (connName)
{
	this.connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + JStORM.getConnectionParams(connName).PATH;	
};

JStORM.Access.Introspection.prototype =
{
	/*
		Function: doesTableExist
			return true if all the tables asked for exist. Otherwise return false
		Parameters:
			a list of table names
		Returns:
			true if all the tables asked for exist, otherwise false
	 */
	doesTableExist: function()
	{
		var catalog = new ActiveXObject("ADOX.Catalog");
		catalog.ActiveConnection = this.connectionString;
		tableNames = {};
		for (var i = 0, l = catalog.Tables.Count; i < l; i++) 
			tableNames[catalog.Tables(i).Name] = true;
		
		for (var i = 0, l = arguments.length; i < l; i++) 
			if (!tableNames[arguments[i]]) 
				return false;
		
		return true;
	}
};
//Access dialect is very similar to SQL Server
JStORM.Access.Sql = JStORM.SQLServer.Sql

JStORM.NullProvider = {
	/**
	* Contributed by Christopher Thatcher
	*
	*/
};

JStORM.NullProvider.Connection = function(){};
JStORM.NullProvider.Connection.prototype = {
	execute:function(sql,params){},
	executeNonQuery:function(sql,params){},
	executeScalar:function(sql,params){},
	getLastInsertId:function(){},
	open:function(connParam){},
	close:function(){},
	rollback: function(){},
	commit: function(){},
	begin: function()
	{}
};

JStORM.NullProvider.ResultSet = function(resultSet){};
JStORM.NullProvider.ResultSet.prototype = {
	next:function(){},
	close:function(){},
	getByFieldName:function(fieldName){},
	getByFieldPos:function(fieldPos){},
	getScalar: function(){}
};


/*
 	Script: JStORM.AIR.js
 	        Support for Adobe AIR
 	
 	License:
 	        MIT-style license.
*/

/*
  Namespace: JStORM.AIR
  	the main namespace for AIR support
 */
JStORM.AIR = {};
/*
 Class: JStORM.AIR.Connection
 	represents an AIR connection
 */
JStORM.AIR.Connection = function(){};
JStORM.AIR.Connection.prototype = 
{
	/*
	 Function: begin
	 	begin a transaction
	 */
	begin:function()
	{
		this.conn.begin();
	},
	/*
	 Function: commit
	 	commit a transaction
	 */
	commit:function()
	{
		this.conn.commit();
	},
	/*
	 Function: rollback
	 	rollback a transaction
	 */
	rollback:function()
	{
		this.conn.rollback();
	},
	/*
	 Function: execute
	 	execute a sql statment
	 Parameters:
	 	sql - sql statment
	 	params - bind parameters
	 Returns:
	 	a JStORM.AIR.ResultSet for the query
	 */
	execute:function(sql,params)
	{
		JStORM.log(arguments);
		var stmt = this._getStatment(sql,params);
		stmt.execute();
		return new JStORM.AIR.ResultSet(stmt.getResult());
	},
	/*
	 Function: executeNonQuery
	 	execute a sql statment without returning
	 Parameters:
	 	sql - sql statment
	 	params - bind parameters
	 */
	executeNonQuery:function(sql,params)
	{
		JStORM.log(arguments);
		var stmt = this._getStatment(sql,params);
		stmt.execute();
	},
	/*
	 Function: executeScalar
	 	execute a sql statment and return the scalar value returned by query(i.e. the first column 
	 	of the first row)
	 Parameters:
	 	sql - sql statment
	 	params - bind parameters
	 Returns:
	 	the scalar value(first column of first row)
	 */
	executeScalar:function(sql,params)
	{
		return this.execute(sql,params).getScalar();
	},
	/*
	 Function: getLastInsertId
	 	return the id of the last inserted row
	 Returns:
	 	the id of the last inserted row
	 */
	getLastInsertId:function()
	{
		return this.conn.lastInsertRowID;
	},
	/*
	 Function: open
	 	open the connection
	 Parameters:
	 	connParam - the connection options, an object with a property PATH which is the database name
	 */
	open:function(connParam)
	{
		this.conn = new air.SQLConnection();
		this.conn.open(air.File.applicationStorageDirectory.resolvePath(connParam.PATH));
	},
	close:function()
	{
		this.conn.close();
	},
	/*
	 Function: close
	 	close the connections
	 */
	_getStatment:function(sql,params)
	{
		var stmt = new air.SQLStatement();
		stmt.sqlConnection = this.conn;
		stmt.text = sql;
		if(params)
			for(var i=0,l=params.length;i<l;i++)
				stmt.parameters[i] = params[i];
				
		return stmt;
	}
};
/*
 Class: JStORM.AIR.ResultSet
 	represents an Adobe AIR result set
 Constructor:
 Parameters:
 	resulSet - the Adobe AIR result set
 */
JStORM.AIR.ResultSet = function(resultSet)
{
	this.result = resultSet;
	this.resultPointer = -1;
	this.resultLength = resultSet.data ? resultSet.data.length : 0;
};

JStORM.AIR.ResultSet.prototype =
{
	/*
	 Function: next
	 	advance to the next row and return true if there is one to read
	 Returns:
	 	true if there is a row to read
	 */
	next:function()
	{
		return ++this.resultPointer < this.resultLength;
	},
	/*
	 Function: close
	 	close the result set
	 */
	close:function()
	{
		this.result = this.resultPointer = this.resultLength = null;
	},
	/*
	 Function: getByFieldName
	 	return the field value by its name
	 Parameters:
	 	fieldName - the name of the field
	 Returns:
	 	the field value
	 */
	getByFieldName:function(fieldName)
	{
		return this.result.data[this.resultPointer][fieldName];
	},
	/*
	 Function: getByFieldPos
	 	return the field value by its position
	 Parameters:
	 	fieldPos - the position of the field
	 Returns:
	 	the field value
	 */
	getByFieldPos:function(fieldPos)
	{
		var i = 0,row = this.result.data[this.resultPointer];
		for(var columnName in row)
			if(i++ == fieldPos)
				return row[columnName];
		return null;
	},
	/*
	 Function: getScalar
	 	return the scalar value of the result set	 
	 Returns:
	 	the first column of the first row
	 */
	getScalar:function()
	{
		return this.next() ? this.getByFieldPos(0) : null;
	}
};

/*
 	Script: JStORM.ASP.js
 	        Support for ASP/ADO/Sql Server/Access
 	License:
 	        MIT-style license.
*/

/*
  Namespace: JStORM.ASP
  	the main namespace for ASP support
 */
JStORM.ASP = {};

/*
 Class: JStORM.ASP.Connection
 	represent an ASP ADO connection
 */
JStORM.ASP.Connection = function () {};
JStORM.ASP.Connection.prototype =
{
	/*
	 Function: begin
	 begin a transaction
	 */
	begin: function()
	{
		this.conn.execute(JStORM[this.dialect].Sql.beginTransactionSql);
	},
	/*
	 Function: commit
	 commit a transaction
	 */
	commit: function()
	{
		this.conn.execute("COMMIT");
	},
	/*
	 Function: rollback
	 rollback a transaction
	 */
	rollback: function()
	{
		this.conn.execute("ROLLBACK");
	},
	/*
	 Function: execute
	 	execute a sql statment
	 Parameters:
	 	sql - sql statment
	 	params - bind parameters
	 Returns:
	 	a JStORM.ASP.ResultSet for the query
	 */
	execute:function (sql, params)
	{
		sql = this._applyParams(sql,params);
		JStORM.log(sql);
		return new JStORM.ASP.ResultSet(this.conn.execute(sql));
	},
	/*
	 Function: executeScalar
	 	execute a sql statment and return the scalar value returned by query(i.e. the first column 
	 	of the first row)
	 Parameters:
	 	sql - sql statment
	 	params - bind parameters
	 Returns:
	 	the scalar value(first column of first row)
	 */
	executeScalar:function (sql,params)
	{
		var sql = this._applyParams(sql, params);
		JStORM.log(sql);
		return new JStORM.ASP.ResultSet(this.conn.execute(sql)).getScalar();
	},
	/*
	 Function: getLastInsertId
	 	return the id of the last inserted row
	 Returns:
	 	the id of the last inserted row
	 */
	getLastInsertId:function()
	{
		return this.conn.execute(
			JStORM[this.dialect].Sql.getLastInsertIdSql
		).fields(0).value || 0;
	},
	open:function(params)
	{
		params = params || {};
		this.dialect = params.DIALECT;
		this.conn = new ActiveXObject("ADODB.Connection");
		
		switch (params.DIALECT)
		{
		  case "Access" :
		  	var fso = new ActiveXObject("Scripting.FileSystemObject");
			if(!fso.fileExists(params.PATH))
			{
				var catalog = new ActiveXObject("ADOX.Catalog");
		  		catalog.create("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" +  params.PATH);
			}
			this.conn.provider = "Microsoft.Jet.OLEDB.4.0"
			this.conn.open(params.PATH);
			break;
		  case "SQLServer" :
			var connString = "Provider=SQLOLEDB" + 
			  ";Server=" + params.HOST + 
			  ";Database=" + params.NAME + 
			  ";User Id=" + params.USER + 
			  ";Password=" + params.PASS;
			this.conn.open(connString);
			break;
		  default : 
		    throw new Error("Unsupported dialect");
		    break;
		}
	},
	close:function()
	{
		this.conn.close();
	},
	/*
	 Function: _applyParams
	 	SQL Server parameter replacement is very painful, so define a
	 	private function that does it here.
	 Private:
	 Returns:
	 	A sql query with replaced parameters
	 */
	_applyParams: function(sql, params){
		params = params || [];
		var newSql = [];
		var parts = [];
		
		// Replace all ' with '' in strings just to be safe, and quote, too
		for (var i = 0; i < params.length; i += 1)
		{
			if (typeof params[i] === "string")
				params[i] = "'" + params[i].replace(/\'/g, "''") + "'";
			else if (params[i] === null)// Send a string for nulls
				params[i] = "NULL";
		}
		
		parts = sql.split("?"); // Split the query into parts
		// If there are not enough parameters, throw an error, if there are too many,
		// ignore the extras
		if ((params.length + 1) < parts.length)
			throw new Error("SQL parameter mismatch");
		
		for (var i = 0; i < parts.length; i += 1) 
			newSql.push(parts[i], params[i]);
		
		return newSql.join("");
	}
};

// Gears is OK if you close the connection on the query object, not so with ADO.
JStORM.ASP.Connection.prototype.executeNonQuery = JStORM.ASP.Connection.prototype.execute;


/*
 Class: JStORM.ASP.ResultSet
 	represent an ASP result set (not the same as an ADO Recordset, and more 
  	similar to a Google Gears ResultSet
 Constructor:
 Parameters:
 	resulSet - the ASP result set
 */
JStORM.ASP.ResultSet = function(resultSet)
{
	this.result = resultSet;
	this.first = true;
};
JStORM.ASP.ResultSet.prototype =
{
	/*
	 Function: next
	 	advance to the next row and return true if there is one to read
	 Returns:
	 	true if there is a row to read
	 */
	next:function()
	{
		if (this.first)
			this.first = false;
		else
			this.result.moveNext();
		
		return this.isValidRow();
	},
	/*
	 Function: close
	 	close the result set
	 */
	close:function()
	{
		if(this.result.close)
			this.result.close();
	},
	/*
	 Function: getByFieldName
	 	return the field value by its name
	 Parameters:
	 	fieldName - the name of the field
	 Returns:
	 	the field value
	 */
	getByFieldName:function(fieldName)
	{
		return this.result.fields(fieldName).value || false;
	},
	/*
	 Function: getByFieldPos
	 	return the field value by its position
	 Parameters:
	 	fieldPos - the position of the field
	 Returns:
	 	the field value
	 */
	getByFieldPos:function(fieldPos)
	{
		return this.result.fields(fieldPos).value;
	},
	/*
	 Function: getScalar
	 	return the scalar value of the result set	 
	 Returns:
	 	the first column of the first row
	 */
	getScalar:function()
	{
		var ret = this.isValidRow() ? this.result.fields(0).value : null;
		this.close();
		return ret;
	},
	/*
	 Function : isValidRow
	  is the row valid?
	*/
	isValidRow:function()
	{
	  return !(this.result.eof || this.result.bof);
	}	
};

/*
 	Script: JStORM.Gears.js
 	        Support for Google Gears
 	
 	License:
 	        MIT-style license.
*/

/*
  Namespace: JStORM.Gears
  	the main namespace for Gears support
 */
JStORM.Gears = {};
/*
 Class: JStORM.Gears.Connection
 	represent a Google Gears connection
 */
JStORM.Gears.Connection = function(){};
JStORM.Gears.Connection.prototype = 
{
	/*
	 Function: begin
	 	begin a transaction
	 */
	begin:function()
	{
		this.conn.execute("BEGIN");
	},
	/*
	 Function: commit
	 	commit a transaction
	 */
	commit:function()
	{
		this.conn.execute("COMMIT");
	},
	/*
	 Function: rollback
	 	rollback a transaction
	 */
	rollback:function()
	{
		this.conn.execute("ROLLBACK");
	},
	/*
	 Function: execute
	 	execute a sql statment
	 Parameters:
	 	sql - sql statment
	 	params - bind parameters
	 Returns:
	 	a JStORM.Gears.ResultSet for the query
	 */
	execute:function(sql,params)
	{
		JStORM.log(arguments);
		if(params)//needed for jaxer
			return new JStORM.Gears.ResultSet(this.conn.execute(sql,params));
		else
			return new JStORM.Gears.ResultSet(this.conn.execute(sql));
	},
	/*
	 Function: executeNonQuery
	 	execute a sql statment without returning
	 Parameters:
	 	sql - sql statment
	 	params - bind parameters
	 */
	executeNonQuery:function(sql,params)
	{
		JStORM.log(arguments);
		if(params)//needed for jaxer
			new JStORM.Gears.ResultSet(this.conn.execute(sql,params)).close();
		else
			new JStORM.Gears.ResultSet(this.conn.execute(sql)).close();	
	},
	/*
	 Function: executeScalar
	 	execute a sql statment and return the scalar value returned by query (i.e., the first column 
	 	of the first row)
	 Parameters:
	 	sql - sql statment
	 	params - bind parameters
	 Returns:
	 	the scalar value (first column of first row)
	 */
	executeScalar:function(sql,params)
	{
		JStORM.log(arguments);
		return new JStORM.Gears.ResultSet(this.conn.execute(sql,params)).getScalar();
	},
	/*
	 Function: getLastInsertId
	 	return the id of the last inserted row
	 Returns:
	 	the id of the last inserted row
	 */
	getLastInsertId:function()
	{
		return this.conn.lastInsertRowId;
	},
	/*
	 Function: open
	 	open the connection
	 Parameters:
	 	connParam - the connection options: an object with a property HOST which is the database name
	 */
	open:function(connParam)
	{
		this.conn = google.gears.factory.create('beta.database');
		this.conn.open(connParam.HOST);
	},
	/*
	 Function: close
	 	close the connections
	 */
	close:function()
	{
		this.conn.close();
	}
};

/*
 Class: JStORM.Gears.ResultSet
 	represent a Google Gears result set
 Constructor:
 Parameters:
 	resulSet - the Google Gears result set
 */
JStORM.Gears.ResultSet = function(resultSet)
{
	this.result = resultSet;
	this.first = true;
};
JStORM.Gears.ResultSet.prototype =
{
	/*
	 Function: next
	 	advance to the next row and return true if there is one to read
	 Returns:
	 	true if there is a row to read
	 */
	next:function()
	{
		if(this.first)
			this.first = false;
		else
			this.result.next();
			
		return this.result.isValidRow();
	},
	/*
	 Function: close
	 	close the result set
	 */
	close:function()
	{
		if(this.result.close)
			this.result.close();
	},
	/*
	 Function: getByFieldName
	 	return the field value by its name
	 Parameters:
	 	fieldName - the name of the field
	 Returns:
	 	the field value
	 */
	getByFieldName:function(fieldName)
	{
		return this.result.fieldByName(fieldName);
	},
	/*
	 Function: getByFieldPos
	 	return the field value by its position
	 Parameters:
	 	fieldPos - the position of the field
	 Returns:
	 	the field value
	 */
	getByFieldPos:function(fieldPos)
	{
		return this.result.field(fieldPos);
	},
	/*
	 Function: getScalar
	 	return the scalar value of the result set	 
	 Returns:
	 	the first column of the first row
	 */
	getScalar:function()
	{
		var ret = this.result.isValidRow() ? this.result.field(0) : null;
		this.close();
		return ret;
	}
};

/*
 	Script: JStORM.Jaxer.js
          Support for Aptana Jaxer (supports an API almost identical to Google Gears)
 	
 	License:
 	        MIT-style license.
*/

/*
  Namespace: JStORM.Jaxer
  	the main namespace for Jaxer support
 */
JStORM.Jaxer = {};
/*
  Class: JStORM.Jaxer.Connection
  	represents a Jaxer connection. Override open and getLastInsertId since they are different than in
  	Google Gears
  Extends: JStORM.Gears.Connection
 */
JStORM.Jaxer.Connection = function(){};
JStORM.Jaxer.Connection.prototype = new JStORM.Gears.Connection;

JStORM.Jaxer.Connection.prototype.open = function(connParameters)
{
	if(connParameters.DIALECT == "MySQL")
		this.conn = new Jaxer.DB.MySQL.Connection(connParameters);
	else if(connParameters.DIALECT == "SQLite")
		this.conn = new Jaxer.DB.SQLite.Connection(connParameters);
	else
		throw new Error("not supported dialect")
	this.conn.open();
};

JStORM.Jaxer.Connection.prototype.getLastInsertId = function()
{
	return this.conn.lastInsertId;
};

JStORM.JDBC = {
	/**
	* Contributed by Christopher Thatcher
	*
		Example  Connection Parameters
		{
			DRIVER 	: "org.sqlite.JDBC",
			PROVIDER:"JDBC",
			DIALECT:"SQLite",
			HOST:"jdbc:sqlite:test.db",
			NAME:"test_jdbc",
			USER:"sa",
			PASS:""
		}
	*/
};
JStORM.JDBC.Connection = function(){};

JStORM.JDBC.Connection.prototype = 
{
	execute:function(sql,params)
	{
		JStORM.log(arguments);
		var i,
		ps = this.conn.prepareStatement(sql);
		if(params&&params.length){
			for(i=0;i<params.length;i++){
				//annoying 1-based index
				ps.setObject(i+1, params[i]);
			}
		}
		return new JStORM.JDBC.ResultSet( 
			ps.executeQuery()
		);
	},
	executeNonQuery:function(sql,params)
	{
		JStORM.log(arguments);
		var i,
		ps = this.conn.prepareStatement(sql);
		if(params&&params.length){
			for(i=0;i<params.length;i++){
				//annoying 1-based index
				ps.setObject(i+1, params[i]);
			}
		} ps.executeUpdate();
	},
	executeScalar:function(sql,params)
	{
		return this.execute(sql,params).getScalar();
	},
	getLastInsertId:function() {
		return this.conn.lastInsertId||null;
	},
	open:function(connParam)
	{
		java.lang.Class.forName(connParam.DRIVER).newInstance();
		var properties = new java.util.Properties();
		properties.setProperty("user", connParam.USER);
		properties.setProperty("password", connParam.PASS);
		properties.setProperty("retainStatementAfterResultSetClose", "true");
		this.conn = java.sql.DriverManager.getConnection (
			connParam.HOST,
			properties
		);
		switch(connParam.DIALECT)
		{
			case "MySQL":
				this.getLastInsertId = function(){
					return this.executeScalar("SELECT LAST_INSERT_ID();");
				};
				break;
			case "SQLite":
				this.getLastInsertId = function(){
					return this.executeScalar("SELECT LAST_INSERT_ROWID();");
				};
				break;
			default:
				throw new Error("not supported dialect");
				break;
		}
	},
	close:function()
	{
		this.conn.close();
	},
	rollback: function()
	{
		this.conn.rollback();	
	},
	commit: function()
	{
		this.conn.commit();
	},
	begin: function()
	{
		this.conn.setAutoCommit( false );
	}
};

JStORM.JDBC.ResultSet = function(resultSet)
{
	this.result = resultSet;
	this.first = resultSet.next();
	
};

JStORM.JDBC.ResultSet.prototype =
{
	next:function()
	{
		if(this.first){
			this.first = false;
			return true;
		}
		return this.result.next();
	},
	close:function()
	{
		try{
			this.result.close();
		}catch(e){}finally{
			try{this.result.getStatement().close();}catch(e){JStORM.log(e);}
		}
	},
	getByFieldName:function(fieldName)
	{
		JStORM.log(fieldName);
		return this.result.getString(fieldName);
	},
	getByFieldPos:function(fieldPos)
	{
		//darn 1-based indexes
		return this.result.getObject(fieldPos + 1);
	},
	getScalar: function()
	{	
		var ret = this.result.getObject(1);
		this.close();
		return ret;
	}
};


JStORM.ReSTfulModel = function(options){
    var M = new JStORM.Model(options);
    
    var rest = JStORM.restservices[M._meta.connName];
    M = JStORM.extend(M, new JStORM[rest.SERVICE]());
    M.ajax = JStORM[rest.AJAX];
    M.url = rest.URL;
    M.namespace = options.namespace?options.namespace:null;
    
    var collection = M._meta.tableName.split(".").pop();
    collection = collection.substring(0,1).toLowerCase() + collection.substring(1);
    M.collection = options.collection?options.collection:collection;
    
    var plural = M.collection+"s";
    M.plural = options.plural?options.plural:plural;
    
    return M;
};
    
JStORM.restservices = {};

JStORM.Any = function(){
/*
* Contributed by Christopher Thatcher
*/
};
    
JStORM.Any.prototype.createCollection = function(cb){
    var _this = this;
    JStORM.ajax({
        url         : this.url + this.collection + "/create",
        type        : "PUT",
        dataType    : "text",
        success: function(){
            JStORM.log("Successfully created new collection for "+ _this._meta.tableName);
            if(cb){cb("success");}
        },
        error: function(xhr, status, e){
            JStORM.log("Failed to create new collection for "+ _this._meta.tableName);
            JStORM.log(e);
            if(cb){cb(null);}
        }
    });
};

JStORM.Any.prototype.removeCollection = function(){
    var _this = this;
   JStORM.ajax({
        url         : this.url + this.collection + "/remove",
        type        : "DELETE",
        dataType    : "text",
        success: function(){
            JStORM.log("Successfully delete collection for "+ _this._meta.tableName);
            if(cb){cb("success");}
        },
        error: function(xhr, status, e){
            JStORM.log("Failed to delete collection for "+ _this._meta.tableName);
            JStORM.log(e);
            if(cb){cb(null);}
        }
    });
};

JStORM.Any.prototype.search = function(filter, cb){
    var _this = this;
    JStORM.ajax({
        url         : this.url + this.collection+"/search",
        type        : "GET",
        contentType : "text",
        data        : filter,
        success: function(instances){
            JStORM.log("Successfully searched for " + _this._meta.tableName );
            if(cb){cb(instances);}
        },
        error: function(xhr, status, e){
            JStORM.log("Error: failed to search for " + 
                _this._meta.tableName + " Check network connectivity");
            JStORM.log(e);
            if(cb){cb(null);}
        }
    });
};

JStORM.Any.prototype.suggest = function(field, value, cb){
    //TODO
};


JStORM.Any.prototype.serialize = function(instance, type, deep){
    var root, obj = {}, _this = this, pkSet = false;
    if(typeof type == "boolean"){
        //allow signature (instance,deep) for simplicity as well
        deep = type;
        type = "json";
    }
    JStORM.log("serializing instance "+instance);
    JStORM.each(this._meta.fields,function(field){
        JStORM.log("serializing field "+field.fieldName);
        if (field.fieldName == _this._meta.pk.fieldName){
            pkSet = true;
        }
		obj[field.fieldName] = instance[field.fieldName];
	});
	if(!pkSet){
        JStORM.log("serializing pk "+this._meta.pk.fieldName);
	    obj[this._meta.pk.fieldName] = instance[this._meta.pk.fieldName];
	}
	JStORM.each(this._meta.relations,function(relation){ 
        JStORM.log("serializing relation "+relation.fieldName);  
	    var i, value = instance[relation.fieldName];
		if(relation.relationType == "OneToMany") {
            if(typeof(value) == "number" || (!value && relation.allowNull))
                obj[relation.fieldName] = value;
            else if(value.serialize && deep)
                obj[relation.fieldName] = relation.relatedModel().serialize(value, type, deep);
		}else if(relation.relationType == "ManyToOne" && deep){
            i = 0;
            obj[relation.fieldName] = [];
            value.each(function(item){
                JStORM.log("serializing many to one relation "+i); 
                obj[relation.fieldName][i] = relation.relatedModel().serialize(item, type, deep);
                i++;
            });
		}
	});
    if(type == "xml"){
        //object tree wants the serialized object to have a a singular 
        //'root' property.  we use the table name.
        root  = {};
        root[this._meta.tableName] =  obj ;
        if(this.namespace){
            root[this._meta.tableName].$xmlns = this.namespace;
        }
        return root;
    }else{
        return obj;
    }
};

JStORM.Any.prototype.deserialize = function(obj, type){
    var newObj, root;
    if(type === "dom"){
        //It's already a DOM dont parse the xml text twice
        newObj = JStORM.dom2js(obj)["#document"];
        //A fast way to get the only child property of the #document property
        for(root in newObj){ break; }
        return new this(newObj[root]);
    }else if(type === "xml"){
        //assume its json text
        JStORM.log("deserializing xml string \n"+obj);
        newObj = JStORM.xml2js(obj);
        JStORM.log("deserialized xml string to "+newObj);
        return newObj;
    }else{
        //assume its json text
        JStORM.log("deserializing json string \n"+obj);
        newObj = JStORM.json2js(obj);
        JStORM.log("deserialized json string to "+newObj);
        return newObj;
    }
};

/*JStORM.Any.prototype.put = function(model, cb){
    //PUT is the equivalent SAVE,
    var _this = this;
    this.ajax({
        url         : this.url + this.collection + "/new.xml",
        type        : "PUT",
        contentType : "xml",
        processData : false,
        data        : this.serialize(model),
        success: function(xml){
            JStORM.log("Successfully created new record for "+ _this._meta.tableName);
            var id = xml && $(xml) ? $(xml).text() : null;
            model.setPkValue( id );
            if(cb){cb(model);}
        },
        error: function(xhr, status, e){
            JStORM.log("Failed to create new record for "+ _this._meta.tableName);
            JStORM.log(e);
            if(cb){cb(null, model);}
        }
    });
};*/

JStORM.Any.prototype.get = function(id, cb){
    //PUT is the equivalent of FIND.
    var _this = this;
     JStORM.ajax({
        url         : this.url + this.collection + "/"+id+".json",
        type        : "GET",
        dataType    : "text",
        success: function(json){
            JStORM.log("Successfully retreived record for " + _this._meta.tableName);
            var obj = _this.deserialize(json, 'json');
            if(cb){cb(obj);}
        },
        error: function(xhr, status, e){
            JStORM.log("Error! Failed to retreive record for "+ _this._meta.tableName +" : "+ id);
            JStORM.log(e);
            if(cb){cb(null, model);}
        }
    });
};

JStORM.Any.prototype.post = function(instance, cb){
    //POST is the equivalent of SAVE OR UPDATE.
    var _this = this,
        id = instance.getPkValue()===undefined?"new":instance.getPkValue();
    JStORM.ajax({
        url         : this.url + this.collection+"/"+id+".json",
        type        : "POST",
        contentType : "text",
        processData : false,
        data        : this.serialize(instance),
        success: function(idtxt){
            JStORM.log("Successfully save or updated record " +id+
                " for " + _this._meta.tableName );
            if(cb){cb(idtxt, instance);}
        },
        error: function(xhr, status, e){
            JStORM.log("Error: failed to save or update record for " + 
                _this._meta.tableName + " Check network connectivity");
            JStORM.log(e);
            if(cb){cb(null, instance);}
        }
    });
};

JStORM.Any.prototype.del = function(instance, cb){
    //DELETE is the equivalent of REMOVE.
    var id = instance.getPkValue( );
    if(instance.getPkValue()){
        JStORM.ajax({
            url         : this.url + this.collection + "/"+ id + ".json",
            type        : "DELETE",
            contentType : "text",
            success: function(json){
                JStORM.log("Successfully deleted record for  " + id);
                if(cb){cb(id, instance);}
            },
            error: function(xhr, status, e){
                JStORM.log("Error deleting new record for "+id+". Check network connectivity");
                JStORM.log(e);
                if(cb){cb(null, instance);}
            }
        });
    }
};


JStORM.eXist = function(){
/*
* Contributed by Christopher Thatcher
*/
};
    
JStORM.eXist.prototype.createCollection = function(cb){
    var _this = this;
    this.ajax({
        url         : this.url + this.collection + "/new.xql",
        type        : "PUT",
        contentType : "application/xquery",
        processData : false,
        dataType    : "text",
        data        : ' \
            xquery version "1.0"; \
            declare namespace exist = "http://exist.sourceforge.net/NS/exist"; \
            declare namespace request="http://exist-db.org/xquery/request";\
            declare namespace xmldb="http://exist-db.org/xquery/xmldb";\
            declare option exist:serialize "method=xml media-type=text/xml indent=yes";\
            let $new-record := request:get-data()\
            let $collection := "/'+this.collection+'"\
            let $id := count(xmldb:get-child-resources($collection))+1\
            let $file-name := concat($id, ".xml")\
            let $store-return-status := xmldb:store($collection, $file-name, $new-record)\
            return \
            if (count($store-return-status) > 0)\
               then ( <id> {$id} </id> )\
               else ( <id> null  </id> ) ',
        success: function(){
            JStORM.log("Successfully created new collection for "+ _this._meta.tableName);
            if(cb){cb("success");}
        },
        error: function(xhr, status, e){
            JStORM.log("Failed to create new collection for "+ _this._meta.tableName);
            JStORM.log(e);
            if(cb){cb(null);}
        }
    });
};

JStORM.eXist.prototype.removeCollection = function(){
    var _this = this;
   this.ajax({
        url         : this.url + this.collection,
        type        : "DELETE",
        dataType    : "text",
        success: function(){
            JStORM.log("Successfully delete collection for "+ _this._meta.tableName);
            if(cb){cb("success");}
        },
        error: function(xhr, status, e){
            JStORM.log("Failed to delete collection for "+ _this._meta.tableName);
            JStORM.log(e);
            if(cb){cb(null);}
        }
    });
};

JStORM.eXist.prototype.search = function(filter, cb){
    //TODO
};

JStORM.eXist.prototype.suggest = function(field, value, cb){
    //TODO
};


JStORM.eXist.prototype.serialize = function(obj, type){
    var root = {};
    root["root"] = jQuery.stripjs( obj );
    if(this.namespace){
        root["root"].$xmlns = this.namespace;
    }
    return jQuery.js2xml(root);
};

JStORM.eXist.prototype.deserialize = function(obj, type){
    var newObj, root;
    if(type === "dom"){
        //It's already a DOM dont parse the xml text twice
        newObj = jQuery.dom2js(obj)["#document"];
    }else{
        //assume its xml text
        newObj = jQuery.xml2js(obj)["#document"];
    }
    //A fast way to get the only child property of the #document property
    for(root in newObj){ break; }
    return new this(newObj[root]);
};

JStORM.eXist.prototype.post = function(model, cb){
    //PUT is the equivalent SAVE,
    var _this = this;
    this.ajax({
        url         : this.url + this.collection + "/new.xql",
        type        : "POST",
        contentType : "xml",
        processData : false,
        data        : this.serialize(model),
        success: function(xml){
            JStORM.log("Successfully created new record for "+ _this._meta.tableName);
            var id = xml && $(xml) ? $(xml).text() : null;
            model.setPkValue( id );
            if(cb){cb(model);}
        },
        error: function(xhr, status, e){
            JStORM.log("Failed to create new record for "+ _this._meta.tableName);
            JStORM.log(e);
            if(cb){cb(null, model);}
        }
    });
};

JStORM.eXist.prototype.get = function(id, cb){
    //PUT is the equivalent of FIND.
    var _this = this;
     this.ajax({
        url         : this.url + this.collection + "/"+id+".xml",
        type        : "GET",
        dataType    : "xml",
        data        : {
            _wrap : "no"
        },
        success: function(xml){
            JStORM.log("Successfully retreived record for " + _this._meta.tableName);
            var user = _this.deserialize(xml, 'dom');
            if(cb){cb(user);}
        },
        error: function(xhr, status, e){
            JStORM.log("Error! Failed to retreive record for "+ _this._meta.tableName +" : "+ id);
            JStORM.log(e);
            if(cb){cb(null, model);}
        }
    });
};

JStORM.eXist.prototype.put = function(model, cb){
    //PUT is the equivalent of UPDATE.
    var _this = this;
    this.ajax({
        url         : this.url + this.collection+"/"+model.getPkValue()+".xml",
        type        : "PUT",
        contentType : "text",
        processData : false,
        data        : this.serialize(root),
        success: function(xml){
            JStORM.log("Successfully updated record " +model.getPkValue()+
                " for " + _this._meta.tableName );
            if(cb){cb(model.getPkValue());}
        },
        error: function(xhr, status, e){
            JStORM.log("Error: failed to update record for " + 
                _this._meta.tableName + " Check network connectivity");
            JStORM.log(e);
            if(cb){cb(null, model);}
        }
    });
};

JStORM.eXist.prototype.del = function(model, cb){
    //DELETE is the equivalent of REMOVE.
    if(model.getPkValue()){
        this.ajax({
            url         : this.url + this.collection + "/"+ model.getPkValue( )+".xml",
            type        : "DELETE",
            contentType : "text",
            success: function(xml){
                JStORM.log("Successfully deleted record for user " + model.getPkValue());
                if(cb){cb(model.getPkValue());}
            },
            error: function(xhr, status, e){
                JStORM.log("Error deleting new record for user. Check network connectivity");
                JStORM.log(e);
                if(cb){cb(null, model);}
            }
        });
    }
};

//As we rough out the edges we abstract the ajax provider
//This is obviously jquery centric but since I'm providing the 
//'interface' it's a pretty simple solution.
JStORM.ajax     = jQuery.ajax;
JStORM.js2json  = jQuery.js2json;
JStORM.js2xml   = jQuery.js2xml;
JStORM.dom2js   = jQuery.dom2js;
JStORM.xml2js   = jQuery.xml2js;
JStORM.json2js  = jQuery.json2js;
/*
*	outro.js
*/
//Ugly patch because jstorm needs the dialect to 
//describe the model but we dont set it until the boot script.
//this is an obvious conflict but this should be ok for now;
JStORM.connections["default"] = { 
    DIALECT : "SQLite"
};
    
    $.jstorm = {
        connection: function(name){
            return JStORM.connections[name];
        },
        restservice: function(name){
            return JStORM.restservices[name];
        },
        connections: function(name, options){
            JStORM.connections[name] = options;
        },
        restservices: function(name, options){
            JStORM.restservices[name] = options;
        }
    };

    $.Model = JStORM.ReSTfulModel;
    
    $.Field = JStORM.Field;
    
    
})(jQuery); 
