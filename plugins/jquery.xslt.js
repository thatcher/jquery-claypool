/**
 * @VERSION@ 
 * 
 * Copyright (c) 2008-2009 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * jQuery.jsPath XSLT 
 * 
 * based on jquery.xslt.js by Johann Burkard (<mailto:jb@eaio.com>)
 *
 * NOTE: This plugin is primarily designed for xml to javascript
 *    conversion of legacy data that can't be delivered as json.
 *    it has many other possible uses.  it is very fast as very 
 *    efficient, and works in all modern browsers
 * 
 *          depends_on jquery-jspath 
 *  ( http://github.com/thatcher/jquery-jspath )
 */

(function($) {
	var _xslt = null,
		template = null,
		processor = null;
	
    $.xslt = function() {
        return this;
    }
    var str = /^\s*</;
    if (document.recalc) { // IE 5+
        $.xslt = function(name, xslt_url, parameters, filter) {
			// Load your XSL
			//alert("Loading "+xslt_url);
			_xslt = new ActiveXObject("MSXML2.FreeThreadedDomDocument");
			_xslt.async = false;
			_xslt.load(xslt_url);
			
			// create a compiled XSL-object
			template = new ActiveXObject("MSXML2.XSLTemplate");
			template.stylesheet = _xslt.documentElement;
				
			// create XSL-processor
			processor = template.createProcessor();
			
			
			// input for XSL-processor
			if(parameters){
				for(var p in parameters){
					processor.addParameter(p, parameters[p]);
				}
			}
			//add function to jquery namespace
			$[name] = function(xml){
				processor.input = xml;
				processor.transform();
				if(filter && $.isFunction(filter)){
					return filter(processor.output);
				}else{
					return processor.output;
				}
			};
			
            return this;
       };
    }else if (	window.DOMParser != undefined && 
				window.XMLHttpRequest != undefined && 
				window.XSLTProcessor != undefined  ) { // Mozilla 0.9.4+, Opera 9+
       var processor = new XSLTProcessor();
       var support = false;
       if ($.isFunction(processor.transformDocument)) {
           support = window.XMLSerializer != undefined;
       } else {
           support = true;
       }
       if (support) {
            $.xslt = function(name, xslt_url, parameters, filter) {
				//compile an xslt and add it to the jQuery static namespace
				$.ajax({
					url:xslt_url,
					type:"GET",
					dataType:'xml',
					async:false,
					success: function(xml){ 
						_xslt = xml;
					}
				});
            	processor.importStylesheet(_xslt);
				if(parameters){
					for(var p in parameters){
						processor.setParameter(null, p, parameters[p]);
					}
				}
				//add the function to jquery namespace
                if ($.isFunction(processor.transformToFragment)) {
					
					$[name] = function(xml){
						var result;
						if(filter && $.isFunction(filter)){
							result = processor.transformToFragment(xml, document);
							return filter(result);
						}else{
							return processor.transformToFragment(xml, document);
						}
					};
					
                } else if($.isFunction(processor.transformDocument)) {

					$[name] = function(xml){
	                    // obsolete Mozilla interface
	                    var resultDoc = document.implementation.createDocument("", "", null);
	                    processor.transformDocument(xml, _xslt, resultDoc, null);
						if(filter && $.isFunction(filter)){
							return filter($("#transformiixResult",resultDoc).html());
						}else{
							return $("#transformiixResult",resultDoc).html();
						}
	                    
					};
                }
                return this;
            };
       }
    }
})(jQuery);
