/**
 * @VERSION@ 
 * 
 * Copyright (c) 2008-2009 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * jQuery.jsPath ObjTree 
 * 
 * 	Based on ObjTree.js from 
 *	Yusuke Kawasaki http://www.kawa.net/ 
 *
 *	NOTE: This plugin is primarily designed for javascript to xml.
 *        
 *        For client-side xml to javascript utilities see 
 *            - ( http://github.com/thatcher/jquery-xslt ) -
 *        for xml to js plugins that are MUCH faster
 *        
 *        For server-side xml to javascript utilities see 
 *            - ( http://github.com/thatcher/jquery-e4x ) -
 *        for xml to js plugins that are MUCH faster
 */

(function($){
    $.objtree = function(opts){
        ObjTree.prototype.xmlDecl = opts.xmlDecl||ObjTree.prototype.xmlDecl;
        ObjTree.prototype.attr_prefix = opts.attr_prefix||ObjTree.prototype.attr_prefix;
        ObjTree.prototype.ns_colon = opts.ns_colon||ObjTree.prototype.ns_colon;
        ObjTree.prototype.mixed_content_name = opts.ns_colon||ObjTree.prototype.mixed_content_name;
    };
    
    $.xml2js = function(xml, opts){
        var objtree = $.extend(new ObjTree(), opts||{});
        var obj = objtree.parseXML(xml);
    };
    
    $.dom2js = function(dom, opts){
        var objtree = $.extend(new ObjTree(), opts||{});
        return objtree.parseDOM(dom);
    };
    
    $.x = $.js2xml =  function(js, opts){
        var objtree = $.extend(new ObjTree(), opts||{});
        return objtree.writeXML(js);
    };
    
    $.fn.x = function(i){
        var xml = '';
        if(i && this[i]){
            xml = $.js2xml(this[i]);
        }else{
            for (i = 0; i < this.length; i++) {
                xml += $.js2xml(this[i]);
            }
        }
        return xml;
    };
    
    $.escape = function(xml){
        return ObjTree.prototype.xml_escape(xml);  
    };
    
    $.e3x = function(xml, model){
        var t = $(xml).clone();
        $('.e3x', t).each(function(){
            var result,
                e3x = $(this).text().replace('{','{__$__:');
            with(model||{}){
                eval('result = '+e3x);
            }
            $(this).html($.x(result.__$__));
        });
        return t;
    };
    // ========================================================================
    //  ObjTree -- XML source code from/to JavaScript object like E4X
    // ========================================================================
    // A thin jQuery-jsPath wrapper for Yusuke Kawasaki's ObjTree.
    
    //  constructor
    
    var  ObjTree = function () {
        return this;
    };
    
    //  class variables
    
    ObjTree.VERSION = "0.24";
    
    //  object prototype
    
    ObjTree.prototype.xmlDecl = '<?xml version="1.0" encoding="UTF-8" ?>\n';
    ObjTree.prototype.attr_prefix = '$';
    ObjTree.prototype.ns_colon = '$';
    ObjTree.prototype.mixed_content_name = '$';
    
    
    //  method: parseXML( xmlsource )
    ObjTree.prototype.parseXML = function ( xml ) {
        var root;
        if ( window.DOMParser ) {
            var xmldom = new DOMParser();
            // DOMParser is always sync-mode
            var dom = xmldom.parseFromString( xml, "application/xml" );
            if ( ! dom ) return;
            root = dom.documentElement;
        } else if ( window.ActiveXObject ) {
            xmldom = new ActiveXObject('Microsoft.XMLDOM');
            xmldom.async = false;
            xmldom.loadXML( xml );
            root = xmldom.documentElement;
        }
        if ( ! root ) return;
        return this.parseDOM( root );
    };
    
    //  method: parseDOM( documentroot )
    
    ObjTree.prototype.parseDOM = function ( root ) {
        if ( ! root ) return;
    
        this.__force_array = {};
        if ( this.force_array ) {
            for( var i=0; i<this.force_array.length; i++ ) {
                this.__force_array[this.force_array[i]] = 1;
            }
        }
    
        var json = this.parseElement( root );   // parse root node
        if ( this.__force_array[root.nodeName] ) {
            json = [ json ];
        }
        if ( root.nodeType != 11 ) {            // DOCUMENT_FRAGMENT_NODE
            var tmp = {};
            tmp[root.nodeName] = json;          // root nodeName
            json = tmp;
        }
        return json;
    };
    
    //  method: parseElement( element )
    
    ObjTree.prototype.parseElement = function ( elem ) {
        //  COMMENT_NODE
        if ( elem.nodeType == 7 ) {
            return;
        }
    
        //  TEXT_NODE CDATA_SECTION_NODE
        if ( elem.nodeType == 3 || elem.nodeType == 4 ) {
            var bool = elem.nodeValue.match( /[^\x00-\x20]/ );
            if ( bool == null ) return;     // ignore white spaces
            return elem.nodeValue;
        }
    
        var retval;
        var cnt = {};
    
        //  parse attributes
        if ( elem.attributes && elem.attributes.length ) {
            retval = {};
            for ( var i=0; i<elem.attributes.length; i++ ) {
                var key = elem.attributes[i].nodeName;
                if ( typeof(key) != "string" ) continue;
                var val = elem.attributes[i].nodeValue;
                if ( ! val ) continue;
                key = this.attr_prefix + key;
                if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
                cnt[key] ++;
                this.addNode( retval, key, cnt[key], val );
            }
        }
    
        //  parse child nodes (recursive)
        if ( elem.childNodes && elem.childNodes.length ) {
            var textonly = true;
            if ( retval ) textonly = false;        // some attributes exists
            for ( var i=0; i<elem.childNodes.length && textonly; i++ ) {
                var ntype = elem.childNodes[i].nodeType;
                if ( ntype == 3 || ntype == 4 ) continue;
                textonly = false;
            }
            if ( textonly ) {
                if ( ! retval ) retval = "";
                for ( var i=0; i<elem.childNodes.length; i++ ) {
                    retval += elem.childNodes[i].nodeValue;
                }
            } else {
                if ( ! retval ) retval = {};
                for ( var i=0; i<elem.childNodes.length; i++ ) {
                    var key = elem.childNodes[i].nodeName;
                    if ( typeof(key) != "string" ) continue;
                    var val = this.parseElement( elem.childNodes[i] );
                    if ( ! val ) continue;
                    if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
                    cnt[key] ++;
                    this.addNode( retval, key, cnt[key], val );
                }
            }
        }
        return retval;
    };
    
    //  method: addNode( hash, key, count, value )
    
    ObjTree.prototype.addNode = function ( hash, key, cnts, val ) {
        key = this.removeColon(key);
        if ( this.__force_array[key] ) {
            if ( cnts == 1 ) hash[key] = [];
            hash[key][hash[key].length] = val;      // push
        } else if ( cnts == 1 ) {                   // 1st sibling
            hash[key] = val;
        } else if ( cnts == 2 ) {                   // 2nd sibling
            hash[key] = [ hash[key], val ];
        } else {                                    // 3rd sibling and more
            hash[key][hash[key].length] = val;
        }
    };
    
    //  method: writeXML( tree )
    
    ObjTree.prototype.writeXML = function ( tree ) {
        var xml="", i;
        if ( typeof(tree) == "undefined" || tree == null ) {
            xml = '';
        } else if ( typeof(tree) == "object" &&  tree.length  ) {
            for(i=0;i<tree.length;i++){
                xml += '\n'+this.writeXML(tree[i]);
            }
        } else if ( typeof(tree) == "object" ) {
            xml = this.hash_to_xml( null, tree );
        } else {
            xml = tree
        } 
        return /*this.xmlDecl +*/ xml;
    };
    
    //  method: replaceColon( tagName, tree )
    ObjTree.prototype.replaceColon = function(name){
        return name ? (name.substring(0,1)+name.substring(1).replace(this.ns_colon,':')): name;
    };
    //  method: replaceColon( tagName, tree )
    ObjTree.prototype.removeColon = function(name){
        return name ? (name.replace(':',this.ns_colon)): name;
    };
    
    //  method: hash_to_xml( tagName, tree )
    ObjTree.prototype.hash_to_xml = function ( name, tree ) {
        var elem = [];
        var attr = [];
        name = this.replaceColon(name);
        for( var key in tree ) {
            if ( ! tree.hasOwnProperty(key) ) continue;
            var val = tree[key];
            if ( key.charAt(0) != this.attr_prefix ) {
                if ( typeof(val) == "undefined" || val == null ) {
                    elem[elem.length] = "<"+key+" />";
                } else if ( typeof(val) == "object" && val.length ) {
                    elem[elem.length] = this.array_to_xml( key, val );
                } else if ( typeof(val) == "object" ) {
                    elem[elem.length] = this.hash_to_xml( key, val );
                } else {
                    elem[elem.length] = this.scalar_to_xml( key, val );
                }
            } else {
                if (key == this.mixed_content_name) {
                    //text node
                    if ( typeof(val) == "undefined" || val == null ) {
                        elem[elem.length] = " ";
                    } else if ( typeof(val) == "object" && val.length ) {
                         elem[elem.length] = this.writeXML(val);
                    } else if ( typeof(val) == "object" ) {
                        elem[elem.length] = this.hash_to_xml( key, val );
                    } else {
                        elem[elem.length] = this.scalar_to_xml( key, val );
                    }
                } else {
                    attr[attr.length] = " " +
                        (this.replaceColon(key).substring(1)) + '="' +
                        (this.xml_escape(val)) + '"';
                }
            }
        }
        var jattr = attr.join("");
        var jelem = elem.join("");
        if ( typeof(name) == "undefined" || name == null ) {
            // no tag
        } else if ( elem.length > 0 ) {
            if ( jelem.match( /\n/ )) {
                jelem = "<"+name+jattr+">\n"+jelem+"</"+name+">\n";
            } else {
                jelem = "<"+name+jattr+">"  +jelem+"</"+name+">\n";
            }
        } else {
            jelem = "<"+name+jattr+" />\n";
        }
        return jelem;
    };

    //  method: array_to_xml( tagName, array )
    
    ObjTree.prototype.array_to_xml = function ( name, array ) {
        var out = [];
        if(!(name == this.mixed_content_name)){
            name = this.replaceColon(name);
        }
        for( var i=0; i<array.length; i++ ) {
            var val = array[i];
            if ( typeof(val) == "undefined" || val == null ) {
                out[out.length] = "<"+name+" />";
            } else if ( typeof(val) == "object" && val.constructor == Array 
                && name!=this.mixed_content_name) {
                out[out.length] = this.array_to_xml( name, val );
            } else if ( typeof(val) == "object" ) {
                out[out.length] = this.hash_to_xml( name, val );
            } else {
                out[out.length] = this.scalar_to_xml( name, val );
            }
        }    
        return out.join("");
    };
    
    //  method: scalar_to_xml( tagName, text )
    
    ObjTree.prototype.scalar_to_xml = function ( name, text ) {
        if ( name == "$" ) {
            return this.xml_escape(text);
        } else {
            name = this.replaceColon(name);
            return "<"+name+">"+this.xml_escape(text)+"</"+name+">\n";
        }
    };
    
    //  method: xml_escape( text )
    
    ObjTree.prototype.xml_escape = function ( text ) {
        return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    };


})(jQuery);