/**
*   Claypool.TestSuite
*   
*/
(function($, $$, $$IoC){
    Claypool.IoC$TestSuite = {
        namespace    :    "Claypool.IoC",
        description  :   "Claypool IoC provides Dependency Injection for Application Managed Components, \
                            as well as Life Cycle hooks to help manage Application Resources.",
        staticMethodTests   :    [],
        classTests:[
            /**
            *   Claypool.IoC.Container
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class        :   "Claypool.IoC.Container",
                description  :   "The IoC Container is the shelf where application objects are managed \
                                    and shared across the application context.",
                methodTests          : [
                    {
                        method           :   "constructor",
                        description      :   "The IoC Container can be created.",
                        setup             :   function(){
                            Claypool.TestFixture = function(){};
                            $.extend.merge($$.Configuration.ioc,[]); 
                        },
                        test              :   function(){
                            this.expect(1);
                            var container = new $$IoC.Container();
                            this.assertNotNull(container, "The IoC Container was successfully created.");
                        },
                        teardown          :    function(){
                            $$.Configuration.ioc = [];
                        }
                    },
                    {
                        method           :   "get",
                        description      :   "Retreives the managed object, creating it if need be.",
                        setup             :   function(){
                            Claypool.TestFixture = function(){};
                            $.merge( $$.Configuration.ioc, [{
                                id:"testFixture", clazz:"Claypool.TestFixture"
                            }]); 
                        },
                        test              :   function(){
                            this.expect(2);
                            var container = new $$IoC.Container();
                            var testFixture = container.get("testFixture");
                            this.assertNotNull(testFixture, "Expected object created and returned.");
                            var nullFixture = container.get("nullFixture");//doesnt exist in ioc container
                            this.assertNull(nullFixture, "Expected null value returned.");
                        },
                        teardown          :    function(){
                            $$.Configuration.ioc = [];
                            delete Claypool.TestFixture;
                        }
                    }
                ]
            },
            /**
            *   Claypool.IoC.InstanceFactory
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class        :   "Claypool.IoC.Factory",
                description  :   "The IoC Instance Factory manages configuration and creation of Instances.",
                methodTests          : [
                    // 
                    {
                        method           :   "constructor",
                        description      :   "The InstanceFactory can be created.",
                        test              :   function(){
                            this.expect(1);
                            var factory = new Claypool.IoC.Factory();
                            this.assertNotNull(factory, "The factory was successfully created.");
                        }
                    },
                    {
                        method           :   "create",
                        description      :   "Please add a one sentence description.",
                        setup             :   function(){
                            Claypool.TestFixture = function(){};
                            $.merge( $$.Configuration.ioc, [{
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
                        test              :   function(){
                            this.expect(3);
                            var factory = new $$IoC.Factory();
                            factory.updateConfig();
                            var testFixture = factory.create("testFixture");
                        },
                        teardown          :    function(){
                            $$.Configuration.ioc = [];
                            delete Claypool.TestFixture;
                            $(document).unbind(" \
                                claypool:precreate:testFixture \
                                claypool:create:testFixture \
                                claypool:postcreate:testFixture");
                        }
                    },
                    {
                        method           :   "destroyLifeCycle",
                        description      :   "Please add a one sentence description.",
                        setup             :   function(){
                            Claypool.TestFixture = function(){};
                            $.merge( $$.Configuration.ioc, [{
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
                        test              :   function(){
                            this.expect(3);
                            var factory = new $$IoC.Factory();
                            factory.updateConfig();
                            var testFixture = factory.create("testFixture");
                            factory.destroyLifeCycle(testFixture);
                        },
                        teardown          :    function(){
                            $$.Configuration.ioc = [];
                            $(document).unbind(" \
                                claypool:predestroy:testFixture \
                                claypool:destroy:testFixture \
                                claypool:postdestroy:testFixture");
                        }
                    },
                    {
                        method           :   "create",
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
                    }
                ]
            },
            /**
            *   Claypool.IoC.Instance
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.IoC.Instance",
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
                        method           :   "precreate",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    {
                        method           :   "create",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    {
                        method           :   "postcreate",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    {
                        method           :   "predestroy",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    {
                        method           :   "destroy",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    {
                        method           :   "postdestroy",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    },
                    {
                        method           :   "resolveConstructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                           //    Todo: your test here.
                           throw new Error("TEST NOT IMPLEMENTED.");
                        }
                    }
                ]
            },
            /**
            *   Claypool.IoC.ContainerError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.IoC.ContainerError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$IoC.ContainerError();
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
            *   Claypool.IoC.FactoryError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.IoC.FactoryError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$IoC.FactoryError();
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
            *   Claypool.IoC.ConfigurationError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.IoC.ConfigurationError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(3);
                            try{
                               throw new $$IoC.ConfigurationError();
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
            *   Claypool.IoC.LifeCycleError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.IoC.LifeCycleError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(2);
                            try{
                               throw new $$IoC.LifeCycleError();
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
            *   Claypool.IoC.ConstructorResolutionError
            *   
            *   @author Chris Thatcher 
            *   @email thatcher.christopher@gmail.com
            */
            {
                $class          : "Claypool.IoC.ConstructorResolutionError",
                methodTests          : [
                    //
                    {
                        method           :   "constructor",
                        description      :   "Please add a one sentence description.",
                        test              :   function(){
                            this.expect(3);
                            try{
                               throw new $$IoC.ConstructorResolutionError();
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
})(jQuery, Claypool, Claypool.IoC);
