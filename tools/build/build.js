load(
    "javascript/tools/js/ParseMaster.js", 
    "javascript/tools/js/pack.js", 
    "javascript/tools/js/writeFile.js"
    );

var out = readFile( arguments[0] );

writeFile( arguments[1], pack( out, 62, true, false ) );
