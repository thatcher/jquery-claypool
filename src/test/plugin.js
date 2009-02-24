

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MUnit){
	/**
	 * @constructor
	 */
    //TODO : what is the useful static plugin that could be derived from Claypool.Server?
    //      console ?
    
	$.extend($, {
	    testapi : function(apiTestSuite){
            var testsuite;
            for(var namespaceSuite in apiTestSuite){
                testsuite = new $$MUnit.NamespaceTestRunner( apiTestSuite[namespaceSuite].id );
                testsuite.run();
                $(apiTestSuite[namespaceSuite].template).setTemplateElement("testResultsTemplate");
                $(apiTestSuite[namespaceSuite].template).processTemplate(testsuite.summarize());   
            }
            
            //HIDING AND REVEALING
            $( 'div.namespace_tests' ).livequery(function(){
                $(this).bind('click', function(){
                    var _this = this;
                    if(!$(this).hasClass('display')){
                        $(this).toggleClass('display');
                        $(".namespace_stats", _this).slideDown();
                        $(".namespace_times", _this).slideDown(function(){
                                $(".namespace_results", $(_this).parent()).slideDown();
                            });
                    }else{
                        $(this).toggleClass('display');
                        $(".namespace_results", $(_this).parent()).slideUp(function(){
                            $(".namespace_times", _this).slideUp();
                            $(".namespace_stats", _this).slideUp();
                        });
                    }
                });
            });
            
            $( 'div.class_tests' ).livequery(function(){
                $(this).bind('click', function(){
                    var _this = this;
                    if(!$(this).hasClass('display')){
                        $(this).toggleClass('display');
                        $(".class_results", $(_this).parent()).slideDown();
                    }else{
                        $(this).toggleClass('display');
                        $(".class_results", $(_this).parent()).slideUp();
                    }
                });
            });
	    }
	});
	
})(  jQuery, Claypool, Claypool.MoonUnit );
