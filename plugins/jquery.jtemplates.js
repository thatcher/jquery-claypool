/* 
 * jTemplates 0.7.0 (http://jtemplates.tpython.com)
 * Copyright (c) 2007-2008 Tomasz Gloc (http://www.tpython.com)
 * Please do not remove or modify above line. Thanks.
 * 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Id: $Id: jquery-jtemplates_uncompressed.js 161 2008-05-22 17:31:45Z tom $
 */
 
 /**
 * @fileOverview Template engine in JavaScript.
 * @name jTemplates
 * @author Tomasz Gloc
 * @date $Date: 2008-05-22 19:31:45 +0200 (Cz, 22 maj 2008) $
 */

//#####>@IGNORE
 
/** @ignore */
function log(arg) {
	if(window.console) {
		console.log.apply(document, arguments);
	}
};

//#####<@IGNORE


if(window.jQuery && !window.jQuery.createTemplate) {(function() {
	
	/**
	 * [abstract]
	 * @name BaseNode
	 * @class Abstract node. [abstract]
	 */
	
	/**
	 * Process node and get the html string. [abstract]
	 * @name get
	 * @function
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 * @memberOf BaseNode
	 */
	
	/**
	 * [abstract]
	 * @name BaseArray
	 * @inherits BaseNode
	 * @class Abstract array/collection. [abstract]
	 */
	
	/**
	 * Add node 'e' to array.
	 * @name push
	 * @function
	 * @param {BaseNode} e a node
	 * @memberOf BaseArray
	 */
	
	/**
	 * See (http://jquery.com/).
	 * @name jQuery
	 * @class jQuery Library (http://jquery.com/)
	 */
	
	/**
	 * See (http://jquery.com/)
	 * @name fn
	 * @class jQuery Library (http://jquery.com/)
	 * @memberOf jQuery
	 */
	
	
	/**
	 * Create new template from string s.
	 * @constructor
	 * @param {string} s A template string (like: "Text: {$T.txt}.").
	 * @param {array} [includes] Array of included templates.
	 * @param {object} [settings] Settings.
	 * @config {boolean} [disallow_functions] Do not allow use function in data (default: true).
	 * @config {boolean} [filter_data] Enable filter data using escapeHTML (default: true).
	 * @config {boolean} [filter_params] Enable filter parameters using escapeHTML (default: false).
	 * @config {boolean} [runnable_functions] Automatically run function (from data) inside {} [default: false]. 
	 * @inherits BaseNode
	 * @class A template or multitemplate.
	 */
	var Template = function(s, includes, settings) {
		this._tree = [];
		this._param = {};
		this._includes = null;
		this._templates = {};
		this._templates_code = {};
		
		this.settings = jQuery.extend({
			disallow_functions: false,
			filter_data: true,
			filter_params: false,
			runnable_functions: false,
			clone_data: true,
			clone_params: true
		}, settings);
		
		this.splitTemplates(s, includes);
		
		if(s) {
			this.setTemplate(this._templates_code['MAIN'], includes, this.settings);
		}
		
		this._templates_code = null;
	};
	
	/**
	 * jTemplates version
	 * @type string
	 */
	Template.prototype.version = '0.7.0';
	
	/**
	 * Split multitemplate into multiple templates.
	 * @param {string} s A template string (like: "Text: {$T.txt}.").
	 * @param {array} includes Array of included templates.
	 */
	Template.prototype.splitTemplates = function(s, includes) {
		var reg = /\{#template *(\w*?)( .*)*\}/g;
		var iter, tname, se;
		var lastIndex = null;
		
		var _template_settings = [];
		
		while((iter = reg.exec(s)) != null) {
			lastIndex = reg.lastIndex;
			tname = iter[1];
			se = s.indexOf('{#/template ' + tname + '}', lastIndex);
			if(se == -1) {
				throw new Error('jTemplates: Template "' + tname + '" is not closed.');
			}
			this._templates_code[tname] = s.substring(lastIndex, se);
			_template_settings[tname] = TemplateUtils.optionToObject(iter[2]);
		}
		if(lastIndex === null) {
			this._templates_code['MAIN'] = s;
			return;
		}
		
		for(var i in this._templates_code) {
			if(i != 'MAIN') {
				this._templates[i] = new Template();
			}
		}
		for(var i in this._templates_code) {
			if(i != 'MAIN') {
				this._templates[i].setTemplate(this._templates_code[i], jQuery.extend({}, includes || {}, this._templates || {}), jQuery.extend({}, this.settings, _template_settings[i]));
				this._templates_code[i] = null;
			}
		}
	};
	
	/**
	 * Parse template. (should be template, not multitemplate).
	 * @param {string} s A template string (like: "Text: {$T.txt}.").
	 * @param {array} includes Array of included templates.
	 */
	Template.prototype.setTemplate = function(s, includes, settings) {
		if(s == undefined) {
			this._tree.push(new TextNode('', 1));
			return;
		}
		s = s.replace(/[\n\r]/g, '');
		s = s.replace(/\{\*.*?\*\}/g, '');
		this._includes = jQuery.extend({}, this._templates || {}, includes || {});
		this.settings = new Object(settings);
		var node = this._tree;
		var op = s.match(/\{#.*?\}/g);
		var ss = 0, se = 0;
		var e;
		var literalMode = 0;
		var elseif_level = 0;
		
		for(var i=0, l=(op)?(op.length):(0); i<l; ++i) {
			if(literalMode) {
				se = s.indexOf('{#/literal}');
				if(se == -1) {
					throw new Error("jTemplates: No end of literal.");
				}
				if(se > ss) {
					node.push(new TextNode(s.substring(ss, se), 1));
				}
				ss = se + 11;
				literalMode = 0;
				i = jQuery.inArray('{#/literal}', op);
				continue;
			}
			se = s.indexOf(op[i], ss);
			if(se > ss) {
				node.push(new TextNode(s.substring(ss, se), literalMode));
			}
			var ppp = op[i].match(/\{#([\w\/]+).*?\}/);
			var op_ = RegExp.$1;
			switch(op_) {
				case 'elseif':
					++elseif_level;
					node.switchToElse();
					//no break
				case 'if':
					e = new opIF(op[i], node);
					node.push(e);
					node = e;
					break;
				case 'else':
					node.switchToElse();
					break;
				case '/if':
					while(elseif_level) {
						node = node.getParent();
						--elseif_level;
					}
					//no break
				case '/for':
				case '/foreach':
					node = node.getParent();
					break;
				case 'foreach':
					e = new opFOREACH(op[i], node);
					node.push(e);
					node = e;
					break;
				case 'for':
					e = opFORFactory(op[i], node);
					node.push(e);
					node = e;
					break;
				case 'include':
					node.push(new Include(op[i], this._includes));
					break;
				case 'param':
					node.push(new UserParam(op[i]));
					break;
				case 'cycle':
					node.push(new Cycle(op[i]));
					break;
				case 'ldelim':
					node.push(new TextNode('{'));
					break;
				case 'rdelim':
					node.push(new TextNode('}'));
					break;
				case 'literal':
					literalMode = 1;
					break;
				case '/literal':
					throw new Error("jTemplates: No begin of literal.");
				default:
					throw new Error('jTemplates: unknown tag ' + op_ + '.');
			}
	
			ss = se + op[i].length;
		}
	
		if(s.length > ss) {
			node.push(new TextNode(s.substr(ss), literalMode));
		}
	};
	
	/**
	 * Process template and get the html string.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	Template.prototype.get = function(d, param, element, deep) {
		++deep;
		
		var $T = d, _param1, _param2;
		
		if(this.settings.clone_data) {
			$T = TemplateUtils.cloneData(d, {escapeData: (this.settings.filter_data && deep == 1), noFunc: this.settings.disallow_functions});
		}
		
		if(!this.settings.clone_params) {
			_param1 = this._param;
			_param2 = param;
		} else {
			_param1 = TemplateUtils.cloneData(this._param, {escapeData: (this.settings.filter_params), noFunc: false});
			_param2 = TemplateUtils.cloneData(param, {escapeData: (this.settings.filter_params && deep == 1), noFunc: false});
		}
		var $P = jQuery.extend({}, _param1, _param2);
		
		var $Q = element;
		$Q.version = this.version;
	
		var ret = '';
		for(var i=0, l=this._tree.length; i<l; ++i) {
			ret += this._tree[i].get($T, $P, $Q, deep);
		}
		
		--deep;
		return ret;
	};
	
	/**
	 * Set to parameter 'name' value 'value'.
	 * @param {string} name
	 * @param {object} value
	 */
	Template.prototype.setParam = function(name, value) {
		this._param[name] = value;
	};


	/**
	 * Template utilities.
	 * @class Template utilities.
	 */
	TemplateUtils = function() {
	};
	
	/**
	 * Replace chars &, >, <, ", ' with html entities.
	 * To disable function set settings: filter_data=false, filter_params=false
	 * @param {string} string
	 * @return {string}
	 * @static
	 * @memberOf TemplateUtils
	 */
	TemplateUtils.escapeHTML = function(txt) {
		return txt.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
	};

	/**
	 * Make a copy od data 'd'. It also filters data (depend on 'filter').
	 * @param {object} d input data
	 * @param {object} filter a filters
	 * @config {boolean} [escapeData] Use escapeHTML on every string.
	 * @config {boolean} [noFunc] Do not allow to use function (throws exception).
	 * @return {object} output data (filtered)
	 * @static
	 * @memberOf TemplateUtils
	 */
	TemplateUtils.cloneData = function(d, filter) {
		if(d == null) {
			return d;
		}
		switch(d.constructor) {
			case Object:
				var o = {};
				for(var i in d) {
					o[i] = TemplateUtils.cloneData(d[i], filter);
				}
				if(!filter.noFunc) {
					o.toString = d.toString;
				}
				return o;
			case Array:
				var o = [];
				for(var i=0,l=d.length; i<l; ++i) {
					o[i] = TemplateUtils.cloneData(d[i], filter);
				}
				return o;
			case String:
				return (filter.escapeData) ? (TemplateUtils.escapeHTML(d)) : (d);
			case Function:
				if(filter.noFunc) {
					throw new Error("jTemplates: Functions are not allowed.");
				}
				//no break
			default:
				return d;
		}
	};
	
	/**
	 * Convert text-based option string to Object
	 * @param {string} optionText text-based option string
	 * @return {Object}
	 * @static
	 * @memberOf TemplateUtils
	 */
	TemplateUtils.optionToObject = function(optionText) {
		if(optionText === null || optionText === undefined) {
			return {};
		}
		
		var o = optionText.split(/[= ]/);
		if(o[0] === '') {
			o.shift();
		}
		
		var obj = {};
		for(var i=0, l=o.length; i<l; i+=2) {
			obj[o[i]] = o[i+1];
		}
		
		return obj;
	};
	
	
	/**
	 * Create a new text node.
	 * @constructor
	 * @param {string} val text string
	 * @param {boolean} literalMode When enable (true) template does not interpret blocks {..}.
	 * @inherits BaseNode
	 * @class All text (block {..}) between controls block {#..}.
	 */
	var TextNode = function(val, literalMode) {
		this._value = val;
		this._literalMode = literalMode;
	};
	
	/**
	 * Get the html string for a text node.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	TextNode.prototype.get = function(d, param, element, deep) {
		var t = this._value;
		if(!this._literalMode) {
			var $T = d;
			var $P = param;
			var $Q = element;
			t = t.replace(/\{(.*?)\}/g, function(__a0, __a1) {
				var tmp = eval(__a1);
				if(typeof tmp == 'function') {
					var settings = jQuery.data(element, 'jTemplate').settings;
					if(settings.disallow_functions || !settings.runnable_functions) {
						return '';
					} else {
						tmp = tmp($T, $P, $Q);
					}
				}
				return (tmp === undefined) ? ("") : (String(tmp));
			});
		}
		return t;
	};
	
	/**
	 * Create a new conditional node.
	 * @constructor
	 * @param {string} oper content of operator {#..}
	 * @param {object} par parent node
	 * @inherits BaseArray
	 * @class A class represent: {#if}.
	 */
	var opIF = function(oper, par) {
		this._parent = par;
		oper.match(/\{#(?:else)*if (.*?)\}/);
		this._cond = RegExp.$1;
		this._onTrue = [];
		this._onFalse = [];
		this._currentState = this._onTrue;
	};
	
	/**
	 * Add node 'e' to array.
	 * @param {BaseNode} e a node
	 */
	opIF.prototype.push = function(e) {
		this._currentState.push(e);
	};
	
	/**
	 * Get a parent node.
	 * @return {BaseNode}
	 */
	opIF.prototype.getParent = function() {
		return this._parent;
	};
	
	/**
	 * Switch from collection onTrue to onFalse.
	 */
	opIF.prototype.switchToElse = function() {
		this._currentState = this._onFalse;
	};
	
	/**
	 * Process node depend on conditional and get the html string.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	opIF.prototype.get = function(d, param, element, deep) {
		var $T = d;
		var $P = param;
		var $Q = element;
		var tab = (eval(this._cond)) ? (this._onTrue) : (this._onFalse);
		var ret = '';
		for(var i=0, l=tab.length; i<l; ++i) {
			ret += tab[i].get(d, param, element, deep);
		}
		return ret;
	};
	
	/**
	 * Handler for a tag 'FOR'. Create new and return relative opFOREACH object.
	 * @param {string} oper content of operator {#..}
	 * @param {object} par parent node
	 */
	opFORFactory = function(oper, par) {
		if(oper.match(/\{#for (\w+?) *= *(\S+?) +to +(\S+?) *(?:step=(\S+?))*\}/)) {
			oper = '{#foreach opFORFactory.funcIterator as ' + RegExp.$1 + ' begin=' + (RegExp.$2 || 0) + ' end=' + (RegExp.$3 || -1) + ' step=' + (RegExp.$4 || 1) + ' extData=$T}';
			return new opFOREACH(oper, par);
		} else {
			throw new Error('jTemplates: Operator failed "find": ' + oper);
		}
	};
	
	/**
	 * Function returns inputs data (using internal with opFORFactory)
	 * @param {object} i any data
	 * @return {object} any data (equal parameter 'i')
	 * @private
	 * @static
	 */
	opFORFactory.funcIterator = function(i) {
		return i;
	};
	
	/**
	 * Create a new loop node.
	 * @constructor
	 * @param {string} oper content of operator {#..}
	 * @param {object} par parent node
	 * @inherits BaseArray
	 * @class A class represent: {#foreach}.
	 */
	var opFOREACH = function(oper, par) {
		this._parent = par;
		oper.match(/\{#foreach (.+?) as (\w+?)( .+)*\}/);
		this._arg = RegExp.$1;
		this._name = RegExp.$2;
		this._option = RegExp.$3 || null;
		this._option = TemplateUtils.optionToObject(this._option);
		
		this._onTrue = [];
		this._onFalse = [];
		this._currentState = this._onTrue;
	};
	
	/**
	 * Add node 'e' to array.
	 * @param {BaseNode} e
	 */
	opFOREACH.prototype.push = function(e) {
		this._currentState.push(e);
	};
	
	/**
	 * Get a parent node.
	 * @return {BaseNode}
	 */
	opFOREACH.prototype.getParent = function() {
		return this._parent;
	};
	
	/**
	 * Switch from collection onTrue to onFalse.
	 */
	opFOREACH.prototype.switchToElse = function() {
		this._currentState = this._onFalse;
	};
	
	/**
	 * Process loop and get the html string.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	opFOREACH.prototype.get = function(d, param, element, deep) {
		var $T = d;
		var $P = param;
		var $Q = element;
		var fcount = eval(this._arg);	//array of elements in foreach
		var key = [];	//only for objects
		var mode = typeof fcount;
		if(mode == 'object') {
			var arr = [];
			jQuery.each(fcount, function(k, v) {
				key.push(k);
				arr.push(v);
			});
			fcount = arr;
		}
		var extData = (this._option.extData !== undefined) ? (eval(this._option.extData)) : {};
		var s = Number(eval(this._option.begin) || 0), e;	//start, end
		var step = Number(eval(this._option.step) || 1);
		if(mode != 'function') {
			e = fcount.length;
		} else {
			if(this._option.end === undefined || this._option.end === null) {
				e = Number.MAX_VALUE;
			} else {
				e = Number(eval(this._option.end)) + ((step>0) ? (1) : (-1));
			}
		}
		var ret = '';	//returned string
		var i,l;	//iterators
		
		if(this._option.count) {
			var tmp = s + Number(eval(this._option.count));
			e = (tmp > e) ? (e) : (tmp);
		}
		if((e>s && step>0) || (e<s && step<0)) {
			var iteration = 0;
			var _total = (mode != 'function') ? (Math.ceil((e-s)/step)) : undefined;
			var ckey, cval;	//current key, current value
			for(; ((step>0) ? (s<e) : (s>e)); s+=step, ++iteration) {
				ckey = key[s];
				if(mode != 'function') {
					cval = fcount[s];
				} else {
					cval = fcount(s);
					if(cval === undefined || cval === null) {
						break;
					}
				}
				if((mode == 'object') && (ckey in Object) && (Object[ckey] === $T[ckey])) {
					continue;
				}
				$T = extData;
				var p = $T[this._name] = cval;
				$T[this._name + '$index'] = s;
				$T[this._name + '$iteration'] = iteration;
				$T[this._name + '$first'] = (iteration==0);
				$T[this._name + '$last'] = (s+step>=e);
				$T[this._name + '$total'] = _total;
				$T[this._name + '$key'] = ckey;
				$T[this._name + '$typeof'] = typeof cval;
				for(i=0, l=this._onTrue.length; i<l; ++i) {
					ret += this._onTrue[i].get($T, param, element, deep);
				}
				delete $T[this._name + '$index'];
				delete $T[this._name + '$iteration'];
				delete $T[this._name + '$first'];
				delete $T[this._name + '$last'];
				delete $T[this._name + '$total'];
				delete $T[this._name + '$key'];
				delete $T[this._name + '$typeof'];
				delete $T[this._name];
			}
		} else {
			for(i=0, l=this._onFalse.length; i<l; ++i) {
				ret += this._onFalse[i].get($T, param, element, deep);
			}
		}
		return ret;
	};
	
	/**
	 * Create a new entry for included template.
	 * @constructor
	 * @param {string} oper content of operator {#..}
	 * @param {array} includes
	 * @inherits BaseNode
	 * @class A class represent: {#include}.
	 */
	var Include = function(oper, includes) {
		oper.match(/\{#include (.*?)(?: root=(.*?))?\}/);
		this._template = includes[RegExp.$1];
		if(this._template == undefined) {
			throw new Error('jTemplates: Cannot find include: ' + RegExp.$1);
		}
		this._root = RegExp.$2;
	};
	
	/**
	 * Run method get on included template.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	Include.prototype.get = function(d, param, element, deep) {
		var $T = d;
		return this._template.get(eval(this._root), param, element, deep);
	};
	
	/**
	 * Create new node for {#param}.
	 * @constructor
	 * @param {string} oper content of operator {#..}
	 * @inherits BaseNode
	 * @class A class represent: {#param}.
	 */
	var UserParam = function(oper) {
		oper.match(/\{#param name=(\w*?) value=(.*?)\}/);
		this._name = RegExp.$1;
		this._value = RegExp.$2;
	};
	
	/**
	 * Return value of selected parameter.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	UserParam.prototype.get = function(d, param, element, deep) {
		var $T = d;
		var $P = param;
		var $Q = element;
		
		param[this._name] = eval(this._value);
		return '';
	};
	
	/**
	 * Create a new cycle node.
	 * @constructor
	 * @param {string} oper content of operator {#..}
	 * @inherits BaseNode
	 * @class A class represent: {#cycle}.
	 */
	var Cycle = function(oper) {
		oper.match(/\{#cycle values=(.*?)\}/);
		this._values = eval(RegExp.$1);
		this._length = this._values.length;
		if(this._length <= 0) {
			throw new Error('jTemplates: cycle has no elements');
		}
		this._index = 0;
		this._lastSessionID = -1;
	};

	/**
	 * Do a step on cycle and return value.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	Cycle.prototype.get = function(d, param, element, deep) {
		var sid = jQuery.data(element, 'jTemplateSID');
		if(sid != this._lastSessionID) {
			this._lastSessionID = sid;
			this._index = 0;
		}
		var i = this._index++ % this._length;
		return this._values[i];
	};
	
	/**
	 * Add a Template to HTML Elements.
	 * @param {Template/string} s a Template or a template string
	 * @param {array} [includes] Array of included templates.
	 * @param {object} [settings] Settings (see Template)
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.setTemplate = function(s, includes, settings) {
		if(s.constructor === Template) {
			return jQuery(this).each(function() {
				jQuery.data(this, 'jTemplate', s);
				jQuery.data(this, 'jTemplateSID', 0);
			});
		} else {
			return jQuery(this).each(function() {
				jQuery.data(this, 'jTemplate', new Template(s, includes, settings));
				jQuery.data(this, 'jTemplateSID', 0);
			});
		}
	};
	
	/**
	 * Add a Template (from URL) to HTML Elements.
	 * @param {string} url_ URL to template
	 * @param {array} [includes] Array of included templates.
	 * @param {object} [settings] Settings (see Template)
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.setTemplateURL = function(url_, includes, settings) {
		var s = jQuery.ajax({
			url: url_,
			async: false
		}).responseText;
		
		return jQuery(this).setTemplate(s, includes, settings);
	};
	
	/**
	 * Create a Template from element's content.
	 * @param {string} elementName an ID of element
	 * @param {array} [includes] Array of included templates.
	 * @param {object} [settings] Settings (see Template)
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.setTemplateElement = function(elementName, includes, settings) {
		var s = $('#' + elementName).val();
		if(s == null) {
			s = $('#' + elementName).html();
			s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		}
		
		s = jQuery.trim(s);
		s = s.replace(/^<\!\[CDATA\[([\s\S]*)\]\]>$/im, '$1');
		
		return jQuery(this).setTemplate(s, includes, settings);
	};
	
	/**
	 * Check it HTML Elements have a template. Return count of templates.
	 * @return {number} Number of templates.
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.hasTemplate = function() {
		var count = 0;
		jQuery(this).each(function() {
			if(jQuery.data(this, 'jTemplate')) {
				++count;
			}
		});
		return count;
	};
	
	/**
	 * Remote Template from HTML Element(s)
	 * @return {jQuery} chainable jQuery class
	 */
	jQuery.fn.removeTemplate = function() {
		jQuery(this).processTemplateStop();
		return jQuery(this).each(function() {
			jQuery.removeData(this, 'jTemplate');
		});
	};
	
	/**
	 * Set to parameter 'name' value 'value'.
	 * @param {string} name
	 * @param {object} value
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.setParam = function(name, value) {
		return jQuery(this).each(function() {
			var t = jQuery.data(this, 'jTemplate');
			if(t === undefined) {
				throw new Error('jTemplates: Template is not defined.');
			}
			t.setParam(name, value); 
		});
	};
	
	/**
	 * Process template using data 'd' and parameters 'param'. Update HTML code.
	 * @param {object} d data 
	 * @param {object} [param] parameters
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.processTemplate = function(d, param) {
		return jQuery(this).each(function() {
			var t = jQuery.data(this, 'jTemplate');
			if(t === undefined) {
				throw new Error('jTemplates: Template is not defined.');
			}
			jQuery.data(this, 'jTemplateSID', jQuery.data(this, 'jTemplateSID') + 1);
			jQuery(this).html(t.get(d, param, this, 0));
		});
	};
	
	/**
	 * Process template using data from URL 'url_' (only format JSON) and parameters 'param'. Update HTML code.
	 * @param {string} url_ URL to data (in JSON)
	 * @param {object} [param] parameters
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.processTemplateURL = function(url_, param) {
		var that = this;
		var s = jQuery.ajax({
			url: url_,
			async: false,
			cache: false,
			dataType: 'json',
			success: function(d) {
				jQuery(that).processTemplate(d, param);
			}
		});
		return this;
	};

//#####>UPDATER
	/**
	 * Create new Updater.
	 * @constructor
	 * @param {string} url A destination URL
	 * @param {object} param Parameters (for template)
	 * @param {number} interval Time refresh interval
	 * @param {object} args Additional URL parameters (in URL alter ?) as assoc array.
	 * @param {array} objs An array of HTMLElement which will be modified by Updater.
	 * @class This class is used for 'Live Refresh!'.
	 */
	var Updater = function(url, param, interval, args, objs) {
		this._url = url;
		this._param = param;
		this._interval = interval;
		this._args = args;
		this.objs = objs;
		this.timer = null;
		
		var that = this;
		jQuery(objs).each(function() {
			jQuery.data(this, 'jTemplateUpdater', that);
		});
		this.run();
	};
	
	/**
	 * Create new HTTP request to server, get data (as JSON) and send it to templates. Also check does HTMLElements still exists in Document.
	 */
	Updater.prototype.run = function() {
		this.detectDeletedNodes();
		if(this.objs.length == 0) {
			return;
		}
		var that = this;
		jQuery.getJSON(this._url, this._args, function(d) {
		  jQuery(that.objs).processTemplate(d, that._param);
		});
		this.timer = setTimeout(function(){that.run();}, this._interval);
	};
	
	/**
	 * Check does HTMLElements still exists in HTML Document.
	 * If not exist, delete it from property 'objs'.
	 */
	Updater.prototype.detectDeletedNodes = function() {
		this.objs = jQuery.grep(this.objs, function(o) {
			if(jQuery.browser.msie) {
				var n = o.parentNode;
				while(n && n != document) {
					n = n.parentNode;
				}
				return n != null;
			} else {
				return o.parentNode != null;
			}
		});
	};
	
	/**
	 * Start 'Live Refresh!'.
	 * @param {string} url A destination URL
	 * @param {object} param Parameters (for template)
	 * @param {number} interval Time refresh interval
	 * @param {object} args Additional URL parameters (in URL alter ?) as assoc array.
	 * @return {number} timeoutID
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.processTemplateStart = function(url, param, interval, args) {
		var u = new Updater(url, param, interval, args, this);
		return u.timer;
	};
	
	/**
	 * Stop 'Live Refresh!'.
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.processTemplateStop = function() {
		return jQuery(this).each(function() {
			var updater = jQuery.data(this, 'jTemplateUpdater');
			if(updater == null) {
				return;
			}
			var that = this;
			updater.objs = jQuery.grep(updater.objs, function(o) {
				return o != that;
			});
			jQuery.removeData(this, 'jTemplateUpdater');
		});
	};
//#####<UPDATER
	
	jQuery.extend(/** @scope jQuery.prototype */{
		/**
		 * Create new Template.
		 * @param {string} s A template string (like: "Text: {$T.txt}.").
		 * @param {array} includes Array of included templates.
		 * @param {object} settings Settings. (see Template)
		 * @return {Template}
		 * @obsolete
		 */
		createTemplate: function(s, includes, settings) {
			return new Template(s, includes, settings);
		},
		
		/**
		 * Create new Template from URL.
		 * @param {string} url_ URL to template
		 * @param {array} includes Array of included templates.
		 * @param {object} settings Settings. (see Template)
		 * @return {Template}
		 * @obsolete
		 */
		createTemplateURL: function(url_, includes, settings) {
			var s = jQuery.ajax({
				url: url_,
				async: false
			}).responseText;
			
			return new Template(s, includes, settings);
		}
	});
	
})(jQuery);}
