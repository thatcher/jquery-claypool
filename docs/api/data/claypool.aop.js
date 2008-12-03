/**
*   Claypool AOP Api Documentation
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
Claypool.AOP$Doc = {
    "@namespace"    :   "Claypool.AOP",
    "@description"  :   "Claypool's allows Aspects to be applied to Classes or instances. The target "+
                        "function (specified by 'before', 'after', or 'around') is treated as a regular "+
                        "expression and the advice is applied to all matching functions on the target.",
    example        :   [{
        "@title"        :   "Applying an Aspect to an entire Class of objects.",
        "@description"  :   "",
        source          :   ""+
            "MyApp = {\n"+
            "   Configuration : {\n"+
            "       aop:[{\n"+
            "            id        :'myAdvice',\n"+
            "            target    :'MyApp.Things.SomeThings',\n"+
            "            after     :'someFunction',//This is treated as a regular expression\n"+
            "            advice    :'MyApp.SomeAdvice'\n"+
            "       }]\n"+
            "   }\n"+
            "};\n"
    },{
        "@title"        :   "Applying an Aspect to an instance.",
        "@id"           :   "Claypool.AOP$Example_01",
        "@description"  :   "",
        source          :   ""+
            "MyApp = {\n"+
            "   Configuration : {\n"+
            "       ioc: [\n"+
            "           { id: 'myAppThing', clazz:'MyApp.Things.SomeThing'}\n"+
            "       ],\n"+
            "       aop:[{\n"+
            "            id        :'myAdvice',\n"+
            "            target    :'ref://myAppThing',\n"+
            "            after     :'someFunction',//This is treated as a regular expression\n"+
            "            advice    :'MyApp.SomeAdvice'\n"+
            "       }]\n"+
            "   }\n"+
            "};\n"
    }],
    clazz       :   [],
    exception   :   []
};
