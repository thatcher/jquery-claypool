Claypool.Logging={
/*
 * Claypool @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 */
};
(function($, $Log){
	//erase safety provided by core
	$Log.NullLogger$Class = $Log.getLogger =null;
	$.extend($Log, {
	    //Static Closure Method (uses a singleton pattern)
	    loggerFactory:null,
	    getLogger: function(category){
	        if(!$Log.loggerFactory){
	            $Log.loggerFactory = new $Log.Factory();
	            $Log.loggerFactory.updateConfig();
	        }
	        return $Log.loggerFactory.create(category);
	    },
	    Level$Enumeration:{
	        DEBUG:0,
	        INFO:1,
	        WARN:2,
	        ERROR:3,
	        NONE:4
	    },
	    Factory$Class:{
	        configurationId:'logging',
	        constructor: function(options){
	            $.extend( this, new $.BaseFactory(options));
	            $.extend(this, $Log.Factory$Class);
	            $.extend(true, this, options);
	            //The LogFactory is unique in that it will create its own logger
	            //so that it's events can be logged to console or screen in a
	            //standard way.
	            this.logger = new $Log.Logger({
	                category:"Claypool.Logging.Factory",
	                level:"INFO",
	                appender:"Claypool.Logging.ConsoleAppender"
	            });this.attemptedConfigure = false;
	            return this;
	        },
	        create: function(category){
	            var categoryParts;
	            var subcategory;
	            var loggerConf;
	            var rootLoggerConf;
	            if(!this.configuration){
	                //Only warn about lack of configuration once
	                if(!this.attemptedConfigure){
	                    this.logger.warn("Claypool Logging was not initalized correctly.  Logging will not occur unless initialized.");
	                }
	                this.attemptedConfigure = true;
	                return new $Log.NullLogger();
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
	                        return new $Log.Logger( loggerConf );
	                    }
	                }
	                //try the special 'root' category
	                rootLoggerConf = this.find('root');
	                if(rootLoggerConf !== null){
	                    //The level is set by the closest subcategory, but we still want the 
	                    //full category to display when we log the messages
	                    rootLoggerConf.category = category;
	                    return new $Log.Logger(rootLoggerConf);
	                }
	            }
	            //No matching category found
	            this.logger.warn("No Matching category: %s Please configure a root logger.", category);
	            return new $Log.NullLogger();
	        },
	        updateConfig: function(){
	            var loggingConfiguration;
	            var logconf;
	            var i;
	            try{
	                this.logger.info("Configuring Claypool Logging");
	                this.clear();
	                loggingConfiguration = this.getConfig()||[];
	                for(i=0;i<loggingConfiguration.length;i++){
	                    try{
	                        logconf = loggingConfiguration[i];
	                        this.add( logconf.category, logconf );
	                    }catch(ee){
	                        this.logger.exception(ee);
	                        return false;
	                    }
	                }
	            }catch(e){
	                this.logger.exception(e);
	                throw new $Log.ConfigurationError(e);
	            }
	            return true;
	        }
	    },
	    Logger$Interface:{
	        debug:      function(){throw new $.MethodNotImplementedError();},
	        info:       function(){throw new $.MethodNotImplementedError();},
	        warn:       function(){throw new $.MethodNotImplementedError();},
	        error:      function(){throw new $.MethodNotImplementedError();},
	        exception:  function(){throw new $.MethodNotImplementedError();}
	    },
	    NullLogger$Class:{
	        constructor: function(){
	            //for speed why bother implement the interface, just null the functions
	            var nullFunction=function(){return this;};
	            $.extend(this,  {
	                debug:nullFunction,
	                info:nullFunction,
	                warn:nullFunction,
	                error:nullFunction,
	                exception:nullFunction
	            });
	            return this;
	        }
	    },
	    Logger$Class:{
	        category:"root",
	        level:null,
	        constructor: function(options){
	            try{
	                $.extend(this, $Log.Logger$Interface);
	                $.extend(this, $Log.Logger$Class);
	                $.extend(true, this, options);
	                this.level = $Log.Level[
	                    this.level?this.level:"NONE"
	                ];
	                //allow for appender extension, eg multiple appenders and custom appenders
	                //appenders are expected to be specified as string representations of the
	                //function name, eg 'Claypool.Logging.ConsoleAppender'
	                try{
	                    this.appender = new ($.resolveName(this.appender||"Claypool.Logging.ConsoleAppender"))(options);
	                }catch(e){
	                    try{ this.appender = new $Log.ConsoleAppender(options);
	                    }catch(e){ this.appender = new $Log.SysOutAppender(options); }
	                }
	                return this;
	            }catch(e){
	                return new $Log.NullLogger();
	            }
	        },
	        //All logging calls are chainable
	        debug: function(){
	            if(this.level<=$Log.Level.DEBUG){
	              this.appender.append("DEBUG",this.category,arguments);  
	              return this;
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        },
	        info: function(){
	            if(this.level<=$Log.Level.INFO){
	              this.appender.append("INFO",this.category,arguments);  
	              return this;
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        },
	        warn: function(){
	            if(this.level<=$Log.Level.WARN){
	              this.appender.append("WARN",this.category,arguments);  
	              return this;
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        },
	        error: function(){
	            if(this.level<=$Log.Level.ERROR){
	              this.appender.append("ERROR",this.category,arguments);  
	              return this;
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        },
	        exception: function(e){
	            if(this.level < $Log.Level.NONE){
	                if(e){
	                    this.appender.append("EXCEPTION", this.category,e); 
	              		return this;
              		}
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        }
	    },
	    Appender$Interface:{
	        formatter:null,
	        append: function(level,category,message){throw new $.MethodNotImplementedError();}
	    },
	    ConsoleAppender$Class:{
	        constructor: function(options){
	            try{
	                if(window&&window.console&&window.console.log){
	                    $.extend(this, $Log.Appender$Interface);
	                    $.extend(this, $Log.ConsoleAppender$Class);
	                    $.extend(true, this, options);
	                    this.formatter = new $Log.FireBugFormatter(options);
	                    return this;
	                }
	            }catch(e){
	                /**Since the console isn't available, see if print() is and fall back to it**/
	            }
	            $.extend(this, $Log.SysOutAppender(options));
	            return this;
	        },
	        append: function(level, category, message){
	            switch(level){
	                case ("DEBUG"):
	                    console.log.apply(console, this.formatter.format(level, category, message));break;
	                case ("INFO"):
	                    console.info.apply(console, this.formatter.format(level, category, message));break;
	                case ("WARN"):
	                    console.warn.apply(console, this.formatter.format(level, category, message));break;
	                case ("ERROR"):
	                    console.error.apply(console,this.formatter.format(level, category, message));break;
	                case ("EXCEPTION"):
	                    //message is e
	                    console.error.apply(console, this.formatter.format(level, category, 
	                        message.message?[message.message]:[])); 
	                    console.trace();
	                    break;
	            }
	        }
	    },
	    SysOutAppender$Class:{
	        constructor: function(options){
	            $.extend(this, $Log.Appender$Interface);
	            /**This function is intentionally written to throw an error when called*/
	            var rhinoCheck = function(){ var isRhino = null;isRhino.toString();};
	            /**This is probably rhino if these are defined*/
	            if(jQuery.isFunction(print) && jQuery.isFunction(load) ){
	                try{
	                    rhinoCheck();
	                }catch(caught){/**definitely rhino if this is true*/
	                    if(caught.rhinoException){
	                        $.extend(this, $Log.SysOutAppender$Class);
	                        $.extend(true, this, options);
	                        this.formatter = new $Log.DefaultFormatter(options);
	                        //print("Successfully Loaded SysOutAppender.");
	                        return this;
	                    }
	                }
	            }
	            throw new $Log.NoAppendersAvailableError();
	        },
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
	    },
	    Formatter$Interface:{
	        format: function(level, category, objects){throw new $.MethodNotImplementedError();}
	    },
	    FireBugFormatter$Class:{
	        constructor: function(options){
	            $.extend(this, $Log.Formatter$Interface);
	            $.extend(this, $Log.FireBugFormatter$Class);
	            $.extend(true, this, options);
	        },
	        getDateString: function(){
	            return " ["+ new Date().toUTCString() +"] ";
	        },
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
	    },
	    DefaultFormatter$Class:{
	        parseFormatRegExp:/((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/,
	        functionRenameRegExp:/function ?(.*?)\(/,
	        objectRenameRegExp:/\[object (.*?)\]/,
	        constructor: function(options){
	            $.extend(this, $Log.Formatter$Interface);
	            $.extend(this, $Log.DefaultFormatter$Class);
	            $.extend(true, this, options);
	        },
	        getDateString: function(){
	            return " ["+ new Date().toUTCString() +"] ";
	        },
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
	        parseFormat: function(format){
	            var parts = [];
	            var appenderMap = {s: this.appendText, d: this.appendInteger, i: this.appendInteger, f: this.appendFloat};
	            var type;
	            var appender;
	            var precision;
	            var m;
	            for (m = this.parseFormatRegExp.exec(format); m; m = this.parseFormatRegExp.exec(format)) {
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
	        objectToString: function (object){
	            try{ return object+"";}
	            catch (e){ return null; }
	        },
	        appendText: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendNull: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendString: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendInteger: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendFloat: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendFunction: function (object, msg){
	            var m = this.functionRenameRegExp.exec(this.objectToString(object));
	            var name = m ? m[1] : "function";
	            msg.push(this.objectToString(name));
	        },
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
	        appendObjectFormatted: function (object, msg){
	            var text = this.objectToString(object);
	            var m = this.objectRenameRegExp.exec(text);
	            msg.push( m ? m[1] : text);
	        },
	        appendSelector: function (object, msg){
	            msg.push(object.nodeName.toLowerCase());
	            if (object.id){ msg.push(object.id);}
	            if (object.className){ msg.push(object.className);}
	            msg.push('</span>');
	        },
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
	    },
	    /**@exception*/
	    ConfigurationError$Class:{
	        constructor: function(e, options){
	            $.extend( this, new $.ConfigurationError(e, options||{
	                name:"Claypool.Logging.ConfigurationError",
	                message: "An error occured trying to configure the logging system."
	            }));
	        }
	    },
	    /**@exception*/
	    NoAppendersAvailableError$Class:{
	        constructor: function(e, options){
	            $.extend( this, new $.Error(e, options||{
	                name:"Claypool.Logging.NoAppendersAvailableError",
	                message: "An error occured trying to configure the logging system."
	            }));
	        }
	    }
	});
	/**@enumerationAlias*/
	$Log.Level            = $Log.Level$Enumeration; 
	/**@constructorAlias*/
	$Log.Factory    	  = $Log.Factory$Class.constructor; 
	/**@constructorAlias*/
	$Log.Logger           = $Log.Logger$Class.constructor; 
	/**@constructorAlias*/
	$Log.NullLogger       = $Log.NullLogger$Class.constructor; 
	/**@constructorAlias*/
	$Log.SysOutAppender   = $Log.SysOutAppender$Class.constructor; 
	/**@constructorAlias*/
	$Log.ConsoleAppender  = $Log.ConsoleAppender$Class.constructor; 
	/**@constructorAlias*/
	$Log.DefaultFormatter  = $Log.DefaultFormatter$Class.constructor; 
	/**@constructorAlias*/
	$Log.FireBugFormatter  = $Log.FireBugFormatter$Class.constructor; 
	
	//Exception Classes
	/**@constructorAlias*/
	$Log.ConfigurationError = $Log.ConfigurationError$Class.constructor; 
	/**@constructorAlias*/
	$Log.NoAppendersAvailableError = $Log.NoAppendersAvailableError$Class.constructor; 
	
})( Claypool,/*Required Modules*/
	Claypool.Logging );

//Give a little bit, Give a little bit of our Log to you. ;)
(function($){ 
	$.Logging = Claypool.Logging; 
})(jQuery);
