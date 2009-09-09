/**
*   Claypool.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
Claypool.Application$TestSuite = {
    namespace:    "Claypool.Application",
    description:   "Claypool provides an application scoped context that allows "+
                        "objects to be stored and retreived accross an application in "+
                        "a uniform way.",
    staticMethodTests:    [
        /**
        *   Claypool.Application$Test
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        //StaticGetApplicationContextTest 
        {
            method:   "getApplicationContext",
            description:   "Please add a one sentence description.",
            test:   function(){
               //    Todo: test 
               throw new Error("TEST NOT IMPLEMENTED.");
            }
        },
        //InitializeApplicationTest 
        {
            method:   "Initialize",
            description:   "Please add a one sentence description.",
            test:   function(){
               //    Todo: test 
               throw new Error("TEST NOT IMPLEMENTED.");
            }
        },
        //ReinitializeApplicationTest 
        {
            method:   "Reinitialize",
            description:   "Please add a one sentence description.",
            test:   function(){
               //    Todo: test 
               throw new Error("TEST NOT IMPLEMENTED.");
            }
        }
    ],
    classTests:  [
        /**
        *   Claypool.Application.ApplicationContext
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class: "Claypool.Application.ApplicationContext",
            methodTests: [
                //ApplicationContextCreationTest 
                {
                    method:   "constructor",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                       //    Todo: test 
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                //GetFromApplicationContext 
                {
                    method:   "get",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                       //    Todo: test 
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                //PutIntoApplicationContext 
                {
                    method:   "put",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                       //    Todo: test 
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        },
        /**
        *   Claypool.Application.ApplicationContextContributor
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class: "Claypool.Application.ApplicationContextContributor",
            methodTests: [
                //ApplicationContextContributorCreationTest 
                {
                    method:   "constructor",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                       //    Todo: test 
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                //RegisterAsContextContributorTest 
                {
                    method:   "registerContext",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                       //    Todo: test 
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
            $class: "Claypool.Application.ApplicationAware",
            methodTests: [
                //ApplicationAwareCreationTest 
                {
                    method:   "constructor",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                       //    Todo: test 
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                },
                //ApplicationContextRetreivalTest 
                {
                    method:   "getApplicationContion",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                       //    Todo: test 
                       throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        },
        /**
        *   Claypool.Application.NoSuchObjectError
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class: "Claypool.Application.NoSuchObjectError",
            methodTests: [
                //
                {
                    method:   "constructor",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                        //    Todo: test 
                        throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        },
        /**
        *   Claypool.Application.ApplicationContextError
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class: "Claypool.Application.ApplicationContextError",
            methodTests: [
                //
                {
                    method:   "constructor",
                    description:   "Please add a one sentence description.",
                    test:   function(){
                        //    Todo: test 
                        throw new Error("TEST NOT IMPLEMENTED.");
                    }
                }
            ]
        }
    ]
}
