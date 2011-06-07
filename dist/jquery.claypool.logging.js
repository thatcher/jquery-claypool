
Claypool.Logging={
/*
 * Claypool @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 */
 
    //erase safety provided by core
    NullLogger  : null,
    getLogger   : null
};

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    
    $.extend($$Log, {
        //Static Closure Method (uses a singleton pattern)
        loggerFactory:null,
        getLogger: function(category){
            if(!$$Log.loggerFactory){
                $$Log.loggerFactory = new $$Log.Factory();
            }
            if($$Log.updated){
                $$Log.loggerFactory.updateConfig();
                $$Log.updated = false;
            }
            return $$Log.loggerFactory.create(category);
        }
    });
    
})(  jQuery, Claypool, Claypool.Logging );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
	$$Log.Level = {
        DEBUG:0,
        INFO:1,
        WARN:2,
        ERROR:3,
        NONE:4
    };
	
})(  jQuery, Claypool, Claypool.Logging );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
    $$Log.Logger$Interface = {
        debug:      function(){
            throw "MethodNotImplementedError";
        },
        info:       function(){
            throw "MethodNotImplementedError";
        },
        warn:       function(){
            throw "MethodNotImplementedError";
        },
        error:      function(){
            throw "MethodNotImplementedError";
        },
        exception:  function(){
            throw "MethodNotImplementedError";
        }
    };
	
})(  jQuery, Claypool, Claypool.Logging );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
    $$Log.NullLogger = function(){
        //for speed why bother implement the interface, just null the functions
        var nullFunction = function(){
            return this;
        };
        $.extend(this,  {
            debug:nullFunction,
            info:nullFunction,
            warn:nullFunction,
            error:nullFunction,
            exception:nullFunction
        });
    };
	
})(  jQuery, Claypool, Claypool.Logging );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    /**
     * @constructor
     */
    $$Log.Logger = function(options){
        this.category   = "root";
        this.level      = null;
        try{
            $.extend(true, this, options);
            this.level = $$Log.Level[
                this.level?this.level:"NONE"
            ];
            //allow for appender extension, eg multiple appenders and custom appenders
            //appenders are expected to be specified as string representations of the
            //function name, eg 'Claypool.Logging.ConsoleAppender'
            try{
                this.appender = new ($.resolve(this.appender||"Claypool.Logging.ConsoleAppender"))(options);
            }catch(e){
                try{ 
                    this.appender = new $$Log.ConsoleAppender(options);
                }catch(e){ 
                    this.appender = new $$Log.SysOutAppender(options); 
                }
            }
            return this;
        }catch(e){
            return new $$Log.NullLogger();
        }
    };
    
    //All logging calls are chainable
    $.extend($$Log.Logger.prototype, 
        $$Log.Logger$Interface,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        debug: function(){
            if(this.level<=$$Log.Level.DEBUG){
              this.appender.append("DEBUG",this.category,arguments);  
              return this;
            }else{ 
                this.debug = function(){
                    return this;
                }; 
            }
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        info: function(){
            if(this.level<=$$Log.Level.INFO){
              this.appender.append("INFO",this.category,arguments);  
              return this;
            }else{ 
                this.debug = function(){
                    return this;
                }; 
            }
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        warn: function(){
            if(this.level<=$$Log.Level.WARN){
              this.appender.append("WARN",this.category,arguments);  
              return this;
            }else{ this.debug = function(){return this;}; }
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        error: function(){
            if(this.level<=$$Log.Level.ERROR){
              this.appender.append("ERROR",this.category,arguments);  
              return this;
            }else{ this.debug = function(){return this;}; }
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        exception: function(e){
            if(this.level < $$Log.Level.NONE){
                if(e){
                    this.appender.append("EXCEPTION", this.category,e); 
              		return this;
          		}
            }else{ 
                this.debug = function(){
                    return this;
                }; 
            }
            return this;
        }
    });

})(  jQuery, Claypool, Claypool.Logging );



/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    /**
     * @constructor
     */
    $$Log.Appender$Interface = {
        formatter:null,
        append: function(level,category,message){
            throw new $$.MethodNotImplementedError();
        }
    };
})(  jQuery, Claypool, Claypool.Logging );
        
        
        
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    /**
     * @constructor
     */
    $$Log.SysOutAppender = function(options){
        /**This function is intentionally written to throw an error when called*/
        var rhinoCheck = function(){ var isRhino = null;isRhino.toString();};
        /**This is probably rhino if these are defined*/
        if($.isFunction(print) && (window.load !== undefined) && $.isFunction(window.load) ){
            try{
                rhinoCheck();
            }catch(caught){/**definitely rhino if this is true*/
                if(caught.rhinoException){
                    $.extend(true, this, options);
                    this.formatter = new $$Log.DefaultFormatter(options);
                    return this;
                }
            }
        }
        throw new $$Log.NoAppendersAvailableError();
    };
        
    $.extend($$Log.SysOutAppender.prototype, 
        $$Log.Appender$Interface, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        append: function(level,category,message){
            //print(level +"\n"+ category +"\n"+ message[0]);
            switch(level){
                case "DEBUG":
                    print(this.formatter.format(level, category, message));break;
                case "INFO":
                    print(this.formatter.format(level, category, message));break;
                case "WARN":
                    print(this.formatter.format(level, category, message));break;
                case "ERROR":
                    print(this.formatter.format(level, category, message));break;
                case ("EXCEPTION"):
                    //message is e
                    var msg = message&&message.rhinoException?"\n\t"      + message.rhinoException.message +
                        "\tcolumn: "  + message.rhinoException.columnNumber() + 
                        "\tline: "  + message.rhinoException.lineNumber()  : "UNKNOWN RUNTIME ERROR";
                    print(this.formatter.format(level, category,  msg ));
                    break;
            }
        }
    });
    
})(  jQuery, Claypool, Claypool.Logging );

        
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    /**
     * @constructor
     */
    $$Log.ConsoleAppender = function(options){
        var test;
        try{
            if(window&&window.console&&window.console.log){
                try{
                    if( 'Envjs' in window ){
                    	return new $$Log.SysOutAppender(options);
					}
                }catch(e){
                    //swallow
                }
                $.extend(true, this, options);
                this.formatter = new $$Log.FireBugFormatter(options);
                return this;
            }else{
                return new $$Log.SysOutAppender(options);
            }
        }catch(e){
            //Since the console and print arent available use a null implementation.
            //Thanks to Brandon Smith for finding this bug!
            throw e;
        }
        return this;
    };
    
	//stupid ie8 added a console object but wont let you call
	//apply on its methods!!! nice one ie8 :{
    //this means logging messages need to have 9 params or less
	function console_apply(fn, args){//a is args
		if(fn.apply){
			fn.apply(console, args);
		}else if(args && args.length){
			switch(args.length){
				case 1: fn(args[0]);break;
				case 2: fn(args[0], args[1]);break;
				case 3: fn(args[0], args[1], args[2]);break;
				case 4: fn(args[0], args[1], args[2], args[3]);break;
				case 5: fn(args[0], args[1], args[2], args[3], args[4]);break;
				case 6: fn(args[0], args[1], args[2], args[3], args[4], args[5]);break;
				case 7: fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);break;
				case 8: fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);break;
				case 9: fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);break;
			}
		}
	}

    $.extend( $$Log.ConsoleAppender.prototype, 
        $$Log.Appender$Interface, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        append: function(level, category, message){
            switch(level){
                case ("DEBUG"):
                    console_apply(console.log, this.formatter.format(level, category, message));
                    break;
                case ("INFO"):
                    console_apply(console.info, this.formatter.format(level, category, message));
                    break;
                case ("WARN"):
                    console_apply(console.warn, this.formatter.format(level, category, message));
                    break;
                case ("ERROR"):
                    console_apply(console.error,this.formatter.format(level, category, message));
                    break;
                case ("EXCEPTION"):
                    //message is e
                    //console_apply(console.error, this.formatter.format(level, category, 
                    //    message.message?[message.message]:[])); 
                    console_apply(console.error, [e]);//[printStackTrace({e:message}).join('\n')]);
                    break;
            }
        }
    });
})(  jQuery, Claypool, Claypool.Logging );



