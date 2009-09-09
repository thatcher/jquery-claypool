/**
*   Claypool.AOP.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
(function($, $$, $$AOP){
    Claypool.AOP$TestSuite = {
        namespace    :    "Claypool.AOP",
        description  :   "Claypool.AOP provides Aspects and AspectFactories for creating Aspects "+
                            "programmatically or wired via configuration.",
        staticMethodTests   :    [
            
        ],
        classTests            :   [
            /**
            *   Claypool.AOP.Container
            *
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class        :   "Claypool.AOP.Container",
                methodTests   :  [
                    // AOPContainerCreationTest 
                    {
                        method           :   "constructor",
                        description      :   "AOP Container can be instantiated.",
                        test            :   function(){
                            this.expect(4);
                            var aopContainer = new $$AOP.Container();
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
                        method           :   "get",
                        description      :   "Retreives the managed object, creating it if need be.",
                        setup             :   function(){
                            Claypool.TestFixture = function(){};
                            $.merge( $$.Configuration.ioc, [{
                                id:"testFixture", clazz:"Claypool.TestFixture"
                            }]); $.merge($$.Configuration.aop , [{
                                "id"        :"testAspect00",
                                "target"    :"TestFixture",
                                "after"     :"fixtureFunction00",
                                "advice"    :"TestAdvice"
                            }]);
                            $.merge($$.Configuration.ioc , [
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
                        test              :   function(){
                            this.expect(2);
                            var container = new $$AOP.Container();
                            var testFixture = container.get("testAspect00");
                            this.assertNotNull(testFixture, "Expected object created and returned.");
                            var nullFixture = container.get("nullFixture");//doesnt exist in ioc container
                            this.assertNull(nullFixture, "Expected null value returned.");
                        },
                        teardown          :    function(){
                            $$.Configuration.aop = [];
                            $$.Configuration.ioc = [];
                            delete Claypool.TestFixture;
                        }
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
                $class        :   "Claypool.AOP.Factory",
                methodTests   :  [
                    // AspectFactoryCreationTest 
                    {
                        method           :   "constructor",
                        description      :   "AspectFactory can be instantiated.",
                        test            :   function(){
                            this.expect(1);
                            var aopFactory =  new $$AOP.Factory();
                            this.assertNotNull(aopFactory, "The AOP Factory was created with a no arg constructor.");
                        }
                    },
                    {
                        method           :   "create",
                        description      :   "AspectFactory can create aspects.",
                        setup             :   function(){
                            var _this = this;
                            this.logger.debug("Creating fixture classes.");
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(){
                                return "00";    
                            }; 
                            TestAdvice = function(returnValue){
                                _this.assertEqual(returnValue, "00", "The After Aspect captured the expected return value");
                            };
                            $.merge($$.Configuration.aop, [{
                                id:"#testAspect",
                                target:	"TestFixture",
                                after: "fixtureFunction00",
                                advice: "TestAdvice",
                            }]);
                        },
                        test            :   function(){
                            this.expect(2);
                            var _this = this;
                            var aopFactory =  new $$AOP.Factory();
                            //Beacuse the aspect is across an entire class of objects
                            //the aspect is created at configuration time.
                            aopFactory.updateConfig();
                            //The aspect already exists but this will retreive it.
                            var aspect = aopFactory.create("#testAspect");
                            this.assertNotNull(aspect, "The aspect was created without error.");
                            var testFixture = new TestFixture();
                            testFixture.fixtureFunction00();
                        },
                        teardown      :       function(){
                            $$.Configuration.aop = [];
                            delete TestFixture;
                        }
                    },
                    {
                        method           :   "updateConfig",
                        description      :   "AspectFactory can be configured successfully",
                        setup             :   function(){
                            // Put a class object in global scope
                            this.logger.debug("Creating fixture class.");
                            $.merge($$.Configuration.aop , [{
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
                            $.merge($$.Configuration.ioc , [
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
                        test            :   function(){
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
                        teardown      :       function(){
                            $$.Configuration.aop = $$.Configuration.ioc = [];
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
                $class        :   "Claypool.AOP.Aspect",
                methodTests   :  [
                    // AbstractAspectCreationTest 
                    {
                        method           :   "constructor",
                        description      :   "AOP Abstract Aspect can be instantiated.",
                        test              :   function(){
                            this.expect(1);
                            var abstractAspect = new $$AOP.Aspect();
                            this.assertTrue(abstractAspect, "The AbstractAspect was successfully created (with no args).");
                        }
                    },
                    // AbstractAspectWeaveTest 
                    {
                        method           :   "weave",
                        description      :   "Abstract Aspect weave will fail because |advise| is not implemented.",
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
                            var abstractAspect = new $$AOP.Aspect({
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
                            $$.Configuration.aop = $$.Configuration.ioc = [];
                            delete TestFixture;
                            delete TestAdvice;
                        }
                    },
                    // AbstractAspectUnweaveTest 
                    {
                        method           :   "unweave",
                        description      :   "Abstract Aspect unweave will fail because |advise| is not implemented.",
                        test              :   function(){
                            this.expect(1);
                            var abstractAspect = new $$AOP.Aspect();
                            this.assertTrue(abstractAspect.unweave(), "Unweaving an empty  an AbstractAspect should return true.");
                        
                        }
                    },
                    // AbstractAspectAdviseTest 
                    {
                        method           :   "advise",
                        description      :   "Abstract Aspect weave will fail because |advise| is not implemented.",
                        test              :   function(){
                            this.expect(1);
                            var abstractAspect = new $$AOP.Aspect();
                            try{
                               abstractAspect.advise();
                               this.fail("Expected Claypool.MethodNotImplementedError");
                            }catch(e){
                               this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                            }
                        
                        }
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
                $class        :   "Claypool.AOP.After",
                methodTests   :  [
                    // AfterAspectCreationTest 
                    {
                        method           :   "constructor",
                        description      :   "After Aspect can be instantiated.",
                        test              :   function(){
                            this.expect(1);
                            var afterAspect = new $$AOP.After();
                            this.assertTrue(afterAspect, "The AbstractAspect was successfully created (with no args).");
                        }
                    },
                    // AfterWeaveTest 
                    {
                        method           :   "advise",
                        description      :   "AOP After Aspect can be weaved.",
                        setup             :   function(){
                            // Put a class object in global scope
                            this.logger.debug("Creating fixture class.");
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(){
                                return "00";    
                            };
                        },
                        test              :   function(){
                            var _this = this;
                            this.expect(1);
                            var afterAspect = new $$AOP.After({
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
                        teardown      :       function(){
                            delete TestFixture;
                        }
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
                $class        :   "Claypool.AOP.Before",
                methodTests   :  [
                    // BeforeAspectCreationTest 
                    {
                        method           :   "constructor",
                        description      :   "Before Aspect can be instantiated.",
                        test              :   function(){
                            this.expect(1);
                            var beforeAspect = new $$AOP.Before();
                            this.assertTrue(beforeAspect, "The Before Aspect was successfully created (with no args).");
                        }
                    },
                    // BeforeWeaveTest 
                    {
                        method           :   "advise",
                        description      :   "AOP Before Aspect can be weaved.",
                        setup             :   function(){
                            // Put a class object in global scope
                            this.logger.debug("Creating fixture class.");
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(){
                                return null;    
                            };  
                            
                        },
                        test              :   function(){
                            var _this = this;
                            this.expect(1);
                            var beforeAspect = new $$AOP.Before({
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
                        teardown      :       function(){
                            delete TestFixture;
                        }
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
                $class        :   "Claypool.AOP.Around",
                methodTests   :  [
                    // BeforeAspectCreationTest 
                    {
                        method           :   "constructor",
                        description      :   "Around Aspect can be instantiated.",
                        test              :   function(){
                            this.expect(1);
                            var aroundAspect = new $$AOP.Around();
                            this.assertTrue(aroundAspect, "The Around Aspect was successfully created (with no args).");
                        }
                    },
                    // BeforeWeaveTest 
                    {
                        method           :   "advise",
                        description      :   "AOP Around Aspect can be weaved.",
                        setup             :   function(){
                            // Put a class object in global scope
                            this.logger.debug("Creating fixture class.");
                            TestFixture = function(){};
                            TestFixture.prototype.fixtureFunction00 = function(){
                                return "01";    
                            };  
                        },
                        test              :   function(){
                            var _this = this;
                            this.expect(2);
                            var aroundAspect = new $$AOP.Around({
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
                        teardown      :       function(){
                            delete TestFixture;
                        }
                    }
                ]
            },
            /**
            *   Claypool.AOP.ContainerError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.AOP.ContainerError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$AOP.ContainerError();
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
            *   Claypool.AOP.ConfigurationError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.AOP.ConfigurationError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(3);
                            try{
                               throw new $$AOP.ConfigurationError();
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
            *   Claypool.AOP.AspectFactoryError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.AOP.FactoryError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$AOP.FactoryError();
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
            *   Claypool.AOP.AspectFactoryError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.AOP.WeaveError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$AOP.WeaveError();
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
            *   Claypool.AOP.AspectError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.AOP.AspectError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$AOP.AspectError();
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
})(jQuery, Claypool, Claypool.AOP);