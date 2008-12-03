/**
*   Claypool IoC Api Documentation
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
Claypool.IoC$Doc = {
    "@namespace"    :   "Claypool.IoC",
    "@description"  :   "Claypool's Inversion of Control allow you to Inject Dependencies.  This is a "+
                        "very powerful tool for enabling reuse of code via only configuration (which is "+
                        "also refered to as 'wiring').  Often application Controllers need a Data Access Object, "+
                        "but the Data Access Object needs to be easily configured, and have access to a Model "+
                        "which again in turn need to allow for some minor modification (especially for local vs. "+
                        "testing vs QA vs production environments.)  Keeping this out of your code as much as possible "+
                        "both reduces code and confusion, as well as maximizes reusability.\n\n"+
                        "Claypool's IoC configuration options allow you access to a full power of jQuery selectors "+
                        "and even to LiveQuery.",
    example        :   [{
        "@title"        :   "Required properties of IoC Configuration",
        "@description"  :   "Really you don't need to provide anything but a unique id and a Class. \n"+ 
                            "The 'clazz' will be resolved so namespaces will be honored.",
        source          :   ""+
            "Claypool.Configuration = {\n"+
            "   ioc: [\n"+
            "       { id: 'myAppThing', clazz:'MyApp.Things.SomeThing'}\n"+
            "   ]\n"+
            "};\n"+
            "// Assumes the app has been initialized.\n"+
            "var myAppThing = Claypool.$('myAppThing');"
    },{
        "@title"        :   "Adding Selectors to an IoC Configuration",
        "@description"  :   "The 'selector' keyword passed to the selector engine (jQuery by default)",
        source          :   ""+
            "Claypool.Configuration = {\n"+
            "   ioc: [\n"+
            "       { id: 'myAppThing', clazz:'MyApp.Things.SomeThing',\n"+
            "           selector:'#mainNavigation'\n"+
            "       }\n"+
            "   ]\n"+
            "};\n"+
            "// Assumes the app has been initialized.\n"+
            "var myAppThing = Claypool.$('myAppThing');\n"+
            "// myAppThing is also a jQuery object with all jQuery methods.\n"+
            "// assuming the selector is valid"
    },{
        "@title"        :   "Adding Active Selectors to an IoC Configuration",
        "@description"  :   "Including the keyword 'active' with the value true allows "+
                            "an optional library like LiveQuery to monitor the DOM to "+
                            "include new matches (LiveQuery is used by default)",
        source          :   ""+
            "Claypool.Configuration = {\n"+
            "   ioc: [\n"+
            "       { id: 'myAppThing', clazz:'MyApp.Things.SomeThing',\n"+
            "           active:true,\n"+
            "           selector:'#mainNav'\n"+
            "       }\n"+
            "   ]\n"+
            "};\n"+
            "// Assumes the app has been initialized.\n"+
            "var myAppThing = Claypool.$('myAppThing');\n"+
            "// myAppThing is also a jQuery object with all jQuery methods."
    },{
        "@title"        :   "Adding Constructor Arguments to an IoC Configuration",
        "@description"  :   "The 'options' keyword is treated as an array of arguments to pass "+
                            "to the constructor.  Upto 10 constructor arguments is supported.",
        source          :   ""+
            "Claypool.Configuration : {\n"+
            "   ioc: [\n"+
            "       { id: 'myAppThing', clazz:'MyApp.Things.SomeThing',\n"+
            "           options:[{a:1, b:2, c:3}]\n"+
            "       }\n"+
            "   ]\n"+
            "};\n"+
            "// Assumes the app has been initialized.\n"+
            "var myAppThing = Claypool.$('myAppThing');"
    },{
        "@title"        :   "Injecting Dependencies to an IoC Configuration",
        "@description"  :   "The IoC Container can provide additional properties including "+
                            "other application manged components (using the 'ref://' "+
                            "prefix).",
        source          :   ""+
            "Claypool.Configuration{\n"+
            "   ioc: [\n"+
            "       { id: 'myAppThing', clazz:'MyApp.Things.SomeThing',\n"+
            "           options:[{a:1, b:2, c:3}]\n"+
            "       },\n"+
            "       { id: 'myOtherThing', clazz:'MyApp.Things.OtherThing',\n"+
            "           options:[{d:4, e:5, f:6}],\n"+
            "           inject:{\n"+
            "               something:'ref://myAppThing',\n"+
            "               url:'http://localhost:8080/myapp/foo'\n"+
            "           }\n"+
            "       }\n"+
            "   ]\n"+
            "};\n"+
            "// Assumes the app has been initialized.\n"+
            "var myOtherThing = Claypool.$('myOtherThing');\n"+
            "// Now was are assured myOtherThing has a property 'something' that is 'myAppThing'\n"+
            "// Also myOtherThing.url is 'http://localhost:8080/myapp/foo'"
    },{
        "@title"        :   "Using your own Factories in an IoC Configuration",
        "@description"  :   "The IoC Container will also let you specify a factory and a factory method "+
                            "which can used to create other application managed components (using the 'ref://' "+
                            "prefix).",
        source          :   ""+
            "Claypool.Configuration{\n"+
            "   ioc: [\n"+
            "       { id: 'myThingFactory', clazz:'MyApp.Things.ThingFactory',\n"+
            "           options:[{a:1, b:2, c:3}]\n"+
            "       },\n"+
            "       { id: 'myOtherThing', clazz:'MyApp.Things.OtherThing',\n"+
            "           options:[{d:4, e:5, f:6}],\n"+
            "           factory:'ref://myThingFactory',\n"+
            "           factoryMethod:'create'//optional 'create' is used by default\n"+
            "       }\n"+
            "   ]\n"+
            "};\n"+
            "// Assumes the app has been initialized.\n"+
            "var myOtherThing = Claypool.$('myOtherThing');\n"+
            "// Claypool uses the specified factory to create the object"
    }],
    clazz       :   [{
        "@name"         :   "Container$Class",
        "@id"           :   "Claypool.IoC.Container$Class",
        "@description"  :   "The IoC Container is responsible for maintaining references to Instances it has "+
                            "created with the InstanceFactory and it shares all the objects it stores with the "+
                            "Application Context.  You'll probably never use the IoC container directly becuase "+
                            "it's job is primarily to hide the details of how Application Managed objects are created "+
                            "at runtime when the object is first referenced.",
        "@summary"      :   "",
        "@extends"      :   "Claypool.Application.ContextContributor$Class",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.IoC.Container$Class.constructor",
            "@description"  :   "",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new Container."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "get",
            "@id"           :   "Claypool.IoC.Container$Class.get",
            "@description"  :   "Searches the container to determine if the object has already been created otherwise "+
                                    "creates it using the factory, storing it for fast access later.",
            "@summary"      :   "",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    ""
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "registerContext",
            "@id"           :   "Claypool.IoC.Container$Class.registerContext",
            "@description"  :   "Used internally to register the IoC container with the Application Context.  ",
            "@summary"      :   "See Claypool.Application.ContextContributor for details.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "InstanceFactory$Class",
        "@id"           :   "Claypool.IoC.InstanceFactory$Class",
        "@description"  :   "The Instance Factory is responsible for storing all known ioc configurations and "+
                            "providing the ability to create any one of them by simply referencing the configuration id.",
        "@summary"      :   "",
        "@extends"      :   "Claypool.BaseFactory$Class",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.IoC.InstanceFactory$Class.constructor",
            "@description"  :   "Creates a new InstanceFactory.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new InstanceFactory."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "create",
            "@id"           :   "Claypool.IoC.InstanceFactory$Class.create",
            "@description"  :   "",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "An id used to determine the configuration the factory will use to create the object."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "updateConfigurationCache",
            "@id"           :   "Claypool.IoC.InstanceFactory$Class.updateConfigurationCache",
            "@description"  :   "The Factory store a collection of configurations which allow the 'create' method "+
                                "to simply reference which ioc configuration it will use to create the new object. "+
                                "'updateConfigurationCache' causes the Factory to read in the available configurations "+
                                "by searching the global scope for Claypool.Configuration.ioc.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "Instance$Class",
        "@id"           :   "Claypool.IoC.Instance$Class",
        "@description"  :   "The Instance Class is a wrapper class for the Container managed object.  It stores "+
                            "the actual object in the property '_this' while also providing all the lifecycle methods "+
                            "responsible for creating and destroying the object.",
        "@summary"      :   "There are several ways to use the lifecycle hooks, by event registration or attaching AOP "+
                            "to the Instance.",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.IoC.Instance$Class.constructor",
            "@description"  :   "Creates a new Instance.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new Instance."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "precreate",
            "@id"           :   "Claypool.IoC.Instance$Class.precreate",
            "@description"  :   "This method is a lifecycle hook which is executed when an object is created.",
            "@summary"      :   "Triggers 'claypool:precreate' and provides the object and its guid as extra event info.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "create",
            "@id"           :   "Claypool.IoC.Instance$Class.create",
            "@description"  :   "This is the real brain of the IoC creation process.",
            "@summary"      :   "Triggers 'claypool:create' and provides the object and its guid as extra event info.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "postcreate",
            "@id"           :   "Claypool.IoC.Instance$Class.postcreate",
            "@description"  :   "This method is a lifecycle hook which is executed when an object is created.",
            "@summary"      :   "Triggers 'claypool:postcreate' and provides the object and its guid as extra event info.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "predestroy",
            "@id"           :   "Claypool.IoC.Instance$Class.predestroy",
            "@description"  :   "This method is a lifecycle hook which is executed when an object is destroyed.",
            "@summary"      :   "Triggers 'claypool:predestroy' and provides the object and its guid as extra event info.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "destroy",
            "@id"           :   "Claypool.IoC.Instance$Class.destroy",
            "@description"  :   "Deletes the internal reference to '_this'.",
            "@summary"      :   "Triggers 'claypool:destroy' and provides the object and its guid as extra event info.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "postdestroy",
            "@id"           :   "Claypool.IoC.Instance$Class.postdestroy",
            "@description"  :   "This method is a lifecycle hook which is executed when an object is destroyed.",
            "@summary"      :   "Triggers 'claypool:postdestroy' and provides the objects guid as extra event info.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "resolveConstructor",
            "@id"           :   "Claypool.IoC.Instance$Class.resolveConstructor",
            "@description"  :   "Used to ensure that the class, which is specified as a '.' delimited string, "+
                                "is a resolvable name, and more importantly, a function.",
            param           :   [{
                "@name"         :    "constructor",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A '.' delimited String representing the function to use a constructor."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    }],
    exception   :   [{
        "@name"         :   "ContainerError$Class",
        "@id"           :   "Claypool.IoC.ContainerError$Class",
        "@extends"      :   "Claypool.Error$Class",
        "@description"  :   "ApplicationContextError can occur when searching the Application Context, in "+
                            "particular if some context contributor throws and unexpected error.",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.IoC.ContainerError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.IoC.ContainerError",
            "@id"       :   "Claypool.IoC.ContainerError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.IoC.ContainerError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.IoC.ContainerError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    },{
        "@name"         :   "InstanceFactoryError$Class",
        "@id"           :   "Claypool.IoC.InstanceFactoryError$Class",
        "@extends"      :   "Claypool.Error$Class",
        "@description"  :   "InstanceFactoryError can occur when ",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.IoC.InstanceFactoryError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.IoC.InstanceFactoryError",
            "@id"       :   "Claypool.IoC.ContainerError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.IoC.InstanceFactoryError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.IoC.InstanceFactoryError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    },{
        "@name"         :   "ConfigurationError$Class",
        "@id"           :   "Claypool.IoC.ConfigurationError$Class",
        "@extends"      :   "Claypool.ConfigurationError$Class",
        "@description"  :   "ConfigurationError can occur when ",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.IoC.ConfigurationError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.IoC.ConfigurationError",
            "@id"       :   "Claypool.IoC.ConfigurationError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.IoC.ConfigurationError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.IoC.ConfigurationError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.ConfigurationError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    },{
        "@name"         :   "LifeCycleError$Class",
        "@id"           :   "Claypool.IoC.LifeCycleError$Class",
        "@extends"      :   "Claypool.Error$Class",
        "@description"  :   "LifeCycleError can occur when ",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.IoC.LifeCycleError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.IoC.LifeCycleError",
            "@id"       :   "Claypool.IoC.LifeCycleError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.IoC.LifeCycleError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.IoC.LifeCycleError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    },{
        "@name"         :   "ConstructorResolutionError$Class",
        "@id"           :   "Claypool.IoC.ConstructorResolutionError$Class",
        "@extends"      :   "Claypool.NameResolutionError$Class",
        "@description"  :   "ConstructorResolutionError can occur when ",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.IoC.ConstructorResolutionError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.IoC.ConstructorResolutionError",
            "@id"       :   "Claypool.IoC.ConstructorResolutionError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.IoC.ConstructorResolutionError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.IoC.ConstructorResolutionError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.NameResolutionError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    }]
};
