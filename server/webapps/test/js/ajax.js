

// AJAX  handler
var ajax = 
{
  poll: true,
  _first: true,
  _pollEvent: function(first) {},
  _handlers: new Array(),
  
  _messages:0,
  _messageQueue: '',
  _queueMessages: false,
  
  
  _xhr: function(method,uri,body,handler)
  {
  	var req=null;
  	
    if (window.XMLHttpRequest) { // Non-IE browsers
      	req = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) { // IE
      	req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
    req.onreadystatechange=function()
    {
    	if (req.readyState==4) 
    	{
    		try
    		{
    	    	handler(req);
    		}
    		catch(e)
    		{
    		    window.status="ERROR: xhr "+e.name + ": " + e.message;
    			// alert(e.name+" "+e.message);
    		}
    	}
    }
	
    if (body!=null)
    {
       req.open(method,uri,true);
       req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	   req.send(body);
    }
    else
    {
	   req.open(method,uri,true);
       req.send(null);
    }
  },
  
  _messageHandler: function(request) 
  {
    var qm=ajax._queueMessages;
    ajax._queueMessages=true;
    try
    {
      if (request.status == 200)
      {
        var response = request.responseXML.getElementsByTagName("ajax-response");
        if (response != null && response.length == 1)
        {
          var responses = response[0].getElementsByTagName("response");
	  
          for ( var i = 0 ; i < responses.length ; i++ ) 
          {
            var responseElement = responses[i];
	    
            // only process nodes of type element.....
            if ( responseElement.nodeType != 1 )
              continue;

            var id   = responseElement.getAttribute('id');
            
            var handler = ajax._handlers[id];
	    
	    if (handler!=null)
            {
              for (var j = 0; j < responseElement.childNodes.length; j++) 
              {
                var child = responseElement.childNodes[j]
                if (child.nodeType == 1) 
                {
                  handler(child);
                }
              }
            }
          }
        }
      }
    }
    catch(e)
    {
    	window.status="ERROR: _messageHandler "+e.name + ": " + e.message;
      // alert(e.name + ": " + e.message);
    }
    ajax._queueMessages=qm;
    
    if (!ajax._queueMessages && ajax._messages>0)
    {
      var body = ajax._messageQueue;
      ajax._messageQueue='';
      ajax._messages=0;
      
      ajax._xhr('POST','.',body,ajax._pollHandler);
      
    }
  },
  
  _pollHandler: function(request) 
  {
    if (request.status != 200)
      return;
      
    ajax._queueMessages=true;
    try
    {
      ajax._messageHandler(request);
      ajax._pollEvent(ajax._first);
      ajax._first=false;
    }
    catch(e)
    {
    	window.status="ERROR: pollHandler "+e.name + ": " + e.message;
      // alert(e.name + ": " + e.message);
    }
    
    ajax._queueMessages=false;
    
    if (ajax._messages==0)
    {
      if (ajax.poll)
        ajax._xhr('POST','.?ajax=poll&message=poll',null,ajax._pollHandler);
    }
    else
    {
      var body = ajax._messageQueue+'&ajax=poll&message=poll';
      ajax._messageQueue='';
      ajax._messages=0;
      ajax._xhr('POST','.',body,ajax._pollHandler);
    }
  },
  
  addPollHandler : function(func)
  {
    var old = ajax._pollEvent;
    ajax._pollEvent = function(first) 
    {
      old(first);
      func(first);
    }
  },
  
  // Listen on a channel or topic.   handler must be a function taking a message arguement
  addListener : function(id,handler)
  {   
    ajax._handlers[id]=handler;
  },
  
  // remove Listener from channel or topic.  
  removeListener : function(id)
  {   
    ajax._handlers[id]=null;
  },
  
  sendMessage : function(destination,message)
  {
    message=message.replace('%','%25');
    message=message.replace('&','%26');
    message=message.replace('=','%3D');
    if (ajax._queueMessages)
    {
      ajax._messageQueue+=(ajax._messages==0?'ajax=':'&ajax=')+destination+'&message='+message;
      ajax._messages++;
    }
    else
    {
      ajax._xhr('POST','.','ajax='+destination+'&message='+message,ajax._messageHandler);
    }
  },
  
  _startPolling : function()
  {
    if (ajax.poll)
      ajax._xhr('POST','.?ajax=poll&message=poll&timeout=0',null,ajax._pollHandler);
  },
  
  getContentAsString: function( parentNode ) {
      return parentNode.xml != undefined ?
         ajax._getContentAsStringIE(parentNode) :
         ajax._getContentAsStringMozilla(parentNode);
  },

  _getContentAsStringIE: function(parentNode) {
     var contentStr = "";
     for ( var i = 0 ; i < parentNode.childNodes.length ; i++ ) {
         var n = parentNode.childNodes[i];
         if (n.nodeType == 4) {
             contentStr += n.nodeValue;
         }
         else {
           contentStr += n.xml;
       }
     }
     return contentStr;
  },

  _getContentAsStringMozilla: function(parentNode) {
     var xmlSerializer = new XMLSerializer();
     var contentStr = "";
     for ( var i = 0 ; i < parentNode.childNodes.length ; i++ ) {
          var n = parentNode.childNodes[i];
          if (n.nodeType == 4) { // CDATA node
              contentStr += n.nodeValue;
          }
          else {
            contentStr += xmlSerializer.serializeToString(n);
        }
     }
     return contentStr;
  }
  
};

var EvUtil =
{
    getKeyCode : function(ev)
    {
        var keyc;
        if (window.event)
            keyc=window.event.keyCode;
        else
            keyc=ev.keyCode;
        return keyc;
    }
};

Behaviour.addLoadEvent(ajax._startPolling);  

