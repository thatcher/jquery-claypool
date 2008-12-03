/**
*   Claypool Core Api Documentation
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
Claypool$Doc = {
    "@namespace"    :   "Claypool",
    "@description"  :   "Claypool core contains basic interfaces, utility and simple implementations "+
                        "of commonly used functions and patterns.  Most importantly Claypool provides " +
                        "easy access to application managed components. Claypool.Configuration allows "+
                        "all application components to remain uninitialized until they are used (reducing "+
                        "considerably the memory consumed for large applications). \n\t Claypool.Configuration "+
                        "also encourages the use of Namespace aliasing so that the Claypool Namespace doesn't "+
                        "need to appear anywhere in your own code.  This encourages the independence of your " +
                        "code from the Claypool Framework (in fact Claypool uses aliases internally to avoid "+
                        "hard coded dependencies on jQuery).  Namespace Aliases also encourage competition by relying "+
                        "on implementations by interface.", 
    example        :   [{
        "@title"        :   "Booting and Using Your App with Clayool",
        "@description"  :   "Claypool encourages a single, centralized configuration for an "+
                            "application, or at least one per major application subsystem. "+ 
                            "As applications become large they often suffer from obscurity "+
                            "because important configuration information is buried deep inside "+
                            "the code.  Claypool can help you 'inject' your own codes configuration "+
                            "using Claypool.IoC, and allow powerful configuration settings for "+
                            "Category Logging, Model-View-Control entry points, and Aspects." +
                            "This process also allows large application to consume significantly less "+
                            "memory because the objects are not configured and created until they are needed.",
        source      :   ""+
            "/**  -   BOOT THE APP  - **/\n"+
            "jQuery(document).ready(function(){\n"+
            "    // Causes Claypool to read in your configuration and start\n"+
            "    //  managing application components.\n"+
            "   Claypool.Application.Initialize(function(){\n"+
            "        //closures are cool, do stuff after claypool fires up\n"+
            "        //but before it triggers the 'ApplicationLoaded' event\n"+
            "    });\n"+
            "    // Claypool also provides an event 'ApplicationLoaded' that\n"+
            "    // is triggered when the Application Container is loaded.\n"+
            "});\n"
    },{
        "@title"    :   "Creating a Simple Configuration",
        "@description"  :   "Configurations are json and simply need to be discoverable via"+
                            "the global 'Claypoo.Configuration'.  If you want your application to "+
                            "the only one, you can simply use an alias, or as we show below, you "+
                            "can allow your application or subapplication to simple contribute to "+
                            "the overall application.",
        source      :   ""+
            "MyApp.Configuration = {\n"+
            "    /**\n"+
            "    *   Stuff goes here.  It's json. Pretty easy.  \n"+
            "    *   Just reference each modules documentation  \n"+
            "    *   for their options.\n"+
            "    **/\n"+
            "};\n"+
            "// Claypool.extend is an alias for, or is 'provided by'\n"+
            "// jQuery.extend\n"+
            "Claypool.extend(true, Claypool.Configuration, MyApp.Configuration);\n"
    },{
        "@title"        :   "Keeping Claypool out of your Namespaces.",
        "@description"  :   "It's actually recommended practice to try to keep "+
                            "Claypool's name out of your code.  The reason is simple: "+
                            "it promotes code that is not inwardly reliant on the framework "+
                            "supporting it.  It also encourages competition by allowing "+
                            "other implementations to be plugged in as long as they implement "+
                            "the same 'interface'.",
        source      :   ""+
            "MyApp = {\n"+
            "    // Namespace Aliasing promotes independence of app from framework!\n"+
            "    extend      : Claypool.extend, //By default this is jQuery.extend\n"+
            "    $           : Claypool.$,\n"+
            "    createGUID  : Claypool.createGUID,\n"+
            "    MVC         : Claypool.MVC,\n"+
            "    Logging     : Claypool.Logging,\n"+
            "    AOP         : Claypool.AOP,\n"+
            "    Configuration:{ \n"+
            "        /**\n"+
            "         *   Stuff goes here.  It's json. Pretty easy.  \n"+
            "         *   Just reference each modules documentation  \n"+
            "         *   for their options.\n"+
            "         **/\n"+
            "    }\n"+
            "};\n"+
            "MyApp.extend(true, Claypool.Configuration, MyApp.Configuration);\n"
    }],
    method : [ {
        "@name"         :   "$",
        "@id"           :   "Claypool.$",
        "@summary"      :   "Easy access to application components.",
        "@description"  :   "The Claypool.$ function is an alias for Claypool.Application.getApplicationContext().get(id). "+
                            "In general it's like retreiving a Dom node by id with jQuery.  Many parts of an Application "+
                            "Configuration can contribute to the application context so it's important to provide unique ID's. "+
                            "Application managed components are covered more in Claypool.Application but the big "+
                            "picture is they are objects that exist as configurations until they are actually used, dramatically "+
                            "speeding up load times and reducing memory for large apps.  Like jQuery, this is our 'Write Less, Do More' "+
                            "function.  The returned object is chainable if the component is chainable.",
        "example"       :   ""+
            "var myAppComponent = Claypool.$('#myComponent');",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    }, {
        "@name"         :   "createGUID",
        "@id"           :   "Claypool.createGUID",
        "@summary"      :   "Convenient generator for a unique id in local memory space.",
        "@description"  :   "It's not unusual for an application component to need to generate "+
                            "an id thats unique across other ids generated by the same function "+
                            "in memory.  This static method simply uses a sequence starting at the "+
                            "negative value of " +Claypool.guid+ " and increases by one with each call.",
        "example"       :   ""+
            "var guid = MyApp.createGUID();\n"+
            "var nextGuid = MyApp.createGUID();",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    },{
        "@name"         :   "resolveName",
        "@id"           :   "Claypool.resolveName",
        "@summary"      :   "Resolves namespaced objects from a string",
        "@description"  :   "Many parts of Claypool will specifiy a reference to an class "+
                            "method, or attribute as a fully qualified (namespaced) string. "+
                            "This simple function allows those referenced paths to be resolved" +
                            "to the script object if it actually exists.",
        "example"       :   ""+
            "MyApp = { This :{ AndThat: 'someValueOrFunctionOrWhatever'}};\n"+
            "var object = MyApp.resolveName('MyApp.This.AndThat');",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    },{
        "@name"         :   "extend",
        "@id"           :   "Claypool.extend",
        "@summary"      :   "Via claypool.providers.js, extend is by default an alias for jQuery.extend.",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    },{
        "@name"         :   "isFunction",
        "@id"           :   "Claypool.isFunction",
        "@summary"      :   "Via claypool.providers.js, extend is by default an alias for jQuery.isFunction.",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    }],
    clazz:[{
        "@name"         :   "CachingStrategy$Interface",
        "@id"           :   "Claypool.CachingStrategy$Interface",
        "@description"  :   "Application components often need a way cache information and "+
                            "retreive it at a later time.  Because this pattern is so pervasive "+
                            "the CachingStrategy$Interface provides a simple set of methods "+
                            "to allow consistent use across the implementations.",
        "@summary"      :   "Claypool exposes several interface contracts that allow "+
                            "you to develop useful implementations.  Interfaces are "+
                            "not checked and will result in runtime errors being thrown.",
        method : [ {
            "@name"         :   "add",
            "@id"           :   "Claypool.CachingStrategy$Interface.add",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Should return void and overwrite existing value with same id. ",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A unique id used to easily identify the cached object."
            },{
                "@name"         :"object",
                "@type"         :"Any",
                "@required"     :"true",
                "@description"  :"The item to be cached."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "remove",
            "@id"           :   "Claypool.CachingStrategy$Interface.remove",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Should return a non-negative integer if succesful or null if the item wasn't found. ",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "The id of the object to be removed. "
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "find",
            "@id"           :   "Claypool.CachingStrategy$Interface.find",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Either return the cached item represented by the id or 'null' if no match is found.",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "The id of the object to be returned."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "clear",
            "@id"           :   "Claypool.CachingStrategy$Interface.clear",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Empties the cache and returns void.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "SimpleCachingStrategy$Class",
        "@id"           :   "Claypool.SimpleCachingStrategy$Class",
        "@implements"   :   "Claypool.CachingStrategy$Interface",
        "@description"  :   "The SimpleCachingStrategy isn't really a 'caching' strategy in that "+
                            "it stores items in memory.  It does provide a very easy way to begin "+
                            "implementing caching that will allow more advanced strategies to be used "+
                            "in the future, as well as providing the fastest strategy possible.",
        method : [ {
            "@name"         :   "constructor",
            "@id"           :   "Claypool.SimpleCachingStrategy$Class.constructor",
            "@description"  :   "Creates a Cache with the SimpleCachingStrategy.",
            "@summary"      :   "The Claypool.SimpleCachingStrategy implements the "+
                                "Claypool.CachingStrategy interface.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new SimpleCachingStrategy."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "add",
            "@id"           :   "Claypool.SimpleCachingStrategy$Class.add",
            "@description"  :   "Adds an item to a Simple Cache",
            "@summary"      :   "See Claypool.CachingStrategy$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "remove",
            "@id"           :   "Claypool.SimpleCachingStrategy$Class.remove",
            "@description"  :   "Removes an item from a Simple Cache",
            "@summary"      :   "See Claypool.CachingStrategy$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "find",
            "@id"           :   "Claypool.SimpleCachingStrategy$Class.find",
            "@description"  :   "Retreives items from the SimpleCache",
            "@summary"      :   "See Claypool.CachingStrategy$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "clear",
            "@id"           :   "Claypool.SimpleCachingStrategy$Class.clear",
            "@description"  :   "Clearing the cache resets it.",
            "@summary"      :   "See Claypool.CachingStrategy$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "Router$Class",
        "@id"           :   "Claypool.Router$Class",
        "@extends"      :   "Claypool.SimpleCachingStrategy$Class",
        "@description"  :   "The Claypool Router is a powerful little extension of the SimpleCachingStrategy "+
                            "that allows a collection of objects to be retrieved based on a regular expression "+
                            "which is applied against a given property of the objects.  ",
        "@summary"      :   "The Claypool.Router provides a simple approach to flexible retreival "+
                            "of objects based on a regular expression provided by each object.",
        method          :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Router$Class.constructor",
            "@description"  :   "Creates a new instance of the Router. ",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new SimpleCachingStrategy."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"     :   "compile",
            "@id"       :   "Claypool.Router$Class.compile",
            "@description"  :   "A router is compiled by passing an array of objects and a key "+
                                "name.  The key name may be a '|' delimited list of names to "+
                                "use in order of precendence.  Each object in the array should have "+
                                "a regular expression (in the form of a String) named as one of the "+
                                "keys.  It is compiled into a regular expression and the compiled "+
                                "expression and original object is stored for later use.",
            param           :   [{
                "@name"         :    "patternMap",
                "@type"         :    "Array of Objects",
                "@required"     :    "true",
                "@description"  :    "The Array of Objects must all contain one of the properties specified in the "+
                                     "patternKey.  The specified property will be treated as a regular expression."
            },{
                "@name"         :    "patternKey",
                "@type"         :    "String (optionally delimeted by '|')",
                "@required"     :    "true",
                "@description"  :    "A list of properties names whose value is treated as a regular expression "+
                                    "used to test if an object matches a 'route'."
            }],
            "@summary"      :   "Chainable.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"     :   "first",
            "@id"       :   "Claypool.Router$Class.first",
            "@description"  :   "When the 'first' method is called the compiled patterns are tested and the "+
                                "first match is return as an array of objects containing the 'pattern' and "+
                                "'payload'. The payload is the original object compiled into the router.",
            param           :   [{
                "@name"         :    "string",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "The specified property will be treated as a regular expression."
            }],
            "@summary"      :   "Returns an Array of length 0 or 1, containing the first match or if no match "+
                                "is found, an empty array.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"     :   "all",
            "@id"       :   "Claypool.Router$Class.all",
            "@description"  :   "When the 'all' method is used the compiled patterns are tested and  "+
                                "every match is return as an array of objects containing the 'pattern' and "+
                                "'payload'. The payload is the original JSON object compiled "+
                                "into the router.",
            param           :   [{
                "@name"         :    "string",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "The specified property will be treated as a regular expression."
            }],
            "@summary"      :   "Returns an Array of length 0 or more, containing the all matches or if no match "+
                                "is found, an empty array.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
        
    },{
        "@name"         :   "AbstractContext$Class",
        "@id"           :   "Claypool.AbstractContext$Class",
        "@extends"      :   "Claypool.SimpleCachingStrategy$Class",
        "@description"  :   "The Claypool.AbstractContext is also a powerful extension of the SimpleCachingStrategy "+
                            "that reduces it down to a simple 'put'/'get' model.  This model is common in server-side " +
                            "application frameworks and allows a context to be used in a consistent way to provide easy "+
                            "access to a 'bag' of objects (usually in a hierarchy like 'application > session > request'). "+
                            "The methods 'put' and 'get' are obviously very close to the CachingStrategy 'add' and 'find', "+
                            "but allow an additional level of abstraction to hide the details of the contexts internal "+
                            "management.",
        "@summary"      :   "Abstract Classes, like Interfaces, in Claypool are not constrained other than by-convention. As " +
                            "such they will result in runtime expections being thrown if the required methods defintions are not"+
                            "implemented by the extending class.",
        method          :    [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Router$Class.constructor",
            "@description"  :   "Creates a new instance of an AbstractContext. ",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new SimpleCachingStrategy."
            }],
            "@author"       :       "Chris Thatcher",
            "@email"        :       "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "put",
            "@id"           :   "Claypool.Router$Class.put",
            "@description"  :   "Can't use interface unless the implementation is provided.",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A unique id used to easily identify the in the given context."
            },{
                "@name"         :    "object",
                "@type"         :    "Any",
                "@required"     :    "true",
                "@description"  :    "The item to be available via the given content."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "get",
            "@id"           :   "Claypool.Router$Class.get",
            "@description"  :   "Can't use interface unless the implementation is provided.",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "The id of the object to be returned."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "ContextContributor$Class",
        "@id"           :   "Claypool.ContextContributor$Class",
        "@extends"      :   "Claypool.AbstractContext$Class",
        "@description"  :   "The Claypool.ContextContributor provides the additional interface method "+
                            "'registerContext' which is intended to allow a declaritive approach for allowing " +
                            "'plug-ins' to include their own context to a given pool of context.  For example Claypool's "+
                            "own MVC, IoC, and AOP modules each contribute to the Claypool.ApplicationContext.",
        "@summary"      :   "Abstract Classes, like Interfaces, in Claypool are not constrained other than by-convention. As " +
                            "such they will result in runtime expections being thrown if the required methods defintions are not "+
                            "implemented by the extending class.",
        method          :    [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.ContextContributor$Class.constructor",
            "@description"  :   "Creates a new instance of a ContextContributor. ",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new SimpleCachingStrategy."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "registerContext",
            "@id"           :   "Claypool.ContextContributor$Class.registerContext",
            "@description"  :   "Can't use interface unless the implementation is provided.",
            param           :   [{
                "@name"         :   "id",
                "@type"         :   "Object",
                "@required"     :   "true",
                "@description"  :   "The object that will be searchable via 'get' while attempting to resolve a request for "+
                                    "an object in the given scope."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "Factory$Interface",
        "@id"           :   "Claypool.Factory$Interface",
        "@description"  :   "The Factory pattern is one of the most common and useful patterns "+
                            "for applications.  It is codified clearly in this simple interface which "+
                            "provides the single method 'create'",
        "@summary"      :   "Claypool exposes several interface contracts that allow "+
                            "you to develop useful implementations.  Interfaces are "+
                            "not checked and will result in runtime errors being thrown.",
        method : [ {
            "@name"         :   "create",
            "@id"           :   "Claypool.Factory$Interface.create",
            "@description"  :   "Cannot use interface unless the implementation is provided.",
            param           :   [{
                "@name"         :    "any",
                "@type"         :    "Any (Implemtation Specific)",
                "@required"     :    "true",
                "@description"  :    "Based on the arguments, should return the appropriate instance."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "Configurable$Interface",
        "@id"           :   "Claypool.Configurable$Interface",
        "@description"  :   "The Configurable$Interface defines four key methods that need to be implemented "+
                            "to allow for a consistent treatment of configuration.  In particluar Claypool.BaseFactory "+
                            "will implement three of these and only leaves 'updateConfigurationCache' to be "+
                            "implemented by the extending class.  However this interface is provided for clarity and to "+
                            "allow other configuration strategies to be defined and used as well.",
        "@summary"      :   "Claypool exposes several interface contracts that allow "+
                            "you to develop useful implementations.  Interfaces are "+
                            "not checked and will result in runtime errors being thrown.",
        method : [ {
            "@name"         :   "getConfiguration",
            "@id"           :   "Claypool.Configurable$Interface.getConfiguration",
            "@description"  :   "Should return the configuration.",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "setConfiguration",
            "@id"           :   "Claypool.Configurable$Interface.getConfiguration",
            "@description"  :   "Should return the configuration. ",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            param           :   [{
                "@name"         :   "configuration",
                "@type"         :   "Object",
                "@required"     :   "true",
                "@description"  :   "Internally this should modify a property of 'Claypool.Configuration' that "+
                                    "is specific to the implementing class."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "loadConfiguration",
            "@id"           :   "Claypool.Configurable$Interface.loadConfiguration",
            "@description"  :   "Should implement some strategy for finding the configuration. ",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            param           :   [{
                "@name"         :   "url",
                "@type"         :   "String",
                "@required"     :   "true",
                "@description"  :   "The url is retrieved and the given 'configurationId' is applied."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "updateConfigurationCache",
            "@id"           :   "Claypool.Configurable$Interface.updateConfigurationCache",
            "@description"  :   "The live/active configuration is not modified after setConfiguration, "+
                                "rather it's stored latently until this method is called and implements "+
                                "some strategy merge with or replace the global configuration.",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "BaseFactory$Class",
        "@id"           :   "Claypool.BaseFactory$Class",
        "@description"  :   "The Claypool.BaseFactory is still Abstract, but does define the basic 'getConfiguration', "+
                            "'setConfiguration' and 'loadConfiguration' which establishes the Core patterns for "+
                            "the IoC, MVC, and AOP modules.  The 'updateConfigurationCache' is left for each module to modify "+
                            "based on individual requirements.",
        "@summary"      :   "Abstract Classes, like Interfaces, in Claypool are not constrained other than by-convention. As " +
                            "such they will result in runtime expections being thrown if the required methods defintions are not"+
                            "implemented by the extending class.",
        "@implements"   :   "Claypool.Factory$Interface Claypool.Configurable$Interface",
        "@extends"      :   "Claypool.SimpleCachingStrategy$Class",
        method          :    [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.BaseFactory$Class.constructor",
            "@description"  :   "Creates a new instance of a Claypool.BaseFactory.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new BaseFactory."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "loadConfiguration",
            "@id"           :   "Claypool.BaseFactory$Class.loadConfiguration",
            "@description"  :   "Claypool can load dynamically via AJAX when Claypool.Configuration "+
                                "is unavailable using the relaive url 'application.context.js'.",
            "@summary"      :   "See Claypool.Configurable$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "getConfiguration",
            "@id"           :   "Claypool.BaseFactory$Class.getConfiguration",
            "@description"  :   "Either retuen the configuration or null if none exists and can't be loaded.",
            "@summary"      :   "See Claypool.Configurable$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "setConfiguration",
            "@id"           :   "Claypool.BaseFactory$Class.setConfiguration",
            "@description"  :   "Modifies a property of Claypool.Configuration based on the given implementations.",
            "@summary"      :   "See Claypool.Configurable$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "updateConfigurationCache",
            "@id"           :   "Claypool.BaseFactory$Class.updateConfigurationCache",
            "@description"  :   "Can't use interface unless the implementation is provided.",
            "@summary"      :   "See Claypool.Configurable$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "create",
            "@id"           :   "Claypool.BaseFactory$Class.create",
            "@description"  :   "Can't use interface unless the implementation is provided.",
            "@summary"      :   "See Claypool.Factory$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    }],
    exception:[{
        "@name"         :   "Error$Class",
        "@id"           :   "Claypool.Error$Class",
        "@description"  :   "This class serves as the basis for all Claypool defined errors.",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of there position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Error$Class.constructor"
        }],
        example        :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.Error",
            "@id"       :   "Claypool.Error$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.Error();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    },{
        "@name"         :   "ConfigurationError$Class",
        "@id"           :   "Claypool.ConfigurationError$Class",
        "@extends"      :   "Claypool.Error$Class",
        "@description"  :   "ConfigurationError can occur when trying to load a configuration "+
                            "by any class extending the Claypool.BaseFactory.",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.ConfigurationError$Class.constructor"
        }],
        example        :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.ConfigurationError",
            "@id"       :   "Claypool.ConfigurationError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.ConfigurationError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.ConfigurationError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    },{
        "@name"         :   "NameResolutionError$Class",
        "@id"           :   "Claypool.NameResolutionError$Class",
        "@extends"      :   "Claypool.Error$Class",
        "@description"  :   "NameResolutionError can occur when trying to resolve a string "+
                            "to an object using Claypool.resolveName.",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.NameResolutionError$Class.constructor"
        }],
        example        :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.NameResolutionError",
            "@id"       :   "Claypool.NameResolutionError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.NameResolutionError();\n"+
                "}catch(e){\n"+
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
