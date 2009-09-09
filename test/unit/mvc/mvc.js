/**
*   Claypool.MVC.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
(function($, $$, $$MVC){
    Claypool.MVC$TestSuite = {
        namespace           : "Claypool.MVC",
        description         : "Please add a one sentence description.",
        staticMethodTests   : [],
        classTests:[{
            /** 
            *   Claypool.MVC.Container
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            $class          : "Claypool.MVC.Container",
            methodTests          : [
                // 
                {
                    method           :   "constructor",
                    description      :   "Please add a one sentence description.",
                    test              :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                {
                    method           :   "get",
                    description      :   "Please add a one sentence description.",
                    test              :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        },{
            /**
            *   Claypool.MVC.Factory
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            $class          : "Claypool.MVC.Factory",
            methodTests          : [
                // 
                {
                    method           :   "constructor",
                    description      :   "Please add a one sentence description.",
                    test              :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                {
                    method           :   "updateConfig",
                    description      :   "Please add a one sentence description.",
                    test              :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                {
                    method           :   "initializeHijaxController",
                    description      :   "Please add a one sentence description.",
                    test              :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        },
        /**
        *   Claypool.MVC.Controller
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
            {
                $class          : "Claypool.MVC.Controller",
                methodTests          : [
                    // 
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(1);
                            var abstractController = new $$MVC.Controller();
                            this.assertNotNull(abstractController, "The Abstract Controller can be instantiated.");
                        }
                    },
                    // 
                    {
                        method           :   "handle",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(1);
                            var abstractController;
                            try{
                                abstractController = new $$MVC.Controller();
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
                $class          : "Claypool.MVC.HijaxController",
                methodTests          : [
                    // constructor
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    // makeResolver
                    {
                        method           :   "makeResolver",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    // handle
                    {
                        method           :   "handle",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    // hijax
                    {
                        method           :   "hijax",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    // attach
                    {
                        method           :   "attach",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    // getTarget
                    {
                        method           :   "getTarget",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(1);
                            var abstractHijaxController;
                            try{
                                abstractHijaxController = new $$MVC.HijaxController();
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
                $class          : "Claypool.MVC.View$Interface",
                methodTests          : [
                    // update
                    {
                        method           :   "Claypool.MVC.View$Interface.update",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(1);
                            try{
                                $$MVC.View$Interface.update();
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
                        method           :   "Claypool.MVC.View$Interface.think",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(1);
                            try{
                                $$MVC.View$Interface.think();
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
            *   Claypool.MVC.ContainerError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.MVC.ContainerError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$MVC.ContainerError();
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
            *   Claypool.MVC.NoSuchControllerError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.MVC.FactoryError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$MVC.FactoryError();
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
            *   Claypool.MVC.ConfigurationError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.MVC.ConfigurationError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){this.expect(3);
                            try{
                               throw new $$MVC.ConfigurationError();
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
})(jQuery, Claypool, Claypool.MVC);