/**
*   Claypool Application Api Documentation
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
Claypool.Application$Doc = {
    "@namespace"    :   "Claypool.Application",
    "@description"  :   "Claypool.Application is the entry point for booting up your application "+
                        "once the document is loaded. Initializing causes Claypool to read all "+
                        "configurations.  More importantly Claypool.Application defines the Application Context "+
                        "and allows other classes to contribute easily to that context.", 
    "@summary"      :   "In general 'Initialize' is the only function you'll need to "+
                        "use unless you are writing a Plugin to extend Claypools Application Framework.",
    example         :   [{
        "@title"        :   "Initializing your Application",
        "@description"  :   "By convention a Claypool Application will use jQuery to ensure "+
                            "the document is loaded, then call Initialize. When the "+
                            "Application is loaded the event 'ApplicationLoaded' is triggered." ,
        source          :   ""+
            "jQuery(document).ready(function(){\n"+
            "   Claypool.Application.Initialize(function(){\n"+
            "        //closures are cool, do stuff after claypool fires up\n"+
            "        //but before it triggers the 'ApplicationLoaded' event\n"+
            "    });\n"+
            "});"
    }],
    method      :   [{
        "@name"         :   "getContext",
        "@id"           :   "Claypool.Application.getContext",
        "@description"  :   "The core method 'Claypool.$' is actually an alias for 'Claypool.Application.getContext().get' (whew!) " +
                            "'get Context' returns the Application Context which simply provides easy access to any "+
                            "object the application manages in application scope.",
        "@summary"      :   "The core method 'Claypool.$' is actually an alias for 'Claypool.Application.getContext().get",
        "example"       :   ""+
            "var appContext = Claypool.Application.getContext();\n"+
            "var myAppComponent = appContext.get('myAppComponent');",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    },{
        "@name"         :   "Initialize",
        "@id"           :   "Claypool.Application.Initialize",
        "@summary"      :   "Easily boot Claypool and allows extension of the boot process.",
        "@description"  :   "Internally Causes Claypool to instantiate a new IoC, MVC, and AOP container which in turn "+
                            "initialize by reading in their respective configurations.  Initialize allows an optional "+
                            "callback to be provided so you can call code after the core containers are loaded, but before "+
                            "the 'ApplicationLoaded' event is triggered on the document.",
        "example"       :   ""+
            "jQuery(document).ready(function(){\n"+
            "   Claypool.Application.Initialize(function(){\n"+
            "        //closures are cool, do stuff after claypool fires up\n"+
            "        //but before it triggers the 'ApplicationLoaded' event\n"+
            "    });\n"+
            "});",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    },{
        "@name"         :   "Reinitialize",
        "@id"           :   "Claypool.Application.Reinitialize",
        "@summary"      :   "Easily add new configuration information at runtime.",
        "@description"  :   "Internally Causes Claypool to update the configuration cache of the IoC, MVC, and AOP containers "+
                            "by re-reading in their respective configurations.  Reinitialize allows an optional "+
                            "callback to be provided so you can call code after the core containers configurations are reloaded, but before "+
                            "the 'ApplicationReloaded' event is triggered on the document.",
        "example"       :   ""+
            "Claypool.Application.Reinitialize(function(){\n"+
            "     //closures are cool, do stuff after claypool re-reads the configuration \n"+
            "     //but before it triggers the 'ApplicationReloaded' event\n"+
            "});",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    }],
    clazz       :   [{
        "@name"         :   "Context$Class", 
        "@id"           :   "Claypool.Application.Context$Class",
        "@description"  :   "The Application Context provides the foundation for a consistent and flexible  "+
                            "retreival of any object that is managed by the Application.  In general this allows "+
                            "less reliance on singleton patterns making code more reusable.  It also allows the IoC "+
                            "container to inject objects into objects using the 'ref://' protocol in configurations.",
        "@extends"      :   "Claypool.AbstractContext$Class",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Application.Context$Class.constructor",
            "@description"  :   "Creates a new Application Context.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new Context."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "put",
            "@id"           :   "Claypool.Application.Context$Class.put",
            "@description"  :   "Adds an item to the Application Context",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A unique identifier accross the application scope."
            },{
                "@name"         :    "object",
                "@type"         :    "Any",
                "@required"     :    "true",
                "@description"  :    "The item to be stored in application scope."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "get",
            "@id"           :   "Claypool.Application.Context$Class.get",
            "@description"  :   "Searches the Application Context for an item stored by the given id.",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A unique key used to identify the object in the applicationcontext."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "ContextContributor$Class", 
        "@id"           :   "Claypool.Application.ContextContributor$Class",
        "@description"  :   "The ContextContributor Class allows other classes to be searched (in order of registration) "+
                            "whenever the Application Context is searched.",
        "@extends"      :   "Claypool.ContextContributor$Class",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Application.ContextContributor$Class.constructor",
            "@description"  :   "Creates a new ContextContributor.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new ContextContributor."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "registerContext",
            "@id"           :   "Claypool.Application.ContextContributor$Class.registerContext",
            "@description"  :   "Attaches this class to the Application Context.",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A unique id identifying this context among contibutors."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "Aware$Class", 
        "@id"           :   "Claypool.Application.Aware$Class",
        "@description"  :   "A class can easy have built in access to the global application context by "+
                            "extending this class.",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Application.Aware$Class.constructor",
            "@description"  :   "Creates a new Application Aware class.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new Aware object."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "getApplicationContext",
            "@id"           :   "Claypool.Application.Aware$Class.constructor",
            "@description"  :   "Returns the global Application Context.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    }],
    exception   :   [{
        "@name"         :   "ContextError$Class",
        "@id"           :   "Claypool.Application.ContextError$Class",
        "@extends"      :   "Claypool.Error$Class",
        "@description"  :   "An Application ContextError can occur when searching the Application Context, in "+
                            "particular if some context contributor throws and unexpected error.",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Application. ContextError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.Application.ContextError",
            "@id"       :   "Claypool.Logging.Application$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.Application.ContextError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.Application.ContextError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    }]
};
