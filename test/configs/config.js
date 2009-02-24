
(function($, $$){
	$.merge(true, $$.Configuration.ioc, [
        /**
        *   Bells
        */
        {   
            id:"#testClass",
            clazz:"TestClass",
            options:[{
                title:"schmo",
	            foo:"new_foo_value",
        	    bar:{
        	        foobar:"foobar_value"
        	    }
            },1,2,3],
	        inject:{
	            bar:{
        	        foobar:"new_foobar_value",
        	        goopblah:"goopblah_value"
        	    }
        	}
        },
        /**
        *   Whistles
        */
        {   
            id:"#jTestClass",
            clazz:"jQuery.fn.jTestClass",
            selector:"#main",
            options:[{
                title:"Test Title"
            }],
            inject:{
               myenv:"value 0",
               testClass:"ref://#testClass" 
            }
        },
        /**
        *   Bare Bones
        */
        {   id:"#testClassFactory", clazz:"TestClassFactory" },
        /**
        *   Factory Pattern
        */
        {   
            id:"#managedFactoryCreatedTestClass",
            factory:"#testClassFactory",
            options:[{
                preferences:"default"
            },1,2,3]
        },
        /**
        *   Static Factory Pattern
        */
        {   
            id:"#factoryCreatedTestClass",
            factory:"TestClassFactory",
            options:[{
                preferences:"default"
            },1,2,3]
        },
        /**
        *   A Typical Application Managed Instance (Might be reused Reused by the MVC Configuration)
        */
        {   
            id:"#testController",
            clazz:"TestController",
            options:[{
                "preferences":"default"
            }]
        },
        /**
        *   - MVC Flow Fixtures -
        *       These are all used to test the basic MVC flow abilities.
        *       In an of themselves they are particularly uninteresting.
        */
        //Basic test views
        {  id:"#testView01",  clazz:"TestView" , inject:{fixture:"001"}},
        {  id:"#testView02",  clazz:"TestView" , inject:{fixture:"002"}},
        {  id:"#testView03",  clazz:"TestView" , inject:{fixture:"003"}},
        {  id:"#testView04",  clazz:"TestView" , inject:{fixture:"004"}},
        {  id:"#testView05",  clazz:"TestView" , inject:{fixture:"005"}},
        {  id:"#testView06",  clazz:"TestView" , inject:{fixture:"006"}},
        //Basic event contollers
        {  id:"#testEventController01",  clazz:"TestEventController" , inject:{fixture:"001"}},
        {  id:"#testEventController02",  clazz:"TestEventController" , inject:{fixture:"002", viewRef:"#testView02"}},
        {  id:"#testEventController03",  clazz:"TestAsyncEventController" , inject:{fixture:"001"}},
        {  id:"#testEventController04",  clazz:"TestAsyncEventController" , inject:{fixture:"004", viewRef:"#testView04"}},
        {  id:"#testEventController05",  clazz:"TestEventController"      , inject:{fixture:"005"}},
        {  id:"#testEventController06",  clazz:"TestAsyncEventController" , inject:{fixture:"006"}},
        //Basic link contollers
        {  id:"#testLinkController01",   clazz:"TestLinkController"  , inject:{fixture:"001"}},
        {  id:"#testLinkController02",   clazz:"TestLinkController"  , inject:{fixture:"002", viewRef:"#testView02"}},
        {  id:"#testLinkController03",   clazz:"TestAsyncLinkController"  , inject:{fixture:"001"}},
        {  id:"#testLinkController04",   clazz:"TestAsyncLinkController"  , inject:{fixture:"004", viewRef:"#testView04"}},
        {  id:"#testLinkController05",   clazz:"TestLinkController"       , inject:{fixture:"005"}},
        {  id:"#testLinkController06",   clazz:"TestLinkController"       , inject:{fixture:"006"}},
        //Basic form contollers
        {  id:"#testFormController01",   clazz:"TestFormController"  , inject:{fixture:"001"}},
        {  id:"#testFormController02",   clazz:"TestFormController"  , inject:{fixture:"002", viewRef:"#testView02"}},
        {  id:"#testFormController03",   clazz:"TestAsyncFormController"  , inject:{fixture:"001"}},
        {  id:"#testFormController04",   clazz:"TestAsyncFormController"  , inject:{fixture:"004", viewRef:"#testView04"}},
        {  id:"#testFormController05",   clazz:"TestFormController"       , inject:{fixture:"005"}},
        {  id:"#testFormController06",   clazz:"TestFormController"       , inject:{fixture:"006"}},
        {  id:"#testAdvisor01",   clazz:"TestAdvisor"  , inject:{fixture:"013"}},
        {  id:"#testAdvisor02",   clazz:"TestAdvisor"  , inject:{fixture:"014"}},
        {  id:"#testAdvisor03",   clazz:"TestAdvisor"  , inject:{fixture:"015"}},
        {  id:"#aopTestClass02",  clazz:"TestAdvisor"  , inject:{fixture:"016"}},
        {  id:"#aopTestClass03",  clazz:"TestAdvisor"  , inject:{fixture:"017"}}
    ]);
})(jQuery, Claypool);

