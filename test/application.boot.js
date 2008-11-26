//-------------------------------------------------------------------------------------//
//  -   BOOT THE APP  -
//______________________________________________________________________________________//
jQuery(document).ready(function(){ 
    jQuery('#userAgent').html(navigator.userAgent);
    
    //TEST RUNNERS
    var apiTestSuite = {
        core:           { id:ClaypoolCore$TestSuite,            template:"#ClaypoolCoreTestSuite"},
        logging:        { id:Claypool.Logging$TestSuite,        template:"#ClaypoolLoggingTestSuite"},
        application:    { id:Claypool.Application$TestSuite,    template:"#ClaypoolApplicationTestSuite"},
        ioc:            { id:Claypool.IoC$TestSuite,            template:"#ClaypoolIoCTestSuite"},
        application:    { id:Claypool.MVC$TestSuite,    		template:"#ClaypoolMVCTestSuite"},
        aop:            { id:Claypool.AOP$TestSuite,            template:"#ClaypoolAOPTestSuite"}
    };
    var testsuite;
    for(var namespaceSuite in apiTestSuite){
        testsuite = new Claypool.MoonUnit.NamespaceTestRunner(
            apiTestSuite[namespaceSuite].id
        );
        testsuite.run();
        jQuery(apiTestSuite[namespaceSuite].template).setTemplateElement("testResultsTemplate");
        jQuery(apiTestSuite[namespaceSuite].template).processTemplate(testsuite.summarize());   
    }
    
    //HIDING AND REVEALING
    jQuery( 'div.namespace_tests' ).livequery(function(){
        jQuery(this).bind('click', function(){
            if(!jQuery(this).hasClass('display')){
                var _this = this;
                jQuery(this).toggleClass('display');
                jQuery(".namespace_stats", _this).slideDown();
                jQuery(".namespace_times", _this).slideDown(function(){
                        jQuery(".namespace_results", jQuery(_this).parent()).slideDown();
                    });
            }else{
                var _this = this;
                jQuery(this).toggleClass('display');
                jQuery(".namespace_results", jQuery(_this).parent()).slideUp(function(){
                    jQuery(".namespace_times", _this).slideUp();
                    jQuery(".namespace_stats", _this).slideUp();
                });
            }
        });
    });
    
    jQuery( 'div.class_tests' ).livequery(function(){
        jQuery(this).bind('click', function(){
            if(!jQuery(this).hasClass('display')){
                var _this = this;
                jQuery(this).toggleClass('display');
                jQuery(".class_results", jQuery(_this).parent()).slideDown();
            }else{
                var _this = this;
                jQuery(this).toggleClass('display');
                jQuery(".class_results", jQuery(_this).parent()).slideUp();
            }
        });
    });
    
});
