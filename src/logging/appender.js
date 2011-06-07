


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