/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
    $$Log.Formatter$Interface = {
        format: function(level, category, objects){
            throw "MethodNotImplementedError";
        }
    };
})(  jQuery, Claypool, Claypool.Logging );
	    

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    /**
     * @constructor
     */
    $$Log.FireBugFormatter = function(options){
        $.extend(true, this, options);
    };
    
    $.extend($$Log.FireBugFormatter.prototype, 
        $$Log.Formatter$Interface, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        getDateString: function(){
            return " ["+ new Date().toUTCString() +"] ";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        format: function(level, category, objects){
            var msgPrefix = category + " "+level+": "+ this.getDateString();
            objects = (objects&&objects.length&&(objects.length>0))?objects:[];
            var msgFormat = (objects.length > 0)?objects[0]:null;
            if (typeof(msgFormat) != "string"){
                objects.unshift(msgPrefix);
            }else{
                objects[0] = msgPrefix + msgFormat;
            }
            return objects;
        }
    });
    
})(  jQuery, Claypool, Claypool.Logging );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    
    var parseFormatRegExp       = /((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/,
        functionRenameRegExp    = /function ?(.*?)\(/,
        objectRenameRegExp      = /\[object (.*?)\]/;
    
    /**
     * @constructor
     */
    $$Log.DefaultFormatter = function(options){
        $.extend(true, this, options);
    };
    
    $.extend($$Log.DefaultFormatter.prototype,
        $$Log.Formatter$Interface,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        getDateString: function(){
            return " ["+ new Date().toUTCString() +"] ";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        format: function (level, category, objects){
            var msgPrefix = " "+level+":  " +this.getDateString() + "{"+category+"} ";
            var msg = [msgPrefix?msgPrefix:""];
            var format = objects[0];
            var objIndex = 0;
            if (typeof(format) != "string"){
                format = "";
                objIndex = -1;
            }
            var parts = this.parseFormat(format);
            var i;
            for (i = 0; i < parts.length; ++i){
                if (parts[i] && typeof(parts[i]) == "object"){
                    parts[i].appender.call(this,objects[++objIndex], msg);
                }else{
                    this.appendText(parts[i], msg);
                }
            }
            for (i = objIndex+1; i < objects.length; ++i){
                this.appendText(" ", msg);
                if (typeof(objects[i]) == "string"){
                    this.appendText(objects[i], msg);
                }else{
                    this.appendObject(objects[i], msg);
                }
            }
            return msg.join("");
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        parseFormat: function(format){
            var parts = [];
            var appenderMap = {s: this.appendText, d: this.appendInteger, i: this.appendInteger, f: this.appendFloat};
            var type;
            var appender;
            var precision;
            var m;
            for (m = parseFormatRegExp.exec(format); m; m = parseFormatRegExp.exec(format)) {
                type = m[8] ? m[8] : m[5];
                appender = type in appenderMap ? appenderMap[type] : this.appendObject;
                precision = m[3] ? parseInt(m[3], 10) : (m[4] == "." ? -1 : 0);
                parts.push(format.substr(0, m[0][0] == "%" ? m.index : m.index+1));
                parts.push({appender: appender, precision: precision});
                format = format.substr(m.index+m[0].length);
            }
            parts.push(format);
            return parts;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        objectToString: function (object){
            try{ return object+"";}
            catch (e){ return null; }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendText: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendNull: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendString: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendInteger: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendFloat: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendFunction: function (object, msg){
            var m = functionRenameRegExp.exec(this.objectToString(object));
            var name = m ? m[1] : "function";
            msg.push(this.objectToString(name));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendObject: function (object, msg){
            try{
                if (object === undefined){
                    this.appendNull("undefined", msg);
                }else if (object === null){
                    this.appendNull("null", msg);
                }else if (typeof object == "string"){
                    this.appendString(object, msg);
                }else if (typeof object == "number"){
                    this.appendInteger(object, msg);
                }else if (typeof object == "function"){
                    this.appendFunction(object, msg);
                }else if (object.nodeType == 1){
                    this.appendSelector(object, msg);
                }else if (typeof object == "object"){
                    this.appendObjectFormatted(object, msg);
                }else{ this.appendText(object, msg); }
            }catch (e){/*Do Nothing*/}
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendObjectFormatted: function (object, msg){
            var text = this.objectToString(object);
            var m = objectRenameRegExp.exec(text);
            msg.push( m ? m[1] : text);
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendSelector: function (object, msg){
            msg.push(object.nodeName.toLowerCase());
            if (object.id){ msg.push(object.id);}
            if (object.className){ msg.push(object.className);}
            msg.push('</span>');
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendNode: function (node, msg){
            var attr;
            var i;
            var child;
            if (node.nodeType == 1){
                msg.push('<', node.nodeName.toLowerCase(), '>');
                for (i = 0; i < node.attributes.length; ++i){
                    attr = node.attributes[i];
                    if (!attr.specified){ continue; }
                    msg.push(attr.nodeName.toLowerCase(),'="',attr.nodeValue,'"');
                }
                if (node.firstChild){
                    for (child = node.firstChild; child; child = child.nextSibling){
                        this.appendNode(child, html);
                    }
                    msg.push('</',  node.nodeName.toLowerCase(), '>');
                } else {
                    msg.push('/>');
                }
            }else if (node.nodeType == 3) {
                msg.push( node.nodeValue );
            }
        }
    });
})(  jQuery, Claypool, Claypool.Logging );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
	$$Log.Factory = function(options){
        $$.extend(this, $$.BaseFactory);
        this.configurationId = 'logging';
        $.extend(true, this, options);
        //The LogFactory is unique in that it will create its own logger
        //so that it's events can be logged to console or screen in a
        //standard way.
        this.logger = new $$Log.Logger({
            category:"Claypool.Logging.Factory",
            level:"INFO",
            appender:"Claypool.Logging.ConsoleAppender"
        });
        this.attemptedConfigure = false;
    };
    
    $.extend($$Log.Factory.prototype,  
        $$.BaseFactory.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        create: function(category){
            var categoryParts,
                subcategory,
                loggerConf,
                rootLoggerConf;
            if(!this.configuration){
                //Only warn about lack of configuration once
                if(!this.attemptedConfigure){
                    this.logger.warn("Claypool Logging was not initalized correctly. Logging will not occur unless initialized.");
                }
                this.attemptedConfigure = true;
                return new $$Log.NullLogger();
            }else{
                //Find the closest configured category
                categoryParts = category.split(".");
                for(i=0;i<categoryParts.length;i++){
                    subcategory = categoryParts.slice(0,categoryParts.length-i).join(".");
                    loggerConf = this.find(subcategory);
                    if(loggerConf !== null){
                        //The level is set by the closest subcategory, but we still want the 
                        //full category to display when we log the messages
                        loggerConf.category = category;
                        //TODO: we need to use the formatter/appender specified in the config
                        return new $$Log.Logger( loggerConf );
                    }
                }
                //try the special 'root' category
                rootLoggerConf = this.find('root');
                this.logger.debug('root logging category is set to %s', rootLoggerConf);
                if(rootLoggerConf !== null){
                    //The level is set by the closest subcategory, but we still want the 
                    //full category to display when we log the messages
                    rootLoggerConf.category = category;
                    return new $$Log.Logger(rootLoggerConf);
                }
            }
            //No matching category found
            this.logger.warn("No Matching category: %s Please configure a root logger.", category);
            return new $$Log.NullLogger();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(){
            var loggingConfiguration;
            var logconf;
            var i;
            this.logger.debug("Configuring Claypool Logging");
            this.clear();
            loggingConfiguration = this.getConfig()||[];
            for(i=0;i<loggingConfiguration.length;i++){
                logconf = loggingConfiguration[i];
                this.add( logconf.category, logconf );
            }
            return true;
        }
    });
	    
})(  jQuery, Claypool, Claypool.Logging );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
	$.extend($, {
	    logger  : function(name){
	        return $$Log.getLogger(name);
	    },
		//careful, names are very similiar!
        logging  : function(){
            if(arguments.length === 0){
                return $.config('logging');
            }else{
                $$Log.updated = true;
                return $.config('logging', arguments[0]);
            }
        }
	});
	
	var $log;
	
	$.extend($, {
	    debug  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.debug.apply($log,arguments);
	        return this;
	    },
	    info  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.info.apply($log,arguments);
	        return this;
	    },
	    warn  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.warn.apply($log,arguments);
	        return this;
	    },
	    error  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.error.apply($log,arguments);
	        return this;
	    },
	    exception  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.exception.apply($log,arguments);
	        return this;
	    }
	});
	
	
})(  jQuery, Claypool, Claypool.Logging );
