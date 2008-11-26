/**
*   Claypool.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
Claypool.Application$TestSuite = {
    "@namespace"    :    "Claypool.Application",
    "@description"  :   "Claypool provides an application scoped context that allows "+
                        "objects to be stored and retreived accross an application in "+
                        "a uniform way.",
    "staticMethodTests"   :    [
        /**
        *   Claypool.Application$Test
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        //StaticGetApplicationContextTest 
        {
            "@method"           :   "Claypool.Application.getApplicationContext",
            "@description"      :   "Please add a one sentence description.",
            "@summary"          :   "Please add a short paragraph describing the practical " +
                                    "puposes of this test.  It should also include variations "+
                                    "of the test already included.",
            "@commonErrors"   :   "Please add a short paragraph describing simple user errors "+
                                "that might occur to create issues this test doesn't address.",
            "test"            :   function(){
               //    Todo: your test here.
               throw new Error("TEST NOT IMPLEMENTED.");
            }
        },
        //InitializeApplicationTest 
        {
            "@method"              :   "Claypool.Application.Initialize",
            "@description"     :   "Please add a one sentence description.",
            "@summary"     :   "Please add a short paragraph describing the practical " +
                                "puposes of this test.  It should also include variations "+
                                "of the test already included.",
            "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                "that might occur to create issues this test doesn't address.",
            "test"     :   function(){
               //    Todo: your test here.
               throw new Error("TEST NOT IMPLEMENTED.");
            }
        },
        //ReinitializeApplicationTest 
        {
            "@method"              :   "Claypool.Application.Reinitialize",
            "@description"     :   "Please add a one sentence description.",
            "@summary"     :   "Please add a short paragraph describing the practical " +
                                "puposes of this test.  It should also include variations "+
                                "of the test already included.",
            "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                "that might occur to create issues this test doesn't address.",
            "test"     :   function(){
               //    Todo: your test here.
               throw new Error("TEST NOT IMPLEMENTED.");
            }
        }
    ],
    "classTests"    :  [
        /**
        *   Claypool.Application.ApplicationContext$Class
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            "@class"    : "Claypool.Application.ApplicationContext$Class",
            "methodTests"       : [
                //ApplicationContextCreationTest 
                {
                    "@method"     :   "Claypool.Application.ApplicationContext$Class.constructor",
                    "@description"     :   "Please add a one sentence description.",
                    "@summary"     :   "Please add a short paragraph describing the practical " +
                                        "puposes of this test.  It should also include variations "+
                                        "of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                        "that might occur to create issues this test doesn't address.",
                    "test"     :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                //GetFromApplicationContext 
                {
                    "@method"     :   "Claypool.Application.ApplicationContext$Class.get",
                    "@description"     :   "Please add a one sentence description.",
                    "@summary"     :   "Please add a short paragraph describing the practical " +
                                        "puposes of this test.  It should also include variations "+
                                        "of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                        "that might occur to create issues this test doesn't address.",
                    "test"     :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                //PutIntoApplicationContext 
                {
                    "@method"     :   "Claypool.Application.ApplicationContext$Class.put",
                    "@description"     :   "Please add a one sentence description.",
                    "@summary"     :   "Please add a short paragraph describing the practical " +
                                        "puposes of this test.  It should also include variations "+
                                        "of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                        "that might occur to create issues this test doesn't address.",
                    "test"     :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        },
        /**
        *   Claypool.Application.ApplicationContextContributor$Class
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            "@class"    : "Claypool.Application.ApplicationContextContributor$Class",
            "methodTests"       : [
                //ApplicationContextContributorCreationTest 
                {
                    "@method"     :   "Claypool.Application.ApplicationContextContributor$Class.constructor",
                    "@description"     :   "Please add a one sentence description.",
                    "@summary"     :   "Please add a short paragraph describing the practical " +
                                        "puposes of this test.  It should also include variations "+
                                        "of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                        "that might occur to create issues this test doesn't address.",
                    "test"     :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                //RegisterAsContextContributorTest 
                {
                    "@method"     :   "Claypool.Application.ApplicationContextContributor$Class.registerContext",
                    "@description"     :   "Please add a one sentence description.",
                    "@summary"     :   "Please add a short paragraph describing the practical " +
                                        "puposes of this test.  It should also include variations "+
                                        "of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                        "that might occur to create issues this test doesn't address.",
                    "test"     :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        },
        /**
        *   Claypool.Application.ApplicationAware$Test
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            "@class"    : "Claypool.Application.ApplicationAware$Class",
            "methodTests"       : [
                //ApplicationAwareCreationTest 
                {
                    "@method"     :   "Claypool.Application.ApplicationAware$Class.constructor",
                    "@description"     :   "Please add a one sentence description.",
                    "@summary"     :   "Please add a short paragraph describing the practical " +
                                        "puposes of this test.  It should also include variations "+
                                        "of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                        "that might occur to create issues this test doesn't address.",
                    "test"     :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                //ApplicationContextRetreivalTest 
                {
                    "@method"     :   "Claypool.Application.ApplicationAware$Class.getApplicationContion",
                    "@description"     :   "Please add a one sentence description.",
                    "@summary"     :   "Please add a short paragraph describing the practical " +
                                        "puposes of this test.  It should also include variations "+
                                        "of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors "+
                                        "that might occur to create issues this test doesn't address.",
                    "test"     :   function(){
                       //    Todo: your test here.
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        },
        /**
        *   Claypool.Application.NoSuchObjectError$Class
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            "@class"          : "Claypool.Application.NoSuchObjectError$Class",
            "methodTests"          : [
                //
                {
                    "@method"           :   "Claypool.Application.NoSuchObjectError$Class.constructor",
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
        *   Claypool.Application.ApplicationContextError$Class
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            "@class"          : "Claypool.Application.ApplicationContextError$Class",
            "methodTests"          : [
                //
                {
                    "@method"           :   "Claypool.Application.ApplicationContextError$Class.constructor",
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
        }
    ]
}

/**
* 

module("Claypool.Application LegacyTests");
test("Application Context", function() {
    expect(6);
    ok( Claypool.Application.getApplicationContext, "Claypool.Application.getApplicationContext" );
    
	container = new Claypool.IoC.Container();
	ok(container, "container should not be null if there is no error");
	testClassFromContainerContext = container.get("#testClass");
	ok(testClassFromContainerContext !== null && testClassFromContainerContext !== undefined , 
	    "#testClass should not be null since the ioc container should contain it");
	
	applicationContext = Claypool.Application.getApplicationContext();
	ok(applicationContext !== null && applicationContext !== undefined , 
	    "getApplicationContext should not return null");
	testClassFromAppContext = applicationContext.get("#testClass");
	ok(testClassFromAppContext !== null && testClassFromAppContext !== undefined , 
	    "#testClass should not be null since the ioc container is an application context contributor");
	    
	isObj(testClassFromContainerContext,testClassFromAppContext, 
	    "objects accessed through different context should be the same.");
	
	
});*/