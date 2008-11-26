/**
* Contains some fixtures used for unittests.
*/

/*
*   Claypool.AOP 
*   
*   fixture - AOPTargetTestClass - Defines a local object AOPTargetTestClass (all aop methods apply only to js objects with a prototype),
*   and gives it a prototype.  We use the internal variable bar to detemine which method was able to
*   affect the object first.
*/
AOPTargetTestClass = function(){
    this.bar = 0;
    //A private internal method (not an attribute of AOPTargetTestClass.prototype)
    this.plop = function(param){
        equals(param, 4, "AOP target called with expected parameter ");//14,17
        this.bar = param + 1;
        return this.bar;
    };
    return this;
};
//We create a method on the fixture class to add a 'before' aspect to.  The method 
//simply inspects some intrnal variables, sets an internal variable, and returns a
//fixed constant 
AOPTargetTestClass.prototype.goop = function(param){
       equals(this.bar, 1, "AOP 'before' pointcut can modify the object"); //5,10
       equals(param, 2, "AOP 'before' pointcut cannot modify the parameter"); //6,11
       this.bar = param;
       return 4;
};

//Serves as the model in the mvc tests
TestClass = function(options){
    this.goop = "goop_value";
    this.blah = "blah_value";
    this.foo = options&&options.foo?options.foo:"default_foo";
    this.post = function(o){
        ok(true, "called post");
        equals(1,o.x,"The argument o.x was transformed as expected to TestClass.post");
        equals(2,o.y,"The argument o.y was transformed as expected to TestClass.post");
        equals(3,o.z,"The argument o.z was transformed as expected to TestClass.post");
        return true;
    };
    this.success = function(o){
        ok(true, "called success");
        equals(4,o.u,"The argument o.u was passed as expected to TestClass.success");
        equals(5,o.v,"The argument o.v was passed as expected to TestClass.success");
        equals(6,o.w,"The argument o.w was passed as expected to TestClass.success");
        return true;
    };
};

TestClassFactory = function(options){
    this.options = options?options:{};
    this.create = function(o){
        o = o?o:this.options;
        return new TestClass(o);
    };
};

//Serves as the view in the mvc tests
jQuery.fn.jTestClass = function(options){
    this.goop = "goop_value";
    this.blah = "blah_value";
    this.foo = options&&options.foo?options.foo:"default_foo";
    
    this.submit = function(a,b,c){
        ok(true, "called submit");
        equals(1,a,"The argument a was passed as expected to jTestClass.submit");
        equals(2,b,"The argument b was passed as expected to jTestClass.submit");
        equals(3,c,"The argument c was passed as expected to jTestClass.submit");
        return true;
    };
    this.set = function(d,e,f){
        ok(true, "called set");
        equals(14,d,"The argument d was transformed as expected to jTestClass.set");
        equals(15,e,"The argument e was transformed as expected to jTestClass.set");
        equals(16,f,"The argument f was transformed as expected to jTestClass.set");
        return true;
    };
};

TestController = function(options){
    //default handler
    this.handle = function(data, mvc){
        this.view = this.view||Claypool.$(this.viewRef||"#testView01");
        mvc.v = this.view;
        mvc.m = {fixture:this.fixture};
        mvc.v.update(mvc);
    };
    //custom action handlers for 'multi- action' controllers
    this.action05 = function(data, mvc){
        this.view = this.view||Claypool.$(this.viewRef||"#testView05");
        mvc.v = this.view;
        mvc.m = {fixture:this.fixture};
        mvc.v.update(mvc);
    };
}
TestAsyncController = function(options){
    //default handler
    this.handle = function(data, mvc){
        stop();
        var _this = this;
        this.view = this.view||Claypool.$(this.viewRef||"#testView01");
        jQuery.ajax({
            type:"GET",
            url:"data/with_fries.xml",
            dataType:"xml",
            success:function(xml){
                mvc.m = {fixture:_this.fixture};
                mvc.v = _this.view;
                mvc.v.update(mvc);
                start();
            }
        });
    };
    //custom action handlers for 'multi- action' controllers
    this.action04 = function(data, mvc){
        this.view = this.view||Claypool.$(this.viewRef||"#testView04");
        mvc.v = this.view;
        mvc.m = {fixture:this.fixture};
        mvc.v.update(mvc);
    };
    //custom action handlers for 'multi- action' controllers
    this.action06 = function(data, mvc){
        this.view = this.view||Claypool.$(this.viewRef||"#testView06");
        mvc.v = this.view;
        mvc.m = {fixture:this.fixture};
        mvc.v.update(mvc);
    };
};

TestView = function(options){
    this.update = function(mvc){
       equals(mvc.m.fixture, this.fixture, "MVC completed. Fixtures checked.");
    }
}

TestEventController  = function(){
    jQuery.extend(true, this,   new TestController());
};
TestAsyncEventController = function(){
    jQuery.extend(true, this,  new TestAsyncController());
};

TestLinkController  = function(){
    jQuery.extend(true, this,   new TestController());
};
TestAsyncLinkController = function(){
    jQuery.extend(true, this,  new TestAsyncController());
};

TestFormController  = function(){
    jQuery.extend(true, this,   new TestController());
};
TestAsyncFormController = function(){
    jQuery.extend(true, this,  new TestAsyncController());
};





