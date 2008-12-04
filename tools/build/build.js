load(
    "tools/js/ParseMaster.js", 
    "tools/js/pack.js", 
    "tools/js/writeFile.js"
    );

var out = readFile( arguments[0] );

writeFile( arguments[1], pack( out, 62, true, false ) );
