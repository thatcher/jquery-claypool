/**
 * SDB Implementation for jQuery
 * @author thatcher
 */
(function($){
    var connections = {
        //accessKeyId, secretKey, endpoint, version
        'default':{
            endpoint:'https://sdb.amazonaws.com/',
            accessKeyId:'[valid access key id]',
            secretKey:'secretkey',
            version:'2009-04-15'
        }
    };
    var log = {
        debug:function(){return this;},
        info:function(){return this;},
        warn:function(){return this;},
        error:function(){return this;},
        exception:function(){return this;}
    };
    
    /**
     * @constructor
     */
    $.sdb = function(options){
        this.connections = {};
        $.extend(true, this.connections, connections, options);
        if($.isFunction($.logger)){
            log = $.logger('jQuery.plugins.sdb');
			log.debug('endpoint : %s', this.connections['default'].endpoint).
			    debug('accessKeyId : %s', this.connections['default'].accessKeyId);
        }
        return this;
    };
    
    $.extend($.sdb.prototype,{
        /**
         * @implements CreateDomain
         */
        create: function(options){
            //CreateDomain
            //  - operation only available at the domian level
            var data = connection(this, options),
                params = {};
            $.extend(params, {
                Action:'CreateDomain',
                DomainName:options.domain||''
            });
            return sdb(params, data, $$.ok, $$.error);
        },
        /**
         * @implements DeleteDomain
         */
        destroy: function(options){
            var data = connection(this, options),
                params = {};
            if (options.domain) {
                //DeleteDomain
                $.extend(params, {
                    Action:'DeleteDomain',
                    DomainName:options.domain
                });
                return sdb(params, data, $$.ok, $$.error);
            }
        },
        /**
         * @implements DeleteAttribute
         */
        remove: function(options){
            var data = connection(this, options),
                params = {},
                //prop,
                i = 0;
            //if no attributes are specified the entire item is deleted!
            if(options.domain&&options.id){
                //DeleteAttributes
                $.extend(params, {
                    Action:'DeleteAttributes',
                    DomainName:options.domain,//required
                    ItemName:options.id//required
                });
                if(options.data&&(options.data instanceof Array)){
                    //array of names to delete
                    for(i=0;i<options.data.length;i++){
                        params['Attribute.'+i+'.Name']=options.data[i];
                    }
                }else{
                    //object of names/value pairs to delete
                    for(var prop in options.data){
                        params['Attribute.'+i+'.Name']=prop;
                        params['Attribute.'+i+'.Value']=options.data[prop];
                        i++;
                    }
                }
                return sdb(params, data, $$.ok, $$.error);
            }
        },
        /**
         * @implements DomainMetadata
         */
        metadata: function(options){
            //DomainMetadata
            //  - operation only available at the domian level
            var data = connection(this, options),
                params = {};
            $.extend(params, {
                Action:'DomainMetadata',
                DomainName:options.domain||''//required
            });
            return sdb(params, data, $$.domaindata, $$.error);
        },
        /**
         * @implements PutAttributes, BatchPutAttributes
         */
        save: function(options){
            var data = connection(this, options),
                params = {},
                i = j = 0;
			log.debug('save options domain(%s), id(%s), batch(%s)',
			     options.domain, options.id, options.batch);
            if (!options.id && options.batch && options.domain) {
                //  - no options.item implies a batch operation
                // BatchPutAttributes
                
                $.extend(params, {
                    Action:'BatchPutAttributes',
                    DomainName:options.domain//required
                });
                
                //data is an object of id's whose values are the data do be stored
                for (var name in options.data) {
                    
                    log.debug('item name: \n%s', name);
                    params['Item.'+i+'.ItemName']=name;
                    j=0;
                    for(var prop in options.data[name]){
                        log.debug('item prop: \n%s=%s', prop, options.data[name][prop]);
                        if(options.data[name][prop] instanceof Array){
                            for(var k=0;k<options.data[name][prop].length;k++){
                                if(k==0){
                                    //only use replace once or else only the last item 
                                    //in the array will be saved
                                    params['Item.'+i+'.Attribute.'+j+'.Replace']=(options.add)?'false':'true';
                                }
                                params['Item.'+i+'.Attribute.'+j+'.Name']=prop;
                                params['Item.'+i+'.Attribute.'+j+'.Value']=options.data[name][prop][k];
                                j++;
                            }
                        }else{
                            params['Item.'+i+'.Attribute.'+j+'.Name']=prop;
                            params['Item.'+i+'.Attribute.'+j+'.Value']=options.data[name][prop];
                            params['Item.'+i+'.Attribute.'+j+'.Replace']=(options.add)?'false':'true';
                            j++;
                        }
                    }
                    i++;
                }
                sdb(params, data, $$.ok, $$.error);
            }else if(options.id&&options.domain){
                log.debug('saving item to domain', options.id, options.domain);
                //PutAttributes
                $.extend(params, {
                    Action:'PutAttributes',
                    DomainName:options.domain,//required,
                    ItemName:options.id//required
                });
                if(options.data){
                    for(var prop in options.data){
                        if(options.data[prop] instanceof Array){
                            for(var k=0;k<options.data[prop].length;k++){
                                if(k==0){
                                    //only use replace once or else only the last item 
                                    //in the array will be saved
                                    params['Attribute.'+j+'.Replace']=(options.add)?'false':'true';
                                }
                                params['Attribute.'+j+'.Name']=prop;
                                params['Attribute.'+j+'.Value']=options.data[prop][k];
                                j++;
                            }
                        }else{
                            params['Attribute.'+j+'.Name']=prop;
                            params['Attribute.'+j+'.Value']=options.data[prop];
                            params['Attribute.'+j+'.Replace']=(options.add)?'false':'true';
                            j++;
                        }
                    }
                }
                return sdb(params, data, $$.ok, $$.error);
            }else{
                log.debug('no case for save');
            }
        },
        add: function(options){
            //does not overwrtie existing fields, just adds values to them
            return this.save($.extend(options, {add:true}));
        },
        /**
         * $.sdb.get
         * 
         * @implements ListDomains, GetAttributes
         * @options Object
         *     max Number         - The maximum number of domain names you want 
         *                        - returned. (not required)
         *     range Number       - 1 to 100 (default  - 100) 
         *     next String        - that tells Amazon SimpleDB where to start the 
         *                        - next list of domain names. (not required) 
         *         
         * Exceptions  
         *     InvalidParameterValue  - Value (" + value + ") for parameter 
         *                            - 'max'  is invalid. 'max' must be between 
         *                            - 1 and 100.
         *     InvalidNextToken       - The specified next token is not valid.
         *            
         */
        get: function(options){
            var data = connection(this, options),
                params = {},
                select;
            if (!options.id && !options.domain) {
                //ListDomains
                //  - no options.item implies a domain list operation
                $.extend(params, {
                    Action:'ListDomains',
                    MaxNumberOfDomains:options.max||'100',
                    NextToken:options.next||''
                });
                return sdb(params, data, $$.domains, $$.error);
            }else if(!options.id && options.domain){
                //response is list of item names for the domain
                return this.find(
                    $.extend(options,{
                        select:"select itemName() from `"+options.domain+"`"
                    })
				);
            }else if(options.id && !(typeof(options.id) == 'string') && options.domain ){
                //retrieves a list of items
                select = 'select ';
                select += options.data&&(options.data instanceof Array)?
                                ' (`'+options.data.join("`,`")+'`) ':
                                ' * ';
                select += ' from `'+options.domain+'` where itemName() in '+
                            ' (`'+options.id.join("`,`")+'`) ';
                return this.find(
                    $.extend(options,{
                        select:select
                    })
                );
            }else if(options.id && options.domain && typeof(options.id)=='string'){
                //retrieves a single item
                $.extend(params, {
                    Action:'GetAttributes',
                    DomainName:options.domain,//required
                    ItemName:options.id//required
                });
                if(options.data&&options.data.length){
                    for(var i=0;i<options.data.length;i++){
                        params["AttributeName."+(i+1)] = options.data[i];
                    }
                }
                return sdb(params, data, $$.item, $$.error);
            }
        },
        /**
         * @implements Select
         */
        find: function(options){
            var data = connection(this, options),
                params = {};
            $.extend(params, {
                Action:'Select',
                SelectExpression:options.select,//required
                NextToken:options.next||''
            });
            return sdb(params, data, $$.items, $$.error);
        },
        
        js2query : function(query){
            //Handle the basic selection predicate and set context 
            var select = 'select `'+query.selectors.join('`,`')+'` ' +
                    'from `'+query.context+'` ';
            //walk through all our expressions
            if(query.expressions.length){
                for(var i=0;i<query.expressions.length;i++){
                    select += ' ';
                    select += i?query.expressions[i].type:'where';
                    select += ' ';
                    switch(query.expressions[i].operator){
                        case '=':
                            select += 
                                '`'+query.expressions[i].name+'` = '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '!=':
                            select += 
                                '`'+query.expressions[i].name+'` != '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '~':
                            select += 
                                '`'+query.expressions[i].name+'` like '+
                                '"'+query.expressions[i].value.replace('*','%')+'" ' 
                            break;
                        case '!~':
                            select += 
                                '`'+query.expressions[i].name+'` not like '+
                                '"'+query.expressions[i].value.replace('*','%')+'" ' 
                            break;
                        case '>':
                            select += 
                                '`'+query.expressions[i].name+'` > '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '>=':
                            select += 
                                '`'+query.expressions[i].name+'` >= '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '><':
                            select += 
                                '`'+query.expressions[i].name+'` between '+
                                '"'+query.expressions[i].value[0]+'" and ' 
                                '"'+query.expressions[i].value[1]+'" ' 
                            break;
                        case '<':
                            select += 
                                '`'+query.expressions[i].name+'` < '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '<=':
                            select += 
                                '`'+query.expressions[i].name+'` <= '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '@':
                            select += 
                                '`'+query.expressions[i].name+'` in '+
                                '("'+query.expressions[i].value.join('","')+'") ' 
                            break;
                        case '!@':
                            select += 
                                '`'+query.expressions[i].name+'` not in '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                    }
                }
                if(query.orderby&&query.orderby.name){
                    select += ' order by '+query.orderby.name+' '+
                        (query.orderby.direction&&query.orderby.direction=='reverse')?' desc ':'';
                }
                if(query.limit){
                    select +=  ' limit '+query.limit+' ';
                }
                return select;
            }
        }
        
    });

    /**
     * xml -> json implementation for aws sdb responses
     * 
     *     when e4x is available we prefer it, otherwise we use
     *     jquery.  this is because on the server its still
     *     generally much faster since the pure js xml parser
     *     isnt nearly as fast as the native couterparts
     */
    var $$;
    if(XML && XMLList){
        default xml namespace = "http://sdb.amazonaws.com/doc/2009-04-15/";
        $$ = {
            dataType:'text',
            x : function(text){
                text = text.substring('<?xml version="1.0"?>\n'.length, text.length);
                log.debug('response \n%s\n', text);
                var xml = new XMLList(text);
                //case specific response elements
                return xml;
            },
            meta : function(result, xml, data, iserror){
                result.$xmlns$db = 'http://sdb.amazonaws.com/doc/2009-04-15';
                if(data.DomainName){
                    result.$db$domain = data.DomainName;
                }
                if(data.ItemName){
                    result.$db$id = data.ItemName;
                }
                var responseMetadata;
                if(xml){
                    if(iserror){
                        result.$db$request = xml..*::RequestID.text()+'';
                        result.$db$cpu = xml..*::BoxUsage.text()+'';
                    }else{
                        responseMetadata = xml.*::ResponseMetadata;
                        result.$db$request = responseMetadata.*::RequestId.text()+'';
                        result.$db$cpu = responseMetadata.*::BoxUsage.text()+'';
                    }
                }else{
                    result.$db$request = 'unknown';
                    result.$db$cpu = 'unknown';
                }
                return result;
            },
            items: function(result, data){
                var xml = $$.x(result);
                //expected response elements
                var items = xml..*::Item,
                    resultset = [],
                    record,
                    id;
                    
                for each (var item in items){
                    id = item.*::Name.text()+'';
                    record = {$db$id:id};
                    $$.attributes(record, item.*::Attribute);
                    resultset.push(record);
                };
                return $$.meta({db$data:resultset}, xml, data);
            },
            item: function(result, data){
                var xml = $$.x(result);
                //case specific response elements
                var item = {},
                    attributes = xml..*::Attribute;
                $$.attributes(item, attributes);
                return $$.meta({db$data:[item]}, xml, data);
            },
            attributes: function(item, attributes){
                var attribute,
                    name,
                    value,
                    tmp;
                for each(attribute in attributes){
                    name = attribute.*::Name.text()+'';
                    value = attribute.*::Value.text()+'';
                    log.debug('item[%s]=%s', name, value);
                    if(item[name]){
                        //its a multi-valued attribute
                        if(item[name] instanceof Array){
                            //add to existing array
                            item[name][item[name].length]=value;
                        }else{
                            //store attribute value temporarily
                            //and replace with array
                            tmp = item[name];
                            item[name] = [tmp, value];
                        }
                    }else{
                        item[name]=value;
                    }
                }
            },
            names: function(result, data){
                var xml = $$.x(result);
                //expected response elements
                var names = xml..*::Name,
                    list = [];
                log.debug('names %s', names);
                for each (var name in names){
                   list[list.length] = name.text()+'';
                   log.debug('name %s', list[list.length]);
                };
                return $$.meta({$db$ids:list}, xml, data);
            },
            error : function(xhr, status, data, e){
                //need to do more to translate the xml 
                //error response into json format
                var xml,
                    error = {db$error:{}};
                if(xhr&&xhr.status&&xhr.responseText){
                    xml = $$.x(xhr.responseText);
                    $.extend(error.db$error,{
                        $code: xhr.getResponseHeader('status'),
                        $type:xml..*::Code.text()+'',
                        $msg:xml..*::Message.text()+''
                    });
                }else{
                    $.extend(error.db$error,{
                        $code: 500,
                        $type:'UnknownClaypoolWrapperError',
                        $msg:"status ("+status+")\n"+e
                    });
                }
                return $$.meta(error, xml, data, true);
            },
            ok:function(result, data){
                var xml = $$.x(result);
                return $$.meta({}, xml, data);
            },
            domains:function(result, data){
                var xml = $$.x(result);
                //expected response elements
                var domains = xml..*::DomainName,
                    domain,
                    list = [];
                log.debug('domains %s', domains);
                for each (domain in domains){
                   list[list.length] = domain.text()+'';
                   log.debug('domain %s', list[list.length]);
                } 
                return $$.meta({$db$domains:list}, xml, data);
            },
            domaindata: function(result, data){
                var xml = $$.x(result);
                var domain = xml..*::DomainMetadataResult,
                    metadata = {};
                $.extend(metadata, {
                    '$db$count':Number(domain.*::ItemCount+''),
                    '$db$timestamp':Number(domain.*::Timestamp+''),
                    '$db$namesize':Number(domain.*::AttributeNamesSizeBytes.text()+''),
                    '$db$valuesize':Number(domain.*::AttributeValuesSizeBytes.text()+''),
                    '$db$size':(Number(domain.*::ItemNamesSizeBytes.text()+'')+
                          Number(domain.*::AttributeNamesSizeBytes.text()+'')+
                          Number(domain.*::AttributeValuesSizeBytes.text()+''))
                });
                return $$.meta(metadata, xml, data);
            }
        };
    }else{ 
        //default implementation of aws xml scrapper
        //uses jquery to sift out fields
        $$ = {
            dataType:'xml',
            x : function(xml){
                return $(xml);
            },
            meta : function(result, xml){
                var responseMetadata = $('ResponseMetadata',xml);
                result.$db$request = $('RequestId',responseMetadata).text()+'';
                result.$db$cpu = $('BoxUsage',responseMetadata).text()+'';
                return result;
            }
        };
    }
//load default connection details
function connection(db, options){
    var data = {};
    if (options.connection && db.connections[options.connection]){
        $.extend(data, db.connections[options.connection], options);
        options.connection = '';
    }else{
        $.extend(data, db.connections['default'], options);
    }
    return data;
};


/////////////////// Internal generalized implementation //////////////////////
function sdb(params, options, success, error) {
    //actionName, options, accessKeyId, secretKey, endpoint, version
    var url = options.endpoint,
        method = options.method?options.method:'GET';
    var data = $.extend({
            SignatureVersion:2,
            SignatureMethod:'HmacSHA256',
            Version:options.version,
            Timestamp: getNowTimeStamp(),
            AWSAccessKeyId: options.accessKeyId
        }, params);
    var signable = getStringToSign(method, url, data);
    log.debug("signable: \n%s\n", signable);
    $.extend(data, {
        Signature:generateV2Signature(
            signable, 
            options.secretKey
        )
    });
    var request = {};
	log.debug('sdb - async (%s)', options.async);
    $.extend(request, {
        url:url,
        type:method,
        data: data,
        dataType:$$.dataType,
        async: (options.async !== undefined)?options.async:true,
        beforeSend: function(xhr){
            var prop,
                haveHost = false,
                host;
            /*for(prop in xhr.headers){
                log.debug("requestHeader[%s]=%s", prop, xhr.headers[prop]);
                 if(prop == 'host'){haveHost = true;}
            }*/
            if(!haveHost && $.isFunction($.env)){
                host = $.env('host');
                log.debug('adding host header %s', host);
                xhr.setRequestHeader('Host',host);
                xhr.setRequestHeader('User-Agent','Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.0.11) Gecko/2009060214 Firefox/3.0.11');
                xhr.setRequestHeader('Accept-Language','en-us,en;q=0.5');
                xhr.setRequestHeader('Accept-Encoding','gzip,deflate');
                xhr.setRequestHeader('Accept-Charset','ISO-8859-1,utf-8;q=0.7,*;q=0.7');
                xhr.setRequestHeader('Keep-Alive','300');
                xhr.setRequestHeader('Connection','keep-alive');
            }
            /*for(prop in data){
                log.debug("requestParameter[%s]=%s", prop, data[prop]);
            }*/
        },
        success:function(response){
            if(options.success&&$.isFunction(options.success)){
                options.success(success(response, data));
            }
        },
        error:function(xhr, status, e){
            log.error('failed. %s', status).
                error('response text:\n\n%s', xhr.responseText).
                exception(e);
            if(options.error&&$.isFunction(options.error)){
                options.error(error(xhr, status, data, e));
            }
        }
    });
    
    return  $.ajax(request);
};
//Safely ignore everything below here as someone much smarter than me wrote it.
    
    
/////////////////// Auth /////////////////////////////////////////////////////
function toISODate(date){
    return date.getFullYear()+'-'+
        addZero(date.getMonth()+1)+'-'+
        addZero(date.getDate())+'T'+
        addZero(date.getHours())+':'+
        addZero(date.getMinutes())+':'+
        addZero(date.getSeconds())+'Z';
};
           

function addZero(n) {
    return ( (n+'').length == 1 ? "0" : "" ) + n;
};

function getNowTimeStamp() {
    var time = new Date();
    var gmtTime = new Date(time.getTime() + (time.getTimezoneOffset() * 60000));
    return toISODate(gmtTime) ;
};

function ignoreCaseSort(a, b) {
    var ret = 0;
    a = a;//.toLowerCase();
    b = b;//.toLowerCase();
    if(a > b) ret = 1;
    if(a < b) ret = -1;
    return ret;
};

function generateV2Signature(value, key) {
    var signedbytes = hmac_sha256(key, value, true);
    var signed = Base64.encode(signedbytes);
    return signed;
};

/////////////////// String To Sign /////////////////////////////////////////////////////
function getStringToSign(method, requestUri, data) {
    var host = window.location.host.toLowerCase();
    //TODO: this is due to bug in env-js.
    host = (host==':')?$.env('host'):host;
    return method.toUpperCase()+'\n'+
        host+'\n'+
        '/'+'\n'+                //requestUri+'\n'+
        getCanonicalizedQueryString(data);
};

//this ugly little piece of code is required for
//use inside rhino since the encoding is not 
//uppercase (eg %ab instead of %AB)
var encoder;
if(encodeURIComponent('=')=='%3d'){
     encoder = function(s){
         return java.net.URLEncoder.encode(s, "UTF-8")
                     .replaceAll("\\+", "%20")
                     .replaceAll("\\%21", "!")
                     .replaceAll("\\%27", "'")
                     .replaceAll("\\%28", "(")
                     .replaceAll("\\%29", ")")
                     .replaceAll("\\%7E", "~");
    };

}else{
    encoder = function(s){
        return encodeURIComponent(s);
    };
}

function getCanonicalizedQueryString(data){
    var propArray = [],
        stringToSign = '';
    for(var prop in data){
        if (!prop.match(/^Signature$/)) {
            propArray.push(prop);
        }
    }
    propArray.sort();
    
    for (var i = 0; i < propArray.length; i++) {
            stringToSign += ((i===0)?'':'&')+
                encoder(propArray[i])+'='+
                encoder(data[propArray[i]]);
    }

    return stringToSign.
                replace(/\~/g, '%7E').
                replace(/\!/g, '%21').
                replace(/\*/g, '%2A').
                replace(/\(/g, '%28').
                replace(/\)/g, '%29').
                replace(/\'/g, '%27');
};



/*
	Copyright 2008 SLB Software, LLC.

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Compute an HMAC based on SHA-256 using the supplied key and message data.
 * key - a secret encryption key.  can be either a string or an array of bytes.
 * data - the message to be hashed.  can be either a string or an array of bytes.
 * returnBytes - optional, defaults to false.
 * If returnBytes is false, then the hash value is returned as a 64 
 * hexadecimal-character string.
 * If returnBytes is true, then the hash value is returned as a 32 byte array.
 */
function hmac_sha256(key, data, returnBytes) {
	var	keyBytes, i, ipad, opad, dataBytes;

	if (key.length > 64) {
		keyBytes = sha256(key, true);
	} else if (typeof(key) == "string") {
		keyBytes = [];
		for (i = 0 ; i < key.length ; ++i)
			keyBytes[i] = key.charCodeAt(i);
	} else
		keyBytes = key;

	ipad = [];
	opad = [];
	for (i = 0 ; i < keyBytes.length ; ++i) {
		ipad[i] = keyBytes[i] ^ 0x36;
		opad[i] = keyBytes[i] ^ 0x5c;
	}
	for ( ; i < 64 ; ++i) {
		ipad[i] = 0x36;
		opad[i] = 0x5c;
	}

	if (typeof(data) == "string") {
		dataBytes = [];
		for (i = 0 ; i < data.length ; ++i)
			dataBytes[i] = data.charCodeAt(i);
	} else
		dataBytes = data;

	return sha256(opad.concat(sha256(ipad.concat(dataBytes), true)), returnBytes);
}

/**
 * Computes an SHA-256 hash.
 * data - the data to be hashed.  can be either a string or an array of bytes.
 * returnBytes - optional, defaults to false.
 * If returnBytes is false, then the hash value is returned as a 64 
 * hexadecimal-character string.
 * If returnBytes is true, then the hash value is returned as a 32 byte array.
 * Returns an array of 32 bytes: the computed hash value.
 */
function sha256(data, returnBytes) {
	function add(x, y) {
		return (x + y) & 0xffffffff;
	}

	function rot(x, n) {
		return (x >>> n) | (x << (32 - n));
	}

	function unpack(dword, dest) {
		dest.push((dword >>> 24) & 0xff);
		dest.push((dword >>> 16) & 0xff);
		dest.push((dword >>> 8) & 0xff);
		dest.push(dword & 0xff);
	}

	function dwordToHex(dword) {
		return (0x10000 + ((dword >>> 16) & 0xffff)).toString(16).substring(1)
			  + (0x10000 + ( dword         & 0xffff)).toString(16).substring(1);
	}

	var	bin, l, h0, h1, h2, h3, h4, h5, h6, h7, w, a, b, c, d, e, f, g, h, i, j, T1, T2;

	// pack input bytes into 32 bit words
	bin = [];
	if (typeof(data) == "string") {
		for (i = 0 ; i < data.length ; ++i)
			bin[i >> 2] |= (data.charCodeAt(i) & 0xff) << ((3 - (i & 3)) << 3);
	} else {
		for (i = 0 ; i < data.length ; ++i)
			bin[i >> 2] |= (data[i] & 0xff) << ((3 - (i & 3)) << 3);
	}

	// append a 1 bit
	l = data.length << 3;
	bin[data.length >> 2] |= 0x80 << (24 - (l & 31));

	// append 0 bits until length in bits % 512 == 448
	while ((bin.length & 15) != 14)
		bin.push(0);

	// append 64-bit source length
	bin.push(0);
	bin.push(l);

	// initial hash value
	h0 = 0x6a09e667;
	h1 = 0xbb67ae85;
	h2 = 0x3c6ef372;
	h3 = 0xa54ff53a;
	h4 = 0x510e527f;
	h5 = 0x9b05688c;
	h6 = 0x1f83d9ab;
	h7 = 0x5be0cd19;

	// update hash with each input block
	w = [];
	for (i = 0 ; i < bin.length ; i += 16) {
		a = h0;
		b = h1;
		c = h2;
		d = h3;
		e = h4;
		f = h5;
		g = h6;
		h = h7;

		for (j = 0 ; j < 64 ; ++j) {
			if (j < 16)
				w[j] = bin[j + i];
			else {
				T1 = w[j - 2];
				T2 = w[j - 15];

				w[j] =
						add(
							add(
								add(
									(rot(T1, 17) ^ rot(T1, 19) ^ (T1 >>> 10)),
									w[j - 7]
								),
								(rot(T2, 7) ^ rot(T2, 18) ^ (T2 >>> 3))
							),
							w[j - 16]
						);
			}

			T1 =
					add(
						add(
							add(
								add(
									h,
									(rot(e, 6) ^ rot(e, 11) ^ rot(e, 25))
								),
								((e & f) ^ ((~e) & g))
							),
							[
								0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
								0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
								0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
								0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
								0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
								0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
								0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
								0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
							][j]
						),
						w[j]
					);

			T2 =
					add(
						(rot(a, 2) ^ rot(a, 13) ^ rot(a, 22)),
						((a & b) ^ (a & c) ^ (b & c))
					);

			h = g;
			g = f;
			f = e;
			e = add(d, T1);
			d = c;
			c = b;
			b = a;
			a = add(T1, T2);
		}

		h0 = add(a, h0);
		h1 = add(b, h1);
		h2 = add(c, h2);
		h3 = add(d, h3);
		h4 = add(e, h4);
		h5 = add(f, h5);
		h6 = add(g, h6);
		h7 = add(h, h7);
	}

	if (returnBytes) {
		// convert to byte array
		bin = [];
		unpack(h0, bin);
		unpack(h1, bin);
		unpack(h2, bin);
		unpack(h3, bin);
		unpack(h4, bin);
		unpack(h5, bin);
		unpack(h6, bin);
		unpack(h7, bin);

		return bin;
	} else {
		// convert to string
		return dwordToHex(h0)
			  + dwordToHex(h1)
			  + dwordToHex(h2)
			  + dwordToHex(h3)
			  + dwordToHex(h4)
			  + dwordToHex(h5)
			  + dwordToHex(h6)
			  + dwordToHex(h7);
	}
}

/*****
*
*   Base64.js
*
*   copyright 2003, Kevin Lindsey
*   licensing info available at: http://www.kevlindev.com/license.txt
*
*****/

/*****
*
*   encoding table
*
*****/
Base64.encoding = [
    "A", "B", "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N", "O", "P",
    "Q", "R", "S", "T", "U", "V", "W", "X",
    "Y", "Z", "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u", "v",
    "w", "x", "y", "z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9", "+", "/"
];


/*****
*
*   constructor
*
*****/
function Base64() {}


/*****
*
*   encode
*
*****/
Base64.encode = function(data) {
    var result = [];
    var ip57   = Math.floor(data.length / 57);
    var fp57   = data.length % 57;
    var ip3    = Math.floor(fp57 / 3);
    var fp3    = fp57 % 3;
    var index  = 0;
    var num;
    
    for ( var i = 0; i < ip57; i++ ) {
        for ( j = 0; j < 19; j++, index += 3 ) {
            num = data[index] << 16 | data[index+1] << 8 | data[index+2];
            result.push(Base64.encoding[ ( num & 0xFC0000 ) >> 18 ]);
            result.push(Base64.encoding[ ( num & 0x03F000 ) >> 12 ]);
            result.push(Base64.encoding[ ( num & 0x0FC0   ) >>  6 ]);
            result.push(Base64.encoding[ ( num & 0x3F     )       ]);
        }
        result.push("\n");
    }

    for ( i = 0; i < ip3; i++, index += 3 ) {
        num = data[index] << 16 | data[index+1] << 8 | data[index+2];
        result.push(Base64.encoding[ ( num & 0xFC0000 ) >> 18 ]);
        result.push(Base64.encoding[ ( num & 0x03F000 ) >> 12 ]);
        result.push(Base64.encoding[ ( num & 0x0FC0   ) >>  6 ]);
        result.push(Base64.encoding[ ( num & 0x3F     )       ]);
    }

    if ( fp3 == 1 ) {
        num = data[index] << 16;
        result.push(Base64.encoding[ ( num & 0xFC0000 ) >> 18 ]);
        result.push(Base64.encoding[ ( num & 0x03F000 ) >> 12 ]);
        result.push("==");
    } else if ( fp3 == 2 ) {
        num = data[index] << 16 | data[index+1] << 8;
        result.push(Base64.encoding[ ( num & 0xFC0000 ) >> 18 ]);
        result.push(Base64.encoding[ ( num & 0x03F000 ) >> 12 ]);
        result.push(Base64.encoding[ ( num & 0x0FC0   ) >>  6 ]);
        result.push("=");
    }

    return result.join("");
};


})(jQuery);
