//-------------------------------------------------------------------------------------//
//  -   BOOT THE APP  -
//______________________________________________________________________________________//
(function($){
    $(document).ready(function(){ 
        $('#userAgent').html(navigator.userAgent);
        
        //TEST RUNNERS
        $.testapi({
            core:           { id:Claypool.Core$TestSuite,           template:"#ClaypoolCoreTestSuite"},
            logging:        { id:Claypool.Logging$TestSuite,        template:"#ClaypoolLoggingTestSuite"},
            application:    { id:Claypool.Application$TestSuite,    template:"#ClaypoolApplicationTestSuite"},
            ioc:            { id:Claypool.IoC$TestSuite,            template:"#ClaypoolIoCTestSuite"},
            application:    { id:Claypool.MVC$TestSuite,    		template:"#ClaypoolMVCTestSuite"},
            aop:            { id:Claypool.AOP$TestSuite,            template:"#ClaypoolAOPTestSuite"}
        });
        
    });
})(jQuery);
