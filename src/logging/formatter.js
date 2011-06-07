

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
