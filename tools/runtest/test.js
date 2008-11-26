// - Javascript and hence rhino do not provide XMLHttpRequest, 
// - The browser does, so since we are simulating the browser
// - environment we need to provide this.
print("Registering implementation of XMLHttpRequest");
defineClass("claypool.continuation.JsXMLHttpRequest");

// - Loading jQuery requires we initally fool it into thinking
// - a global navigator and window object exist.
print("Loading jQuery");
var navigator = {userAgent:"BirdDog"}; 
var window = {};
load("javascript/lib/jquery/dist/jquery.js");
var jQuery = window.jQuery;

// - Claypool is loaded second as it has some runtime 
// - dependency on jQuery
print("Loading Claypool");
load("javascript/dist/claypool.js");
load("javascript/test/application.context.js");

// - Load Resig's Browser
print("Loading BirdDog");
load("javascript/tools/runtest/env.js");

// - The test environment needs a dom to attach to to provide
// - the basis for many of the tests.
print("Loading Location...");
window.location = "javascript/test/application.html";
print("Finished Loading Location...");
window.onload = function(){
    // Load prequisites and the test runner
    load("javascript/lib/plugins/livequery/jquery.livequery.js",
        "javascript/tools/runtest/testrunner.js");
        
    // Load the test fixtures
    load("javascript/test/test.application.js");
    
    //The tests run by virtue of being loaded.
    print(" Loading the tests ");
    load(
        "javascript/test/unit/claypool.core.js",
        "javascript/test/unit/claypool.aop.js",
        "javascript/test/unit/claypool.ioc.js",
        "javascript/test/unit/claypool.mvc.js",
        "javascript/test/unit/claypool.logging.js",
        "javascript/test/unit/claypool.application.js"
    );
    
    // Display the results
    results();
};
