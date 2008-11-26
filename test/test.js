load( "web/javascript/tools/js/writeFile.js", "web/javascript/tools/js/parse.js" );

function addParams(name, params) {
	if(params.length > 0) {
		name += "(";
		for ( var i = 0; i < params.length; i++) {
			name += params[i].type + ", ";
		}
		return name.substring(0, name.length - 2) + ")";
	} else {
		return name + "()";
	}
}
function addTestWrapper(name, test) {
	return 'test("' + name + '", function() {\n' + test + '\n});';
}

var dir = arguments[1];
var jq = parse( read(arguments[0]) );

var testFile = [];

String.prototype.decode = function() {
	return this.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
};

for ( var i = 0; i < jq.length; i++ ) {
	if ( jq[i].tests.length > 0 ) {
		var method = jq[i];
		var name = addParams(method.name, method.params);
		for(var j = 0; j < method.tests.length; j++) {
			if(j > 0) {
				name += "x";
			}
			testFile[testFile.length] = addTestWrapper(name, method.tests[j].decode()) + "\n";
		}
	}
}

var indexFile = readFile( "web/javascript/test/index.html" );
writeFile( dir + "/index.html", indexFile.replace( /{TESTS}/g, testFile.join("\n") ) );
