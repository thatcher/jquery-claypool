/**
*   Claypool.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
(function($, $$){
	
Claypool.Core$TestSuite = {
    namespace    :    "Claypool",
    description  :   "Claypool core contains basic interfaces, utility and simple implementations \
                        of commonly used functions and patterns.",
    staticMethodTests   :    [
        {
            method       :   "$",
            description  :   "Convenient accessor for the Application Context.",
            test          :   function(){ this.expect(1); 
                var appContext = $$.Application.getContext();
                appContext.put("abcdefg1234567", {fixture: "0987654zyxwvut"});
                this.assertSame(
                    $.$("abcdefg1234567"),
                    $$.Application.getContext().get("abcdefg1234567"),
                    "The aliased functions must return the same result."
                );
            }
        },
        {
            method       :   "guid",
            description  :   "Convenient generator for a unique id in local memory space.",
            test          :   function(){
                this.expect(3);
                var guid = $.guid();
                this.assertNotNull(guid, "The created GUID is not null.");
                this.assertDefined(guid, "The created GUID is not undefined.");
                var anotherGuid = $.guid();
                this.assertNotEqual(anotherGuid, guid, "Sequentially created guids are not equal");
            }
        },
        {
            method       :   "resolve",
            description  :   "Resolves namespaced objects from a string",
            setup         :   function(){
                // Put a namespaced object in global scope
                this.logger.debug("Creating fixture namespace.");
                var fixture = function(){
                    this["ClaypoolTestNS"] = {
                        InnerNS : { a: "string fixture" }
                    };
                }; fixture.call(null);
            },
            test          :   function(){
                this.expect(5);
                this.assertSame(
                    ClaypoolTestNS, 
                    $.resolve("ClaypoolTestNS"), 
                    "No-Namespace name is resolved."
                );
                this.assertSame(
                    ClaypoolTestNS.InnerNS, 
                    $.resolve("ClaypoolTestNS.InnerNS"),
                    "Nested Namespace is resolved."
                );
                this.assertSame(
                    "string fixture",
                    $.resolve("ClaypoolTestNS.InnerNS.a"),
                    "Namespaced properties can be resolved"
                );
                this.assertUndefined(
                    $.resolve("ClaypoolTestNS.InnerNS.h"), 
                    "Undefined properties of a namespace return undefined."
                );
                this.assertUndefined(
                    $.resolve("ClaypoolTestNS.InnerNS.h.i"), 
                    "Undefined properties of a undefined namespace return undefined."
                );
            },
            teardown      :   function(){
                 // Put a namespaced object in global scope
                 this.logger.debug("Removing fixture namespace.");
                 var fixture = function(){
                     delete this["ClaypoolTestNS"];
                 };  fixture.call(null);
            }
        }
       
    ],
    classTests         :[
        {
            $class    : "Claypool.CachingStrategy$Interface",
            methodTests       : [
                //Interface Behavior
                {
                    method       :   "add",
                    description  :   "Cannot use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        try{
                            $$.CachingStrategy$Interface.add();
                            this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                            this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                },
                //Interface Behavior
                {
                    method       :   "remove",
                    description  :   "Cannot use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        try{
                            $$.CachingStrategy$Interface.remove();
                            this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                            this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                },
                //Interface Behavior
                {
                    method       :   "find",
                    description  :   "Cannot use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        try{
                            $$.CachingStrategy$Interface.find();
                            this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                            this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                },
                //Interface Behavior
                {
                    method       :   "clear",
                    description  :   "Cannot use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        try{
                            $$.CachingStrategy$Interface.clear();
                            this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                            this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                }
            ]
        },
        /**
        *   Claypool.SimpleCachingStrategy
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.SimpleCachingStrategy",
            methodTests       : [
                //SimpleCacheCreationTest 
                {
                    method           :   "constructor",
                    description      :   "Creating a Cache with the SimpleCachingStrategy.",
                    test              :   function(){
                        this.expect(5);
                        var simpleCache = new $$.SimpleCachingStrategy();
                        this.assertTrue(simpleCache, "The SimpleCachingStrategy can be created.");
                        this.assertTrue($.isFunction(simpleCache.add),     "The cache exposes the method | add |");
                        this.assertTrue($.isFunction(simpleCache.remove),  "The cache exposes the method | remove |");
                        this.assertTrue($.isFunction(simpleCache.find),    "The cache exposes the method | find |");
                        this.assertTrue($.isFunction(simpleCache.clear),   "The cache exposes the method | clear |");
                    }
                }, 
                //AddingToSimpleCacheTest
                {
                    method       :   "add",
                    description  :   "Adding to a Simple Cache",
                    test          :   function(){
                        this.expect(5);
                        var simpleCache = new $$.SimpleCachingStrategy();
                        this.assertEqual(0, simpleCache.size, "The new simple cache should be empty");
                        var successfullyAdded = simpleCache.add("simpleCacheAddTest00","string");
                        this.assertTrue(successfullyAdded, "Able to add an item to the empty cache");
                        this.assertEqual(1, simpleCache.size, "The simple cache should now have an item.");
                        var successfullyOverWrote = simpleCache.add("simpleCacheAddTest00","anotherString");
                        this.assertTrue(!successfullyOverWrote, "Not able to over write an item to the cache (requires remove)");
                        this.assertEqual(1, simpleCache.size, "The simple cache should still have one item.");
                    }
                },
                //RemovingFromSimpleCacheTest
                {
                    method       :   "remove",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                        this.expect(2);
                        var simpleCache = new $$.SimpleCachingStrategy();
                        simpleCache.add("simpleCacheAddTest00","string");
                        var successfullyRemoved = simpleCache.remove("simpleCacheAddTest00");
                        this.assertTrue(successfullyRemoved===0, "Removing should return the size of the cache value if successful.");
                        var successfullyRemovedTwice = simpleCache.remove("simpleCacheAddTest00");
                        this.assertTrue(successfullyRemovedTwice===null, "Removing should return a null value if it fails.");
                    }
                },
                //FindingInSimpleCacheTest
                {
                    method       :   "find",
                    description  :   "Retreiving items from the SimpleCache",
                    test          :   function(){
                        this.expect(2);
                        var simpleCache = new $$.SimpleCachingStrategy();
                        simpleCache.add("simpleCacheAddTest00","test string");
                        var valueFromCache = simpleCache.find("simpleCacheAddTest00");
                        this.assertEqual("test string", valueFromCache, "The expected object was returned from the cache.");
                        var valueNotInCache = simpleCache.find("simpleCacheAddTest01");
                        this.assertTrue(valueNotInCache===null, "The id does not exist so null was returned from the cache.");
                    }
                },
                //ClearingSimpleCacheTest
                {
                    method       :   "clear",
                    description  :   "Clearing the cache resets it.",
                    test          :   function(){
                        this.expect(1);
                        var simpleCache = new $$.SimpleCachingStrategy();
                        simpleCache.add("simpleCacheAddTest00","test string");
                        simpleCache.clear();
                        for( var item in simpleCache.cache ){
                            this.fail("Internal cache is not reset to an empty object.");
                            break;
                        }
                        this.assertTrue(simpleCache.size===0,  "Internal size variable is reset to 0.");
                    }
                }
            ]
        },
        /**
        *   Claypool.Router
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.Router",
            methodTests       : [
                //RouterCreationTest
                {
                    method       :   "constructor",
                    description  :   "A Router can be succesfully created.",
                    test          :   function(){
                        this.expect(1);
                        var router = new $$.Router();
                        this.assertTrue(router, "The Router was successfully created (with no args).");
                    }
                },
                //RouterCompileTest
                {
                    method       :   "compile",
                    description  :   "Compiling a router is successful.",
                    test          :   function(){
                        this.expect(2);
                        var fixtures = [
                            { url:"/aaa",   a:0, b:1 },
                            { url:"/aaa/b", a:2, b:3 },
                            { event:"aaab", a:4, b:5 },
                            { other:"aaac", a:6, b:7 }
                        ];
                        var router = new $$.Router();
                        var result = router.compile(fixtures, "url|event");
                        this.assertTrue(result===router, "When successfully compiled the router returns itself.");
                        this.assertTrue(router.size===3, "The expected number of patterns where compiled.");
                    }
                },
                //RouteToFirstMatchTest
                {
                    method       :   "first",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                        this.expect(2);
                        var fixtures = [
                            { url:".",   a:0, b:1 },//any url
                            { url:"[a]", a:2, b:3 },//contains 'a'
                            { event:"aaab", a:4, b:5 },
                            { other:"aaac", a:6, b:7 }
                        ];
                        var router = new $$.Router();
                        router.compile(fixtures, "url|event");
                        var route = router.first("/abc.html");
                        this.assertTrue(route.length===1, "Router should return the first matching route.");
                        this.assertTrue(route[0].payload&&route[0].payload.a===0, "First matched routed has the anticipated payload.");
                    }
                },
                //RouteToAllMatchTest
                {
                    method       :   "all",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                        this.expect(3);
                        var fixtures = [
                            { url:".",   a:0, b:1 },//any url
                            { url:"[a]", a:2, b:3 },//contains 'a'
                            { event:"aaab", a:4, b:5 },
                            { other:"aaac", a:6, b:7 }
                        ];
                        var router = new $$.Router();
                        router.compile(fixtures, "url|event");
                        var route = router.all("/abc.html");
                        this.assertTrue(route.length===2, "Router should return the first matching route.");
                        this.assertTrue(route[0].payload&&route[0].payload.a===0, "First matched routed has the anticipated payload.");
                        this.assertTrue(route[1].payload&&route[1].payload.a===2, "Second matched routed has the anticipated payload.");
                    }
                }
            ]
        },
        /**
        *   Claypool.AbstractContext
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.Context",
            methodTests       : [
                //AbstractContextCreationTest
                {
                    method       :   "constructor",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                        this.expect(1);
                        var abstractContext = new $$.Context();
                        this.assertTrue(abstractContext, "The context was successfully created (with no args).");
                    }
                },
                //AbstractContextPutTest
                {
                    method       :   "put",
                    description  :   "Can't use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        var abstractContext = new $$.Context();
                        try{
                           abstractContext.put("Any Value");
                           this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                },
                //AbstractContextGetTest
                {
                    method       :   "get",
                    description  :   "Can't use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        var abstractContext = new $$.Context();
                        try{
                           abstractContext.get("Any Value");
                           this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                }
            ]
        },
        /**
        *   Claypool.ContextContributor
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.ContextContributor",
            methodTests       : [
                //ContextContibutorCreationTest
                {
                    method       :   "constructor",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                        this.expect(1);
                        var contextContibutor = new $$.ContextContributor();
                        this.assertTrue(contextContibutor, "The ContextContributor can be successfully created.");
                    }
                },
                //RegisterContextContibutorTest
                {
                    method       :   "registerContext",
                    description  :   "Can't use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        var contextContibutor = new $$.ContextContributor();
                        try{
                            contextContibutor.registerContext("Any Value");
                            this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                            this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                }
            ]
        },
        /**
        *   Claypool.BaseFactory
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.BaseFactory",
            methodTests       : [
                //BaseFactoryCreationTest
                {
                    method       :   "constructor",
                    description  :   "A BaseFactory can be successfully created.",
                    test          :   function(){
                        this.expect(1);
                        var baseFactory = new $$.BaseFactory();
                        this.assertNotNull(baseFactory, "A BaseFactory can be successfully created.");
                    }
                },
                //LoadConfigurationTest
                {
                    method       :   "loadConfig",
                    description  :   "Claypool can load dynamically via AJAX when Claypool.Configuration "+
                                        "is unavailable.",
                    test          :   function(){
                        this.expect(4);
                        var baseFactory = new $$.BaseFactory({
                            configurationUrl:   "data/baseFactoryTest.js",
                            configurationId :   "baseFactoryLoadTest"
                        });
                        var _this = this;
                        baseFactory.loadConfig({
                        	//url://could also pass url explicitly
                        	callback: function(){
		                        _this.assertNotNull($$.Configuration.baseFactoryLoadTest, "The Configuration Section was defined.");
		                        _this.assertEqual($$.Configuration.baseFactoryLoadTest.a, 1, "The Configuration was set.");
		                        _this.assertEqual($$.Configuration.baseFactoryLoadTest.b, 2, "The Configuration was set.");
		                        _this.assertEqual($$.Configuration.baseFactoryLoadTest.c, 3, "The Configuration was set.");
	                        }
	                    });
                    }
                },
                //GetConfigurationTest
                {
                    method       :   "getConfig",
                    description  :   "Retreives the current configuration or tries to load it then return it.",
                    test          :   function(){
                        this.expect(4);
                        var baseFactory = new $$.BaseFactory();
                        baseFactory.setConfig("baseFactoryTest", {a:1,b:2,c:3});
                        this.assertNotNull(baseFactory.getConfig(), "The Configuration Section was defined.");
                        this.assertEqual(baseFactory.getConfig().a, 1, "The Configuration was set.");
                        this.assertEqual(baseFactory.getConfig().b, 2, "The Configuration was set.");
                        this.assertEqual(baseFactory.getConfig().c, 3, "The Configuration was set.");
                    }
                },
                //SetConfigurationTest
                {
                    method       :   "setConfig",
                    description  :   "Explicity sets a part of the Claypool.Configuration.",
                    test          :   function(){
                        this.expect(4);
                        var baseFactory = new $$.BaseFactory();
                        baseFactory.setConfig("baseFactoryTest", {a:1,b:2,c:3});
                        this.assertNotNull(Claypool.Configuration.baseFactoryTest, "The Configuration Section was defined.");
                        this.assertEqual(Claypool.Configuration.baseFactoryTest.a, 1, "The Configuration was set.");
                        this.assertEqual(Claypool.Configuration.baseFactoryTest.b, 2, "The Configuration was set.");
                        this.assertEqual(Claypool.Configuration.baseFactoryTest.c, 3, "The Configuration was set.");
                    }
                },
                //AbstractUpdateConfiguratationTest
                {
                    method       :   "updateConfig",
                    description  :   "Can't use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        var baseFactory = new $$.BaseFactory();
                        try{
                           baseFactory.updateConfig();
                           this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                },
                //AbstractCreateTest
                {
                    method       :   "create",
                    description  :   "Can't use interface unless the implementation is provided.",
                    test          :   function(){
                        this.expect(1);
                        var baseFactory = new $$.BaseFactory();
                        try{
                           baseFactory.create();
                           this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                        }
                    }
                }
            ]
        },
        /**
        *   Claypool.Error
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.Error",
            methodTests       : [
                //CatchClaypoolErrorTest
                {
                    method       :   "constructor",
                    description  :   "The Error can be created, thrown and hierarchicaly identified.",
                    test          :   function(){
                        this.expect(1);
                        try{
                           throw new $$.Error();
                           this.fail("Expected Claypool.Error");
                        }catch(e){
                           this.assertTrue(e.name.match("Claypool.Error"), "Can match error as Claypool.Error");
                        }
                    }
                }
            ]
        },
        /**
        *   Claypool.MethodNotImplementedError
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.MethodNotImplementedError",
            methodTests       : [
                //constructor
                {
                    method        :   "constructor",
                    description   :   "The Error can be created, thrown and hierarchicaly identified.",
                    test           :   function(){
                        this.expect(2);
                        try{
                           throw new $$.MethodNotImplementedError();
                           this.fail("Expected Claypool.MethodNotImplementedError");
                        }catch(e){
                           this.assertTrue(e.name.match("Claypool.Error"),               "Can match error as Claypool.Error");
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"),  "Can match error as Claypool.MethodNotImplementedError");
                        }
                    }
                }
            ]
        },
        /**
        *   Claypool.ConfigurationError
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.ConfigurationError",
            methodTests       : [
                //constructor
                {
                    method        :   "constructor",
                    description   :   "The Error can be created, thrown and hierarchicaly identified.",
                    test           :   function(){
                        this.expect(2);
                        try{
                           throw new $$.ConfigurationError();
                           this.fail("Expected Claypool.ConfigurationError");
                        }catch(e){
                           this.assertTrue(e.name.match("Claypool.Error"),               "Can match error as Claypool.Error");
                           this.assertTrue(e.name.match("Claypool.ConfigurationError"),  "Can match error as Claypool.ConfigurationError");
                        }
                    }
                }
            ]
        },
        /**
        *   Claypool.NameResolutionError
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class    : "Claypool.NameResolutionError",
            methodTests       : [
                //constructor
                {
                    method       :   "constructor",
                    description  :   "The Error can be created, thrown and hierarchicaly identified.",
                    test          :   function(){
                        this.expect(2);
                        try{
                           throw new $$.NameResolutionError();
                           this.fail("Expected Claypool.NameResolutionError");
                        }catch(e){
                           this.assertTrue(e.name.match("Claypool.Error"), "Can match error as Claypool.Error");
                           this.assertTrue(e.name.match("Claypool.NameResolutionError"), "Can match error as Claypool.NameResolutionError");
                        }
                    }
                }
            ]
        }
    ]
};
})(jQuery, Claypool);