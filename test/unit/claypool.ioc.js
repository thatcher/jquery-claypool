/**
*   Claypool.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
(function($){
	Claypool.IoC$TestSuite = {
	    "@namespace"    :    "Claypool.IoC",
	    "@description"  :   "Claypool IoC provides Dependency Injection for Application Managed Components, \
	                        as well as Life Cycle hooks to help manage Application Resources.",
	    "staticMethodTests"   :    [],
	    "classTests":[
	        /**
	        *   Claypool.IoC.Container$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"        :   "Claypool.IoC.Container$Class",
	            "@description"  :   "The IoC Container is the shelf where application objects are managed \
	                                and shared across the application context.",
	            "methodTests"          : [
	                {
	                    "@method"           :   "Claypool.IoC.Container$Class.constructor",
	                    "@description"      :   "The IoC Container can be created.",
	                    "@summary"          :   "This test verifies the IoC Container can be created.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source \
	                                            is actually included correctly.  Please use firefox+firebug \
	                                            to ensure that the source was downloaded properly.",
	                    "setup"             :   function(){
	                        Claypool.TestFixture = function(){};
	                        $.extend.merge($.Configuration.ioc,[]); 
	                    },
	                    "test"              :   function(){
	                        this.expect(1);
	                        var container = new $.IoC.Container();
	                        this.assertNotNull(container, "The IoC Container was successfully created.");
	                    },
	                    "teardown"          :    function(){
	                        $.Configuration.ioc = [];
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Container$Class.get",
	                    "@description"      :   "Retreives the managed object, creating it if need be.",
	                    "@summary"          :   "This test verifies that  the IoC container will retrieve the \
	                                            object, will propagate unexpected errors or will return null \
	                                            if the object doesnt exist.",
	                    "@commonErrors"     :   "If the configuration is malformed the exception will bubble up through \
	                                            the container, or if the managed object throws an unexpected error in its \
	                                            creation lifecycle, it will bubble up to the ioc container.",
	                    "setup"             :   function(){
	                        Claypool.TestFixture = function(){};
	                        $.merge( $.Configuration.ioc, [{
	                        	id:"testFixture", clazz:"Claypool.TestFixture"
	                        }]); 
	                    },
	                    "test"              :   function(){
	                        this.expect(2);
	                        var container = new $.IoC.Container();
	                        var testFixture = container.get("testFixture");
	                        this.assertNotNull(testFixture, "Expected object created and returned.");
	                        var nullFixture = container.get("nullFixture");//doesnt exist in ioc container
	                        this.assertNull(nullFixture, "Expected null value returned.");
	                    },
	                    "teardown"          :    function(){
	                        $.Configuration.ioc = [];
	                        delete Claypool.TestFixture;
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                }
	            ]
	        },
	        /**
	        *   Claypool.IoC.InstanceFactory$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"        :   "Claypool.IoC.Factory$Class",
	            "@description"  :   "The IoC Instance Factory manages configuration and creation of Instances.",
	            "methodTests"          : [
	                // 
	                {
	                    "@method"           :   "Claypool.IoC.Factory$Class.constructor",
	                    "@description"      :   "The InstanceFactory can be created.",
	                    "@summary"          :   "Please add a short paragraph describing the practical \
	                                            puposes of this test.  It should also include variations \
	                                            of the test already included.",
	                    "@commonErrors"     :   "It would be unusual for this test to fail if the source \
	                                            is actually included correctly.  Please use firefox+firebug \
	                                            to ensure that the source was downloaded properly.",
	                    "test"              :   function(){
	                        this.expect(1);
	                        var factory = new Claypool.IoC.Factory();
	                        this.assertNotNull(factory, "The factory was successfully created.");
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                {
	                    "@method"           :   "Claypool.Logging.Factory$Class.createLifeCycle",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical \
	                                            puposes of this test.  It should also include variations \
	                                            of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors \
	                                            that might occur to create issues this test doesn't address.",
	                    "setup"             :   function(){
	                        Claypool.TestFixture = function(){};
	                        $.merge( $.Configuration.ioc, [{
	                        	id:"testFixture", clazz:"Claypool.TestFixture"
	                        }]); 
	                        var _this = this;
	                        $(document).bind(" \
	                            claypool:precreate:testFixture \
	                            claypool:create:testFixture \
	                            claypool:postcreate:testFixture ", function(event){
	                            _this.assertNotNull(event, "Got lifecycle event");
	                        });
	                    },
	                    "test"              :   function(){
	                        this.expect(3);
	                        var factory = new $.IoC.Factory();
	                        factory.updateConfig();
	                        var testFixture = factory.create("testFixture");
	                    },
	                    "teardown"          :    function(){
	                        $.Configuration.ioc = [];
	                        delete Claypool.TestFixture;
	                        $(document).unbind(" \
	                            claypool:precreate:testFixture \
	                            claypool:create:testFixture \
	                            claypool:postcreate:testFixture");
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Factory$Class.destroyLifeCycle",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "setup"             :   function(){
	                        Claypool.TestFixture = function(){};
	                        $.merge( $.Configuration.ioc, [{
	                        	id:"testFixture", clazz:"Claypool.TestFixture"
	                        }]);
	                        
	                        var _this = this;
	                        $(document).bind(" \
	                            claypool:predestroy:testFixture \
	                            claypool:destroy:testFixture \
	                            claypool:postdestroy:testFixture ", function(event){
	                            _this.assertNotNull(event, "Got lifecycle event");
	                        });
	                    },
	                    "test"              :   function(){
	                        this.expect(3);
	                        var factory = new $.IoC.Factory();
	                        factory.updateConfig();
	                        var testFixture = factory.create("testFixture");
	                        factory.destroyLifeCycle(testFixture);
	                    },
	                    "teardown"          :    function(){
	                        $.Configuration.ioc = [];
	                        $(document).unbind(" \
	                            claypool:predestroy:testFixture \
	                            claypool:destroy:testFixture \
	                            claypool:postdestroy:testFixture");
	                    },
	                    "@author"       :   "Chris Thatcher",
	                    "@email"        :   "thatcher.christopher@gmail.com"
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Factory$Class.create",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Factory$Class.updateConfig",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.IoC.Instance$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.IoC.Instance$Class",
	            "methodTests"          : [
	                // 
	                {
	                    "@method"           :   "Claypool.IoC.Instance$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Instance$Class.precreate",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Instance$Class.create",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Instance$Class.postcreate",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Instance$Class.predestroy",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Instance$Class.destroy",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Instance$Class.postdestroy",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                },
	                {
	                    "@method"           :   "Claypool.IoC.Instance$Class.resolveConstructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                       //    Todo: your test here.
	                       throw new Error("TEST NOT IMPLEMENTED.");
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.IoC.ContainerError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.IoC.ContainerError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.IoC.ContainerError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
							this.expect(2);
							try{
							   throw new $.IoC.ContainerError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.IoC.ContainerError"),  
							                    "Can match error as Claypool.IoC.ContainerError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.IoC.FactoryError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.IoC.FactoryError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.IoC.FactoryError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
							this.expect(2);
							try{
							   throw new $.IoC.FactoryError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.IoC.FactoryError"),  
							                    "Can match error as Claypool.IoC.FactoryError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.IoC.ConfigurationError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.IoC.ConfigurationError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.IoC.ConfigurationError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
							this.expect(3);
							try{
							   throw new $.IoC.ConfigurationError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.ConfigurationError"), 
							                    "Can match error as Claypool.ConfigurationError");
							   this.assertTrue(e.name.match( "Claypool.IoC.ConfigurationError"),  
							                    "Can match error as Claypool.IoC.ConfigurationError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.IoC.LifeCycleError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.IoC.LifeCycleError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.IoC.LifeCycleError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
							this.expect(2);
							try{
							   throw new $.IoC.LifeCycleError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.IoC.LifeCycleError"),  
							                    "Can match error as Claypool.IoC.LifeCycleError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.IoC.ConstructorResolutionError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.IoC.ConstructorResolutionError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.IoC.ConstructorResolutionError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(3);
							try{
							   throw new $.IoC.ConstructorResolutionError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.NameResolutionError"), 
							                    "Can match error as Claypool.NameResolutionError");
							   this.assertTrue(e.name.match( "Claypool.IoC.ConstructorResolutionError"),  
							                    "Can match error as Claypool.IoC.ConstructorResolutionError");
							}
	                    }
	                }
	            ]
	        }
	    ]
	};
})(jQuery);
