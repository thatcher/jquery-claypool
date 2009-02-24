(function($){

	//Basic JSON Utilities (thin wrap of json2.js)
	$.js2json = function(js, filter, indentValue){
	    return JSON.stringify(js, filter, indentValue||'  ');
	};
	
	$.json2js = function(json, filter){
	    return JSON.parse(json, filter);
	};
	
	$.stripjs = function(js, filter){
	    return $.json2js($.js2json(js, filter, '  '));
	};
	
	
	//Basic JSON Path Utilities (thin wrap of jsonpath.js)
	$.jspath = $.collection.build();
	
	$.jspath.fn.init = function(path, jsObject, pathOrResult){
		if(!jsObject)jsObject = window;
		if(!(typeof path == "string")) path = "$.*";
		var result = jsonPath(jsObject, path, pathOrResult)||[];
		return this.setArray(result);
	};
	
	$.jspath.fn.include( Array.prototype, 'join,push' );
	
	$.jspath.fn.toString = function(js){
		var i = 0, str = [];
		if(js){
	        return $.js2json(js);
        }
		return $.js2json(this[i]);
	};
	
	/* JSONPath 0.8.0 - XPath for JSON
	 *
	 * Copyright (c) 2007 Stefan Goessner (goessner.net)
	 * Licensed under the MIT (MIT-LICENSE.txt) licence.
	 */
	function jsonPath(obj, expr, arg) {
	   var P = {
	      resultType: arg && arg.resultType || "VALUE",
	      result: [],
	      normalize: function(expr) {
	         var subx = [];
	         return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
	                    .replace(/'?\.'?|\['?/g, ";")
	                    .replace(/;;;|;;/g, ";..;")
	                    .replace(/;$|'?\]|'$/g, "")
	                    .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
	      },
	      asPath: function(path) {
	         var x = path.split(";"), p = "$";
	         for (var i=1,n=x.length; i<n; i++)
	            p += (/^[0-9*]+$/).test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
	         return p;
	      },
	      store: function(p, v) {
	         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
	         return !!p;
	      },
	      trace: function(expr, val, path) {
	         if (expr) {
	            var x = expr.split(";"), loc = x.shift();
	            x = x.join(";");
	            if (val && val.hasOwnProperty(loc))
	               P.trace(x, val[loc], path + ";" + loc);
	            else if (loc === "*")
	               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
	            else if (loc === "..") {
	               P.trace(x, val, path);
	               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
	            }
	            else if (/,/.test(loc)) { // [name1,name2,...]
	               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
	                  P.trace(s[i]+";"+x, val, path);
	            }
	            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
	               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
	            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
	               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
	            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
	               P.slice(loc, x, val, path);
	         }
	         else
	            P.store(path, val);
	      },
	      walk: function(loc, expr, val, path, f) {
	         if (val instanceof Array) {
	            for (var i=0,n=val.length; i<n; i++)
	               if (i in val)
	                  f(i,loc,expr,val,path);
	         }
	         else if (typeof val === "object") {
	            for (var m in val)
	               if (val.hasOwnProperty(m))
	                  f(m,loc,expr,val,path);
	         }
	      },
	      slice: function(loc, expr, val, path) {
	         if (val instanceof Array) {
	            var len=val.length, start=0, end=len, step=1;
	            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g,
	                function($0,$1,$2,$3){start=parseInt($1||start,10);end=parseInt($2||end,10);step=parseInt($3||step,10);});
	            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
	            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
	            for (var i=start; i<end; i+=step)
	               P.trace(i+";"+expr, val, path);
	         }
	      },
	      eval: function(x, _v, _vname) {
	         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
	         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
	      }
	   };
	
	   var $ = obj;
	   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
	      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
	      return P.result.length ? P.result : false;
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
    var JSON = function () {

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
            /*if(jQuery.env === jQuery.Configuration.env.dev.server){
                print(key); 
            }*/
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


})(jQuery);