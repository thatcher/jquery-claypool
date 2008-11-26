/**
*   Claypool.MVC.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
(function($){
	Claypool.MVC$TestSuite = {
	    "@namespace"    :    "Claypool.MVC",
	    "@description"  :   "Please add a one sentence description.",
	    "staticMethodTests"   :    [],
	    "classTests":[
	        /**
	        *   Claypool.MVC.Container$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.MVC.Container$Class",
	            "methodTests"          : [
	                // 
	                {
	                    "@method"           :   "Claypool.MVC.Container$Class.constructor",
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
	                    "@method"           :   "Claypool.MVC.Container$Class.get",
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
	        *   Claypool.MVC.Factory$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.MVC.Factory$Class",
	            "methodTests"          : [
	                // 
	                {
	                    "@method"           :   "Claypool.MVC.Factory$Class.constructor",
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
	                    "@method"           :   "Claypool.MVC.Factory$Class.updateConfig",
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
	                    "@method"           :   "Claypool.MVC.Factory$Class.initializeHijaxController",
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
	        *   Claypool.MVC.Controller$Abstract
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.MVC.Controller$Abstract",
	            "methodTests"          : [
	                // 
	                {
	                    "@method"           :   "Claypool.MVC.Controller$Abstract.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(1);
	                    	var abstractController = new $.MVC.Controller();
	                    	this.assertNotNull(abstractController, "The Abstract Controller can be instantiated.");
	                    }
	                },
	                // 
	                {
	                    "@method"           :   "Claypool.MVC.Controller$Abstract.handle",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(1);
	                    	var abstractController;
                    		try{
	                       		abstractController = new $.MVC.Controller();
	                       		abstractController.handle();
	                       		this.fail("Expected Error was not thrown.");
                       		}catch(e){
                       			this.assertTrue(e.name.match("MethodNotImplementedError"),
                       				"Can't use an interface without providing an implementation."
                   				);
                       		}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.MVC.HijaxController$Abstract
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.MVC.HijaxController$Abstract",
	            "methodTests"          : [
	                // constructor
	                {
	                    "@method"           :   "Claypool.MVC.HijaxController$Abstract.constructor",
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
	                // makeResolver
	                {
	                    "@method"           :   "Claypool.MVC.HijaxController$Abstract.makeResolver",
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
	                // handle
	                {
	                    "@method"           :   "Claypool.MVC.HijaxController$Abstract.handle",
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
	                // hijax
	                {
	                    "@method"           :   "Claypool.MVC.HijaxController$Abstract.hijax",
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
	                // attach
	                {
	                    "@method"           :   "Claypool.MVC.HijaxController$Abstract.attach",
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
	                // getTarget
	                {
	                    "@method"           :   "Claypool.MVC.HijaxController$Abstract.getTarget",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(1);
	                    	var abstractHijaxController;
                    		try{
	                       		abstractHijaxController = new $.MVC.HijaxController();
	                       		abstractHijaxController.getTarget();
	                       		this.fail("Expected Error was not thrown.");
                       		}catch(e){
                       			this.assertTrue(e.name.match("MethodNotImplementedError"),
                       				"Can't use an interface without providing an implementation."
                   				);
                       		}
	                    }
	                }
	            ]
	        },
	        
	        /**
	        *   Claypool.MVC.View$Interface
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.MVC.View$Interface",
	            "methodTests"          : [
	                // update
	                {
	                    "@method"           :   "Claypool.MVC.View$Interface.update",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(1);
                    		try{
	                       		$.MVC.View$Interface.update();
	                       		this.fail("Expected Error was not thrown.");
                       		}catch(e){
                       			this.assertTrue(e.name.match("MethodNotImplementedError"),
                       				"Can't use an interface without providing an implementation."
                   				);
                       		}
	                    }
	                },
	                // think
	                {
	                    "@method"           :   "Claypool.MVC.View$Interface.think",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                    	this.expect(1);
                    		try{
	                       		$.MVC.View$Interface.think();
	                       		this.fail("Expected Error was not thrown.");
                       		}catch(e){
                       			this.assertTrue(e.name.match("MethodNotImplementedError"),
                       				"Can't use an interface without providing an implementation."
                   				);
                       		}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.MVC.ContainerError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.MVC.ContainerError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.MVC.ContainerError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                        this.expect(2);
							try{
							   throw new $.MVC.ContainerError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.MVC.ContainerError"),  
							                    "Can match error as Claypool.MVC.ContainerError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.MVC.NoSuchControllerError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.MVC.FactoryError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.MVC.FactoryError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){
	                        this.expect(2);
							try{
							   throw new $.MVC.FactoryError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.MVC.FactoryError"),  
							                    "Can match error as Claypool.MVC.FactoryError");
							}
	                    }
	                }
	            ]
	        },
	        /**
	        *   Claypool.MVC.ConfigurationError$Class
	        *   
	        *   @author Chris Thatcher 
	        *   @email thatcher.christopher@gmail.com
	        */
	        {
	            "@class"          : "Claypool.MVC.ConfigurationError$Class",
	            "methodTests"          : [
	                //
	                {
	                    "@method"           :   "Claypool.MVC.ConfigurationError$Class.constructor",
	                    "@description"      :   "Please add a one sentence description.",
	                    "@summary"          :   "Please add a short paragraph describing the practical " +
	                                            "puposes of this test.  It should also include variations "+
	                                            "of the test already included.",
	                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
	                                            "that might occur to create issues this test doesn't address.",
	                    "test"              :   function(){this.expect(3);
							try{
							   throw new $.MVC.ConfigurationError();
							   this.assertTrue(false, "Should have thrown error.");
							}catch(e){
							   this.assertTrue(e.name.match( "Claypool.Error"), 
							                    "Can match error as Claypool.Error");
							   this.assertTrue(e.name.match( "Claypool.ConfigurationError"), 
							                    "Can match error as Claypool.ConfigurationError");
							   this.assertTrue(e.name.match( "Claypool.MVC.ConfigurationError"),  
							                    "Can match error as Claypool.MVC.ConfigurationError");
							}
	                    }
	                }
	            ]
	        }
	    ]
	};
})(jQuery);