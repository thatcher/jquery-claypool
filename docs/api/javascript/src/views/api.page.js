(function($, $V){
	$V.Page$Class = {
		creole:null,
	    constructor: function(options){
	        $.extend( this, 
	        	$V.Page$Class,
	        	$.Logging.getLogger("API.Views.Page")
        	);$.extend(true, this, options);
        	//TABS
	       $('#tabs').tabs().show();
	       var _this = this;
	    },
		update: function(model){
	       	$("> div", this).hide();
	       	$("#"+model.target).text('');
            $('#wikitext').text(
            	model.wikiText.replace('\r','','g').
            		replace("[[PageOutline]]", '', 'g').
            		replace("'''", '**', 'g').
            		replace("''", '//', 'g').
            		replace("|| ||", "||=||", 'g').
            		replace("||", "|", 'g').
            		replace(/\!(\w+)/g, function(a,b){
            			return b;
            		})
        	);
            this.creole.parse(
				$("#"+model.target)[0], 
				$('#wikitext').text()
			);
		    
			/*
			//TERTIARY NAV SUPPORTS TABNAV
			jQuery(".ui-tabs-hide", this).each(function(){
			   jQuery('#'+jQuery(this).attr('id')+'-nav').hide();
			});
			jQuery("#tabNav a").bind("click", function(event){
			   var hash = this.hash;
			   _this.logger.debug("Loading tab %s", hash);
			   jQuery("#tertiaryNav > div").hide();
			   var subnav = jQuery(hash+'-nav').show();
			   jQuery("a:first",subnav).trigger("click");
			});
			
			//TABLES
			jQuery("table.tablesorter").tablesorter({widgets: ['zebra']});
			*/
			//CODE HIGHLIGHTING
       		$('pre').addClass('javascript').chili();
			$("#"+model.target).show();
			$(this).show();
	   }
	}; 
	$V.Page = $V.Page$Class.constructor;
})(jQuery, API.Views);
