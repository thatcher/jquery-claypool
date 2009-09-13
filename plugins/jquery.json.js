
/**
 * <: @VERSION@ :>
 * 
 * Copyright (c) 2008-2009 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * jQuery.jsPath JSON  
 * 
 * Basic JSON Utilities for jquery-jspath
 *
 *         depends on jquery-jspath 
 * ( http://github.com/thatcher/jquery-jspath )
 */
(function(_){

	/**
	 * @param {Object} js 
	 * @param {Object} filter
	 * @param {Object} indentValue
	 */ 
	_.json = _.js2json = function(js, filter, indentValue){
	    return __JSON__.stringify(js, filter, indentValue||'');
	};
    
    /**
     * @param {Object} filter
     * @param {Object} indentValue
     */
    _.fn.json = _.fn.js2json = function( filter, indentValue){
        var i, str='[';
        for(i=0;i<this.length;i++){
            str += __JSON__.stringify(this[i], filter, indentValue||'');
            if(!(i+1 == this.length)){
                str+=',\n'
            }
        }
	    return str + ']';
	};
    
	/**
	 * @param {Object} json
	 * @param {Object} filter
	 */
	_.eval = _.json2js = function(json, filter){
	    return JSON.parse(json, filter);
	};
    
    /** 
     * @param {Object} filter
     */
    _.fn.eval = _.fn.json2js = function(filter){
        var i,js = [];
	    for(i=0;i<this.length;i++){
            js[i] = JSON.parse(this[i], filter);
        }
        return js;
	};
	
    /**
     * @param {Object} js
     * @param {Object} filter
     */
	_.strip = _.stripjs = function(js, filter){
	    return _.eval(_.js2json(js, filter, ''));
	};
    
    /**
     * @param {Object} filter
     */
    _.fn.strip = _.fn.stripjs = function(filter){
	    return _.eval(this.js2json(filter, ''));
	};
	
	
    /**
     * __json__ is used internally to store the selected
     * json parsing methodolgy
     * 
     * This method of optimization is from 
     * 
     * http://weblogs.asp.net/yuanjian/archive/2009/03/22/json-performance-comparison-of-eval-new-function-and-json.aspx
     */
	var __json__ = null;
	if ( typeof JSON !== "undefined" ) {
		__json__ = JSON;
	}
	var JSON = {
	    parse: function( text , safe) {
           if(__json__ !== null || safe){
    	       return ( __json__ !== null) ?
    	           __json__.parse( text ) :
        	       __JSON__.parse(text);
           }
           if ( browser.gecko ) {
                return new Function( "return " + text )();
           }
            return eval( "(" + text + ")" );
	    }
	};  
    
           
	/*
	    http://www.JSON.org/json2.js
	    2008-07-15
	
	    Public Domain.
	
	    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	
	    See http://www.JSON.org/js.html
	
	   
	    This code should be minified before deployment.
	    See http://javascript.crockford.com/jsmin.html
	
	    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	    NOT CONTROL.
	*/
    var __JSON__ = function () {

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON = function (key) {
            return String(this);
        };
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {
        	
            escapeable.lastIndex = 0;
            return escapeable.test(string) ?
                '"' + string.replace(escapeable, function (a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    }
                    return '\\u' + ('0000' +
                            (+(a.charCodeAt(0))).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        }


        function str(key, holder) {

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                return String(value);
                
            case 'object':

                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];

                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    
                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }

        return {
            stringify: function (value, replacer, space) {

                var i;
                gap = '';
                indent = '';

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                } else if (typeof space === 'string') {
                    indent = space;
                }

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                         typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                return str('', {'': value});
            },


            parse: function (text, reviver) {
                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }

                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' + ('0000' +
                                (+(a.charCodeAt(0))).toString(16)).slice(-4);
                    });
                }

                if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	
                    j = eval('(' + text + ')');

                    return typeof reviver === 'function' ?
                        walk({'': j}, '') : j;
                }

                throw new SyntaxError('JSON.parse');
            }
        };
    }();

    /**
	 * from yui we determine the browser
	 */
	//yui
	var Browser = function() {
	   var o = {
	       ie: 0,
	       opera: 0,
	       gecko: 0,
	       webkit: 0
	   };
	   var ua = navigator.userAgent, m;
	   if ( ( /KHTML/ ).test( ua ) ) {
	       o.webkit = 1;
	   }
	   // Modern WebKit browsers are at least X-Grade
	   m = ua.match(/AppleWebKit\/([^\s]*)/);
	   if (m&&m[1]) {
	       o.webkit=parseFloat(m[1]);
	   }
	   if (!o.webkit) { // not webkit
	       // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
	       m=ua.match(/Opera[\s\/]([^\s]*)/);
	       if (m&&m[1]) {
	           o.opera=parseFloat(m[1]);
	       } else { // not opera or webkit
	           m=ua.match(/MSIE\s([^;]*)/);
	           if (m&&m[1]) {
	               o.ie=parseFloat(m[1]);
	           } else { // not opera, webkit, or ie
	               m=ua.match(/Gecko\/([^\s]*)/);
	               if (m) {
	                   o.gecko=1; // Gecko detected, look for revision
	                   m=ua.match(/rv:([^\s\)]*)/);
	                   if (m&&m[1]) {
	                       o.gecko=parseFloat(m[1]);
	                   }
	               }
	           }
	       }
	   }
	   return o;
	};
	var browser = Browser();

})(jsPath);