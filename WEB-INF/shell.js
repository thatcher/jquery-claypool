/**
 * @author thatcher
 */
//When the servlet is first loaded the 'outer shell'
//is loaded.  You can load additional resources here.

try{
    print("\n\n\t@Loading shell for jquery-claypool server-side@\n");

	//env-js is our simulated browser environments so we can use all of
	//our favorite client side libraries and tricks
    load('lib/env.rhino.js');
	
	//The next line provide us with a base 'template'
	//and set the server window location.  This must happen before 
	//we load the rest of the javascript so that we can have a 
	//server side context from which to begin defining our application
	//behavior
	window.location = cwd+'/index.html';
	
    print("Loaded shell. "+ window.location);         
	
}catch(e){
    print(  "\t/********************************************************\n"+
            "\t * ERROR LOADING SHELL!!"+
            "\t *    details :"+
            "\t *    " + e.toString() + 
            "\t ********************************************************/"  );
}

