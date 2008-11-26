/**
*   Claypool.AOP.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
(function($){
	Claypool.AOP$TestSuite = {
	    "@namespace"    :    "Claypool.AOP",
	    "@description"  :   "Claypool.AOP provides Aspects and AspectFactories for creating Aspects "+
	                        "programmatically or wired via configuration.",
	    "staticMethodTests"   :    [
	        
	    ],
	    "classTests"            :   [
	        /**
	        *   Claypool.AOP.Container
	        *
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"        :   "Claypool.AOP.Container$Class",
	            "methodTests"   :  [
	                // AOPContainerCreationTest 
	                {
	                    "@method"           :   "Claypool.AOP.Container$Class.constructor",
	                    "@description"      :   "AOP Container can be instantiated.",
	                    "@summary"          :   "When the Claypool.AOP.Container is instantiated, it should "+
	                                            "read in the configuration without failure.  Because Aspects "+
	                                            "are Eagerly applied, there is substantial room for error.",
	                    "@commonErrors"     :   "Common errors include applying Aspects to Classes that can't "+
	                                            "be found in the Global Scope as well as Generic Instances that "+
	                                            "can't be found at the Global Scope.",
	                    "test"            :   function(){
	                        this.expect(4);
	                        var aopContainer = new $.AOP.Container();
	                        this.assertNotNull(aopContainer, "The AOP Container was created with a no arg constructor.");
	                        this.assertTrue($.isFunction(aopContainer.registerContext),     
	                            "The aop container exposes the method | registerContext |"+
	                            "(inherited from Claypool.Application.ApplicationContextContributor)");
	                        this.assertTrue($.isFunction(aopContainer.get),  
	                            "The aop container exposes the method | get |"+
	                            "(inherited from Claypool.Application.ApplicationContextContributor)");
	                        this.assertTrue($.isFunction(aopContainer.put),    
	                            "The aop container exposes the method | put |"+
	                            "(inherited from Claypool.Application.ApplicationContextContributor)");
	                    }
	                },{
	                    "@method"           :   "Claypool.AOP.Container$Class.get",
	                    "@description"      :   "Retreives the managed object, creating it if need be.",
	                    "@summary"          :   "This test verifies that  the AOP container will retrieve the \
	                                            object, will propagate unexpected errors or will return null \
	                                            if the object doesnt exist.",
	                    "@commonErrors"     :   "If the configuration is malformed the exception will bubble up through \
	                                            the container, or if the managed object throws an unexpected error in its \
	                                            creation lifecycle, it will bubble up to the ioc container.",
	                    "setup"             :   function(){
	                        Claypool.TestFixture = function(){};
	                        $.merge( $.Configuration.ioc, [{
	                        	id:"testFixture", clazz:"Claypool.TestFixture"
	                        }]); $.merge($.Configuration.aop , [{
                                "id"        :"testAspect00",
                                "target"    :"TestFixture",
                                "after"     :"fixtureFunction00",
                                "advice"    :"TestAdvice"
                            }]);
                            $.merge($.Configuration.ioc , [
                                {id:"testFixtureTarget", clazz:"TestFixture2"}
                            ]);
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(testRunner){
                                return { testRunner:testRunner, fixture: "00" };   
                            };
                            TestFixture.prototype.fixtureFunction01 = function(testRunner){
                                return { testRunner:testRunner, fixture: "01" };    
                            };
                            TestAdvice = function(retVal){
                                retVal.testRunner.assertTrue(true,  "The After Aspect was applied as expected.");
                            };
	                    },
	                    "test"              :   function(){
	                        this.expect(2);
	                        var container = new $.AOP.Container();
	                        var testFixture = container.get("testAspect00");
	                        this.assertNotNull(testFixture, "Expected object created and returned.");
	                        var nullFixture = container.get("nullFixture");//doesnt exist in ioc container
	                        this.assertNull(nullFixture, "Expected null value returned.");
	                    },
	                    "teardown"          :    function(){
	                        $.Configuration.aop = [];
	                        $.Configuration.ioc = [];
	                        delete Claypool.TestFixture;
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                }
	            ]
	        },
	         /**
	        *   Claypool.AOP.Factory
	        *
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"        :   "Claypool.AOP.Factory$Class",
	            "methodTests"   :  [
	                // AspectFactoryCreationTest 
	                {
	                    "@method"           :   "Claypool.AOP.Factory$Class.constructor",
	                    "@description"      :   "AspectFactory can be instantiated.",
	                    "@summary"          :   "When the Claypool.AOP.Factory is created it ",
	                    "@commonErrors"     :   "Common errors include applying Aspects to Classes that can't "+
	                                            "be found in the Global Scope as well as Generic Instances that "+
	                                            "can't be found at the Global Scope.",
	                    "test"            :   function(){
	                        this.expect(1);
	                        var aopFactory =  new $.AOP.Factory();
	                        this.assertNotNull(aopFactory, "The AOP Factory was created with a no arg constructor.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.AOP.Factory$Class.create",
	                    "@description"      :   "AspectFactory can create aspects.",
	                    "@summary"          :   "",
	                    "@commonErrors"     :   "Common errors include applying Aspects to Classes that can't "+
	                                            "be found in the Global Scope as well as Generic Instances that "+
	                                            "can't be found at the Global Scope.",
	                    "setup"             :   function(){
	                    	var _this = this;
	                        this.logger.debug("Creating fixture classes.");
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(){
                                return "00";    
                            }; 
                            TestAdvice = function(returnValue){
	                            _this.assertEqual(returnValue, "00", "The After Aspect captured the expected return value");
                            };
                            $.merge($.Configuration.aop, [{
                            	id:"#testAspect",
                            	target:	"TestFixture",
                            	after: "fixtureFunction00",
                            	advice: "TestAdvice",
                            }]);
	                    },
	                    "test"            :   function(){
	                        this.expect(2);
	                        var _this = this;
	                        var aopFactory =  new $.AOP.Factory();
	                        //Beacuse the aspect is across an entire class of objects
	                        //the aspect is created at configuration time.
	                        aopFactory.updateConfig();
	                        //The aspect already exists but this will retreive it.
	                        var aspect = aopFactory.create("#testAspect");
	                        this.assertNotNull(aspect, "The aspect was created without error.");
	                        var testFixture = new TestFixture();
	                        testFixture.fixtureFunction00();
	                    },
	                    "teardown"      :       function(){
	                    	$.Configuration.aop = [];
	                        delete TestFixture;
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.AOP.Factory$Class.updateConfig",
	                    "@description"      :   "AspectFactory can be configured successfully",
	                    "@summary"          :   "",
	                    "@commonErrors"     :   "Common errors include applying Aspects to Classes that can't "+
	                                            "be found in the Global Scope as well as Generic Instances that "+
	                                            "can't be found at the Global Scope.",
	                    "setup"             :   function(){
	                        // Put a class object in global scope
	                        this.logger.debug("Creating fixture class.");
                            $.merge($.Configuration.aop , [{
                                "id"        :"testAspect00",
                                "target"    :"TestFixture",
                                "after"     :"fixtureFunction00",
                                "advice"    :"TestAdvice"
                            },{
                                "id"        :"testAspect01",
                                "target"    :"ref://testFixtureTarget",
                                "after"     :"fixtureFunction(\\w)+",
                                "advice"    :"TestNS.TestAdvice"
                            }]);
                            $.merge($.Configuration.ioc , [
                                {id:"testFixtureTarget", clazz:"TestFixture2"}
                            ]);
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(testRunner){
                                return { testRunner:testRunner, fixture: "00" };   
                            };
                            TestFixture.prototype.fixtureFunction01 = function(testRunner){
                                return { testRunner:testRunner, fixture: "01" };    
                            };
                            TestFixture2 = function(){};
                            TestFixture2.prototype.fixtureFunction00 = function(testRunner){
                                return { testRunner:testRunner, fixture: "00" };   
                            };
                            TestFixture2.prototype.fixtureFunction01 = function(testRunner){
                                testRunner.assertTrue(true,  "The pointcut was applied as expected.");
                                return { testRunner:testRunner, fixture: "01" };    
                            };
                            TestAdvice = function(retVal){
                                retVal.testRunner.assertTrue(true,  "The After Aspect was applied as expected.");
                            };
                            TestNS = { TestAdvice : function(retVal){
                                retVal.testRunner.assertTrue(true,  "The After Aspect was applied as expected.");
                            }};
	                             
	                    },
	                    "test"            :   function(){
	                        this.expect(4);
	                        $.Application.Initialize();
	                        
	                        var _this = this;
	                        var testFixture = new TestFixture();
	                        testFixture.fixtureFunction00(this);
	                        testFixture.fixtureFunction01(this);
	                        
	                        //  boots ioc container so we can test aspects that are proxied onto
	                        //  container managed objects
	                        var testFixtureTarget = $.$("testFixtureTarget");
	                        
	                        testFixtureTarget.fixtureFunction00(this);
	                        testFixtureTarget.fixtureFunction01(this);
	                    },
	                    "teardown"      :       function(){
	                        $.Configuration.aop = $.Configuration.ioc = [];
	                        delete TestFixture;
	                        delete TestFixture2;
	                        delete TestAdvice;
	                        delete TestNS;
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.AbstractAspect
	        *
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"        :   "Claypool.AOP.Aspect$Abstract",
	            "methodTests"   :  [
	                // AbstractAspectCreationTest 
	                {
	                    "@method"           :   "Claypool.AOP.Aspect$Abstract.constructor",
	                    "@description"      :   "AOP Abstract Aspect can be instantiated.",
	                    "@summary"          :   "The AbstractAspect provides the basic functionality common to "+
	                                            "all Aspects and holds the Aspects configuration as well.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "test"              :   function(){
	                        this.expect(1);
	                        var abstractAspect = new $.AOP.Aspect();
	                        this.assertTrue(abstractAspect, "The AbstractAspect was successfully created (with no args).");
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                // AbstractAspectWeaveTest 
	                {
	                    "@method"           :   "Claypool.AOP.Aspect$Abstract.weave",
	                    "@description"      :   "Abstract Aspect weave will fail because |advise| is not implemented.",
	                    "@summary"          :   "The AbstractAspect provides the generic implementation of a weave. "+
	                                            "However the weave requires member |pointcut| to be defined otherwise"+
	                                            "it simply returns.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    setup             :   function(){
	                        
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(testRunner){
                                return { testRunner:testRunner, fixture: "00" };   
                            };
                            TestFixture.prototype.fixtureFunction01 = function(testRunner){
                                return { testRunner:testRunner, fixture: "01" };    
                            };
                            TestAdvice = function(retVal){
                                retVal.testRunner.assertTrue(true,  "The After Aspect was applied as expected.");
                            };
	                             
	                    },
	                    test              :   function(){
	                        this.expect(1);
	                        var abstractAspect = new $.AOP.Aspect({
	                        	target: TestFixture,
	                        	method: "fixtureFunction00" 
	                        });
	                        try{
	                           abstractAspect.weave();
	                           this.fail("Expected Claypool.MethodNotImplementedError");
	                        }catch(e){
	                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
	                        }
	                    
	                    },
	                    teardown      :       function(){
	                        $.Configuration.aop = $.Configuration.ioc = [];
	                        delete TestFixture;
	                        delete TestAdvice;
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                // AbstractAspectUnweaveTest 
	                {
	                    "@method"           :   "Claypool.AOP.Aspect$Abstract.unweave",
	                    "@description"      :   "Abstract Aspect unweave will fail because |advise| is not implemented.",
	                    "@summary"          :   "The AbstractAspect provides the generic implementation of an unweave. "+
	                                            "Becuase an AbstractAspect can't be woven, the unweave simply returns true "+
	                                            "to flag that no error occured.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "test"              :   function(){
	                        this.expect(1);
	                        var abstractAspect = new $.AOP.Aspect();
	                        this.assertTrue(abstractAspect.unweave(), "Unweaving an empty  an AbstractAspect should return true.");
	                    
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                // AbstractAspectAdviseTest 
	                {
	                    "@method"           :   "Claypool.AOP.Aspect$Abstract.advise",
	                    "@description"      :   "Abstract Aspect weave will fail because |advise| is not implemented.",
	                    "@summary"          :   "The AbstractAspect provides the signature |advise|.  This method "+
	                                            "needs to be implemented by each different type of Aspect.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "test"              :   function(){
	                        this.expect(1);
	                        var abstractAspect = new $.AOP.Aspect();
	                        try{
	                           abstractAspect.advise();
	                           this.fail("Expected Claypool.MethodNotImplementedError");
	                        }catch(e){
	                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
	                        }
	                    
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.After
	        *
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"        :   "Claypool.AOP.After$Class",
	            "methodTests"   :  [
	                // AfterAspectCreationTest 
	                {
	                    "@method"           :   "Claypool.AOP.After$Class.constructor",
	                    "@description"      :   "After Aspect can be instantiated.",
	                    "@summary"          :   "The After Aspect will provide access to a functions results.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "test"              :   function(){
	                        this.expect(1);
	                        var afterAspect = new $.AOP.After();
	                        this.assertTrue(afterAspect, "The AbstractAspect was successfully created (with no args).");
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                // AfterWeaveTest 
	                {
	                    "@method"           :   "Claypool.AOP.After$Class.advise",
	                    "@description"      :   "AOP After Aspect can be weaved.",
	                    "@summary"          :   "The After Aspect provides access to the return value of the "+ 
	                                            "function it was weaved onto.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "setup"             :   function(){
	                        // Put a class object in global scope
	                        this.logger.debug("Creating fixture class.");
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(){
                                return "00";    
                            };
	                    },
	                    "test"              :   function(){
	                        var _this = this;
	                        this.expect(1);
	                        var afterAspect = new $.AOP.After({
	                            target:TestFixture,
	                            after:"fixtureFunction00",
	                            advice: function(returnValue){
	                                _this.assertEqual(returnValue, "00", "The After Aspect captured the expected return value");
	                            }
	                        });
	                        afterAspect.weave();
	                        var fixtureInstance = new TestFixture();
	                        fixtureInstance.fixtureFunction00();
	                    },
	                    "teardown"      :       function(){
	                        delete TestFixture;
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.Before
	        *
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"        :   "Claypool.AOP.Before$Class",
	            "methodTests"   :  [
	                // BeforeAspectCreationTest 
	                {
	                    "@method"           :   "Claypool.AOP.Before$Class.constructor",
	                    "@description"      :   "Before Aspect can be instantiated.",
	                    "@summary"          :   "The Before Aspect will provide access to a functions call args.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "test"              :   function(){
	                        this.expect(1);
	                        var beforeAspect = new $.AOP.Before();
	                        this.assertTrue(beforeAspect, "The Before Aspect was successfully created (with no args).");
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                // BeforeWeaveTest 
	                {
	                    "@method"           :   "Claypool.AOP.Before$Class.advise",
	                    "@description"      :   "AOP Before Aspect can be weaved.",
	                    "@summary"          :   "The Before Aspect provides access to the call arguments of the "+ 
	                                            "function it was weaved onto.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "setup"             :   function(){
	                        // Put a class object in global scope
	                        this.logger.debug("Creating fixture class.");
	                        TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(){
                                return null;    
                            };  
                            
	                    },
	                    "test"              :   function(){
	                        var _this = this;
	                        this.expect(1);
	                        var beforeAspect = new $.AOP.Before({
	                            target:TestFixture,
	                            before:"fixtureFunction00",
	                            advice: function(){
	                                _this.assertEqual(arguments[0], "00", "The Before Aspect captured the expected return value");
	                            }
	                        });
	                        beforeAspect.weave();
	                        var fixtureInstance = new TestFixture();
	                        fixtureInstance.fixtureFunction00("00");
	                    },
	                    "teardown"      :       function(){
	                        delete TestFixture;
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.Around
	        *
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"        :   "Claypool.AOP.Around$Class",
	            "methodTests"   :  [
	                // BeforeAspectCreationTest 
	                {
	                    "@method"           :   "Claypool.AOP.Around$Class.constructor",
	                    "@description"      :   "Around Aspect can be instantiated.",
	                    "@summary"          :   "The Around Aspect will provide access to a functions call args "+
	                                            "and return value",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "test"              :   function(){
	                        this.expect(1);
	                        var aroundAspect = new $.AOP.Around();
	                        this.assertTrue(aroundAspect, "The Around Aspect was successfully created (with no args).");
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                // BeforeWeaveTest 
	                {
	                    "@method"           :   "Claypool.AOP.Around$Class.advise",
	                    "@description"      :   "AOP Around Aspect can be weaved.",
	                    "@summary"          :   "The Around Aspect provides access to the call arguments and "+
	                                            "return value of the function it was weaved onto.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source " +
	                                            "is actually included correctly.  Please use firefox+firebug "+
	                                            "to ensure that the source was downloaded properly.",
	                    "setup"             :   function(){
	                        // Put a class object in global scope
	                        this.logger.debug("Creating fixture class.");
	                        TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(){
                                return "01";    
                            };  
	                    },
	                    "test"              :   function(){
	                        var _this = this;
	                        this.expect(2);
	                        var aroundAspect = new $.AOP.Around({
	                            target:TestFixture,
	                            around:"fixtureFunction00",
	                            advice: function(invocation){
	                                _this.assertEqual(invocation.arguments[0], "00", "The Around Aspect captured the argument");
	                                var returnVal = invocation.proceed();//must be called for aspect to continue
	                                _this.assertEqual(returnVal, "01", "The Around Aspect captured the return value");
	                            }
	                        });
	                        aroundAspect.weave();
	                        var fixtureInstance = new TestFixture();
	                        fixtureInstance.fixtureFunction00("00");
	                    },
	                    "teardown"      :       function(){
	                        delete TestFixture;
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.ContainerError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.AOP.ContainerError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.AOP.ContainerError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(2);
							try{
							   throw new $.AOP.ContainerError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.AOP.ContainerError"),  
							                    "Can match error as Claypool.AOP.ContainerError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.ConfigurationError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.AOP.ConfigurationError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.AOP.ConfigurationError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(3);
							try{
							   throw new $.AOP.ConfigurationError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.ConfigurationError"),  
							                    "Can match error as Claypool.ConfigurationError");
							   this.assertTrue(e.name.match( "Claypool.AOP.ConfigurationError"),  
							                    "Can match error as Claypool.AOP.ConfigurationError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.AspectFactoryError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.AOP.FactoryError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.AOP.FactoryError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(2);
							try{
							   throw new $.AOP.FactoryError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.AOP.FactoryError"),  
							                    "Can match error as Claypool.AOP.FactoryError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.AspectFactoryError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.AOP.WeaveError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.AOP.WeaveError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(2);
							try{
							   throw new $.AOP.WeaveError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.AOP.WeaveError"),  
							                    "Can match error as Claypool.AOP.WeaveError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.AOP.AspectError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.AOP.AspectError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.AOP.AspectError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(2);
							try{
							   throw new $.AOP.AspectError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.AOP.AspectError"),  
							                    "Can match error as Claypool.AOP.AspectError");
							}
	                    }
	                }
	            ]
	        }
	    ]
	};
})(jQuery);